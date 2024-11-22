import mongoose from 'mongoose';

const votingDateSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const VotingDate = mongoose.model('VotingDate', votingDateSchema);