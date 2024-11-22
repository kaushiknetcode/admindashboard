import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { db } from './index.js';
import { logger } from '../utils/logger.js';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function migrate() {
  try {
    logger.info('Starting database migration...');

    // Read and execute schema.sql
    const schema = await fs.readFile(
      path.join(__dirname, 'schema.sql'),
      'utf-8'
    );
    await db.query(schema);
    logger.info('Schema created successfully');

    // Insert initial data
    const users = [
      // Super Admin
      ['super_admin', await hashPassword('admin2024'), 'SUPER_ADMIN', 0],
      // APOs
      ['hq_apo', await hashPassword('hq2024'), 'APO', 1],
      ['malda_apo', await hashPassword('malda2024'), 'APO', 2],
      ['hwh_apo', await hashPassword('hwh2024'), 'APO', 3],
      ['sdah_apo', await hashPassword('sdah2024'), 'APO', 4],
      ['llh_apo', await hashPassword('llh2024'), 'APO', 5],
      ['kpa_apo', await hashPassword('kpa2024'), 'APO', 6],
      ['jmp_apo', await hashPassword('jmp2024'), 'APO', 7],
      ['asl_apo', await hashPassword('asl2024'), 'APO', 8],
      // POs
      ['hq_po', await hashPassword('hq@2024'), 'PO', 1],
      ['malda_po', await hashPassword('malda@2024'), 'PO', 2],
      ['hwh_po', await hashPassword('hwh@2024'), 'PO', 3],
      ['sdah_po', await hashPassword('sdah@2024'), 'PO', 4],
      ['llh_po', await hashPassword('llh@2024'), 'PO', 5],
      ['kpa_po', await hashPassword('kpa@2024'), 'PO', 6],
      ['jmp_po', await hashPassword('jmp@2024'), 'PO', 7],
      ['asl_po', await hashPassword('asl@2024'), 'PO', 8],
    ];

    for (const [username, password, role, placeId] of users) {
      await db.query(
        'INSERT INTO users (username, password, role, place_id) VALUES ($1, $2, $3, $4)',
        [username, password, role, placeId]
      );
    }
    logger.info('Users created successfully');

    const votingDates = [
      ['2024-12-04', false, false],
      ['2024-12-05', false, false],
      ['2024-12-06', false, false],
      ['2024-12-10', false, false],
    ];

    for (const [date, isActive, isComplete] of votingDates) {
      await db.query(
        'INSERT INTO voting_dates (date, is_active, is_complete) VALUES ($1, $2, $3)',
        [date, isActive, isComplete]
      );
    }
    logger.info('Voting dates created successfully');

    logger.info('Migration completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}