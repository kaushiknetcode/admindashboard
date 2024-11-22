import { VotingDate } from '../models/VotingDate.js';
import { logger } from '../utils/logger.js';

export const getVotingDates = async (req, res) => {
  try {
    const dates = await VotingDate.find().sort({ date: 1 });
    res.json(dates);
  } catch (error) {
    logger.error('Get voting dates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateDateStatus = async (req, res) => {
  try {
    const { date } = req.params;
    const { isActive, isComplete } = req.body;

    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // If activating a date, deactivate all others
    if (isActive) {
      await VotingDate.updateMany(
        { date: { $ne: date } },
        { $set: { isActive: false } }
      );
    }

    const updatedDate = await VotingDate.findOneAndUpdate(
      { date },
      { isActive, isComplete },
      { new: true }
    );

    if (!updatedDate) {
      return res.status(404).json({ error: 'Voting date not found' });
    }

    res.json(updatedDate);
  } catch (error) {
    logger.error('Update date status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const setCurrentDate = async (req, res) => {
  try {
    const { date } = req.body;
    const votingDate = await VotingDate.findOne({ date });

    if (!votingDate) {
      return res.status(404).json({ error: 'Voting date not found' });
    }

    res.json({ currentDate: date });
  } catch (error) {
    logger.error('Set current date error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};