import { db } from '../db/index.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

// Validation schema for voting data
const votingDataSchema = z.object({
  votesCount: z.number().int().positive(),
  maleVoters: z.number().int().min(0),
  femaleVoters: z.number().int().min(0),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const submitVotingData = async (req, res) => {
  try {
    const { votesCount, maleVoters, femaleVoters, date } = votingDataSchema.parse(req.body);
    const user = req.user;

    // Validate total votes match gender distribution
    if (votesCount !== (maleVoters + femaleVoters)) {
      return res.status(400).json({
        error: 'Validation Error',
        details: 'Total votes must equal sum of male and female voters'
      });
    }

    // Check if the date is active and not complete
    const dateResult = await db.query(
      'SELECT is_active, is_complete FROM voting_dates WHERE date = $1',
      [date]
    );

    if (!dateResult.rows[0] || !dateResult.rows[0].is_active || dateResult.rows[0].is_complete) {
      return res.status(400).json({
        error: 'Invalid Date',
        details: 'Selected date is not active or has been marked as complete'
      });
    }

    // Get total voters for the place
    const placeResult = await db.query(
      'SELECT total_voters FROM places WHERE id = $1',
      [user.place_id]
    );

    const totalVoters = placeResult.rows[0]?.total_voters || 0;

    // Get current total votes for this place
    const currentVotesResult = await db.query(
      'SELECT COALESCE(SUM(votes_count), 0) as total FROM voting_data WHERE place_id = $1',
      [user.place_id]
    );

    const currentTotalVotes = parseInt(currentVotesResult.rows[0].total);
    
    // Check if new votes would exceed total voters
    if (currentTotalVotes + votesCount > totalVoters) {
      return res.status(400).json({
        error: 'Validation Error',
        details: 'Total votes would exceed registered voters'
      });
    }

    // Use transaction to ensure data consistency
    const result = await db.transaction(async (client) => {
      return client.query(
        `INSERT INTO voting_data 
         (place_id, votes_count, male_voters, female_voters, date, submitted_by_user_id, submitted_by_role, submitted_by_place_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [user.place_id, votesCount, maleVoters, femaleVoters, date, user.id, user.role, req.body.placeName]
      );
    });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.errors
      });
    }
    
    logger.error('Submit voting data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getVotingData = async (req, res) => {
  try {
    const { date } = req.query;
    const query = date 
      ? 'SELECT * FROM voting_data WHERE date = $1 ORDER BY created_at DESC'
      : 'SELECT * FROM voting_data ORDER BY created_at DESC';
    const values = date ? [date] : [];
    
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    logger.error('Get voting data error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};