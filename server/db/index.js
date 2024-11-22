import pg from 'pg';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production',
  // Connection pool configuration
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  maxUses: 7500, // Close a connection after it has been used 7500 times
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  logger.debug('New client connected to the pool');
});

export const db = {
  query: async (text, params) => {
    const client = await pool.connect();
    try {
      const start = Date.now();
      const res = await client.query(text, params);
      const duration = Date.now() - start;
      logger.debug('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Duplicate entry detected');
      }
      if (error.code === '23503') { // Foreign key violation
        throw new Error('Referenced record does not exist');
      }
      logger.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  },
  getClient: () => pool.connect(),
  
  // Transaction helper
  transaction: async (callback) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};