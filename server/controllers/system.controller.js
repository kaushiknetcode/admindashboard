import { db } from '../db/index.js';
import { logger } from '../utils/logger.js';

export const resetSystem = async (req, res) => {
  try {
    // Only super admin can reset the system
    if (req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ 
        error: 'Unauthorized: Only Super Admin can perform system reset' 
      });
    }

    await db.transaction(async (client) => {
      // Clear all voting data
      await client.query('DELETE FROM voting_data');
      logger.info('Voting data cleared');

      // Reset voting dates to initial state
      await client.query(`
        UPDATE voting_dates 
        SET is_active = false, 
            is_complete = false,
            updated_at = CURRENT_TIMESTAMP
      `);
      logger.info('Voting dates reset');

      // Log the reset action
      await client.query(`
        INSERT INTO system_logs (action, performed_by)
        VALUES ($1, $2)
      `, ['SYSTEM_RESET', req.user.id]);
    });

    logger.info(`System reset performed by user ${req.user.username}`);
    res.json({ 
      message: 'System reset successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('System reset error:', error);
    res.status(500).json({ 
      error: 'Failed to reset system. Please try again or contact support.' 
    });
  }
};