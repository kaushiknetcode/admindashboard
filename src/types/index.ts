export type UserRole = 'APO' | 'PO' | 'SUPER_ADMIN';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  placeId: number;
}

export interface VotingData {
  placeId: number;
  timestamp: number;
  votesCount: number;
  maleVoters: number;
  femaleVoters: number;
  date: string;
  submittedBy: {
    role: UserRole;
    placeName: string;
  };
}

export interface Place {
  id: number;
  name: string;
  totalVoters: number;
}

export interface ActivityLog {
  id: string;
  timestamp: number;
  placeName: string;
  role: UserRole;
  votesCount: number;
  maleVoters: number;
  femaleVoters: number;
  date: string;
}

export interface VotingDate {
  date: string;
  isActive: boolean;
  isComplete: boolean;
}