import { VotingData } from '../models/VotingData.js';
import { logger } from '../utils/logger.js';

export const getZonalStats = async (req, res) => {
  try {
    const { date } = req.query;
    const query = date ? { date } : {};

    const stats = await VotingData.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalVotes: { $sum: '$votesCount' },
          totalMale: { $sum: '$maleVoters' },
          totalFemale: { $sum: '$femaleVoters' }
        }
      }
    ]);

    res.json(stats[0] || { totalVotes: 0, totalMale: 0, totalFemale: 0 });
  } catch (error) {
    logger.error('Get zonal stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPlaceStats = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { date } = req.query;
    
    const query = {
      placeId: parseInt(placeId),
      ...(date && { date })
    };

    const stats = await VotingData.find(query)
      .sort({ createdAt: -1 })
      .limit(1);

    res.json(stats[0] || null);
  } catch (error) {
    logger.error('Get place stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDateWiseStats = async (req, res) => {
  try {
    const { placeId } = req.query;
    const query = placeId ? { placeId: parseInt(placeId) } : {};

    const stats = await VotingData.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$date',
          totalVotes: { $sum: '$votesCount' },
          maleVoters: { $sum: '$maleVoters' },
          femaleVoters: { $sum: '$femaleVoters' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(stats);
  } catch (error) {
    logger.error('Get datewise stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await VotingData.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('submittedBy.userId', 'username role');

    res.json(logs);
  } catch (error) {
    logger.error('Get activity logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};