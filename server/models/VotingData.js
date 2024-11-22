import mongoose from 'mongoose';

const votingDataSchema = new mongoose.Schema({
  placeId: {
    type: Number,
    required: true
  },
  votesCount: {
    type: Number,
    required: true
  },
  maleVoters: {
    type: Number,
    required: true
  },
  femaleVoters: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  submittedBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true
    },
    placeName: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

export const VotingData = mongoose.model('VotingData', votingDataSchema);