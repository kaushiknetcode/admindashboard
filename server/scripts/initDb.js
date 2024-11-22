import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { VotingDate } from '../models/VotingDate.js';
import 'dotenv/config';

const users = [
  // Super Admin
  { username: 'super_admin', password: 'admin2024', role: 'SUPER_ADMIN', placeId: 0 },
  
  // APOs
  { username: 'hq_apo', password: 'hq2024', role: 'APO', placeId: 1 },
  { username: 'malda_apo', password: 'malda2024', role: 'APO', placeId: 2 },
  { username: 'hwh_apo', password: 'hwh2024', role: 'APO', placeId: 3 },
  { username: 'sdah_apo', password: 'sdah2024', role: 'APO', placeId: 4 },
  { username: 'llh_apo', password: 'llh2024', role: 'APO', placeId: 5 },
  { username: 'kpa_apo', password: 'kpa2024', role: 'APO', placeId: 6 },
  { username: 'jmp_apo', password: 'jmp2024', role: 'APO', placeId: 7 },
  { username: 'asl_apo', password: 'asl2024', role: 'APO', placeId: 8 },
  
  // POs
  { username: 'hq_po', password: 'hq@2024', role: 'PO', placeId: 1 },
  { username: 'malda_po', password: 'malda@2024', role: 'PO', placeId: 2 },
  { username: 'hwh_po', password: 'hwh@2024', role: 'PO', placeId: 3 },
  { username: 'sdah_po', password: 'sdah@2024', role: 'PO', placeId: 4 },
  { username: 'llh_po', password: 'llh@2024', role: 'PO', placeId: 5 },
  { username: 'kpa_po', password: 'kpa@2024', role: 'PO', placeId: 6 },
  { username: 'jmp_po', password: 'jmp@2024', role: 'PO', placeId: 7 },
  { username: 'asl_po', password: 'asl@2024', role: 'PO', placeId: 8 },
];

const votingDates = [
  { date: '2024-12-04', isActive: false, isComplete: false },
  { date: '2024-12-05', isActive: false, isComplete: false },
  { date: '2024-12-06', isActive: false, isComplete: false },
  { date: '2024-12-10', isActive: false, isComplete: false },
];

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await VotingDate.deleteMany({});

    // Create users
    await User.create(users);
    console.log('Users created successfully');

    // Create voting dates
    await VotingDate.create(votingDates);
    console.log('Voting dates created successfully');

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initializeDatabase();