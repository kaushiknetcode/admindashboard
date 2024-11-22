import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { io } from 'socket.io-client';
import { VotingData, Place, ActivityLog, VotingDate } from '../types';

const socket = io(process.env.NODE_ENV === 'production' 
  ? 'https://your-render-app.onrender.com'
  : 'http://localhost:5001');

interface VotingState {
  places: Place[];
  votingData: VotingData[];
  activityLogs: ActivityLog[];
  votingDates: VotingDate[];
  currentDate: string | null;
  addVotingData: (data: Omit<VotingData, 'timestamp'>) => void;
  getPlaceData: (placeId: number, date?: string) => VotingData[];
  getZonalData: (date?: string) => {
    totalVotes: number;
    totalMale: number;
    totalFemale: number;
    votingPercentage: number;
  };
  getCumulativeVotes: (upToDate?: string) => {
    byPlace: Record<number, number>;
    total: number;
  };
  setDateActive: (date: string, isActive: boolean) => void;
  setDateComplete: (date: string, isComplete: boolean) => void;
  setCurrentDate: (date: string | null) => void;
  reset: () => void;
}

const PLACES: Place[] = [
  { id: 1, name: 'Headquarter', totalVoters: 3296 },
  { id: 2, name: 'Malda Division', totalVoters: 9962 },
  { id: 3, name: 'Howrah Division', totalVoters: 25224 },
  { id: 4, name: 'Sealdah Division', totalVoters: 21038 },
  { id: 5, name: 'Liluah Workshop', totalVoters: 6709 },
  { id: 6, name: 'Kanchrapara Workshop', totalVoters: 7346 },
  { id: 7, name: 'Jamalpur Workshop', totalVoters: 6909 },
  { id: 8, name: 'Asansol Division', totalVoters: 17257 },
];

const INITIAL_VOTING_DATES: VotingDate[] = [
  { date: '2024-12-04', isActive: true, isComplete: false },
  { date: '2024-12-05', isActive: false, isComplete: false },
  { date: '2024-12-06', isActive: false, isComplete: false },
  { date: '2024-12-10', isActive: false, isComplete: false },
];

export const useVotingStore = create<VotingState>()(
  persist(
    (set, get) => {
      // Connect to socket room
      socket.emit('joinRoom', 'votingRoom');

      // Listen for updates from other clients
      socket.on('votingUpdate', (data) => {
        set(data);
      });

      return {
        places: PLACES,
        votingData: [],
        activityLogs: [],
        votingDates: INITIAL_VOTING_DATES,
        currentDate: '2024-12-04',

        addVotingData: (data) => {
          const timestamp = Date.now();
          const newLog: ActivityLog = {
            id: timestamp.toString(),
            timestamp,
            placeName: PLACES.find(p => p.id === data.placeId)?.name || '',
            role: data.submittedBy.role,
            votesCount: data.votesCount,
            maleVoters: data.maleVoters,
            femaleVoters: data.femaleVoters,
            date: data.date,
          };

          const newState = {
            votingData: [...get().votingData, { ...data, timestamp }],
            activityLogs: [newLog, ...get().activityLogs],
          };

          set(newState);
          socket.emit('votingUpdate', newState);
        },

        // ... rest of the methods remain the same ...

        reset: () => {
          const newState = {
            votingData: [],
            activityLogs: [],
            votingDates: INITIAL_VOTING_DATES,
            currentDate: '2024-12-04'
          };
          set(newState);
          socket.emit('votingUpdate', newState);
        },
      };
    },
    {
      name: 'voting-storage',
      partialize: (state) => ({
        votingData: state.votingData,
        activityLogs: state.activityLogs,
        votingDates: state.votingDates,
        currentDate: state.currentDate,
      }),
    }
  )
);