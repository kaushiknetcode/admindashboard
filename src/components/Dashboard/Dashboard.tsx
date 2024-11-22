import React, { useState } from 'react';
import { Users, Vote, UserCheck, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useVotingStore } from '../../store/votingStore';
import { StatCard } from './StatCard';
import { DataEntryForm } from './DataEntryForm';
import { VotingCharts } from './VotingCharts';
import { PlaceSelector } from './PlaceSelector';
import { ActivityLog } from './ActivityLog';
import { DateSelector } from './DateSelector';
import { DateWiseChart } from './DateWiseChart';
import { DateSummary } from './DateSummary';
import { ResetSystem } from './ResetSystem';

export const Dashboard: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const { getZonalData, getPlaceData, places, currentDate, getCumulativeVotes, votingDates } = useVotingStore();
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);

  const zonalData = getZonalData(currentDate);
  const placeData = selectedPlaceId ? getPlaceData(selectedPlaceId, currentDate) : null;
  const cumulativeVotes = getCumulativeVotes(currentDate);
  
  const getStats = () => {
    if (selectedPlaceId === null) {
      const totalVoters = places.reduce((sum, place) => sum + place.totalVoters, 0);
      return {
        totalVotes: cumulativeVotes.total,
        remainingVotes: totalVoters - cumulativeVotes.total,
        percentage: (cumulativeVotes.total / totalVoters) * 100,
      };
    } else {
      const place = places.find(p => p.id === selectedPlaceId);
      const totalVoters = place?.totalVoters || 0;
      const votesCount = cumulativeVotes.byPlace[selectedPlaceId] || 0;
      return {
        totalVotes: votesCount,
        remainingVotes: totalVoters - votesCount,
        percentage: (votesCount / totalVoters) * 100,
      };
    }
  };

  const stats = getStats();
  const currentDateObj = votingDates.find(d => d.date === currentDate);
  const canSubmitData = currentDateObj?.isActive && !currentDateObj?.isComplete;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user?.role === 'SUPER_ADMIN' && (
        <div className="mb-8">
          <ResetSystem />
        </div>
      )}

      <DateSelector />

      {currentDateObj?.isComplete ? (
        <DateSummary date={currentDate || ''} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {canSubmitData && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Data Entry</h2>
              <DataEntryForm />
            </div>
          )}

          <div className={canSubmitData ? '' : 'lg:col-span-2'}>
            <h2 className="text-xl font-semibold mb-4">Activity Log</h2>
            <ActivityLog />
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Live Voting Data</h2>
        
        <PlaceSelector
          selectedPlaceId={selectedPlaceId}
          onSelect={setSelectedPlaceId}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
          <StatCard
            title="Total Votes Cast"
            value={stats.totalVotes}
            icon={Vote}
            color="bg-blue-500"
          />
          <StatCard
            title="Remaining Votes"
            value={stats.remainingVotes}
            icon={UserCheck}
            color="bg-green-500"
          />
          <StatCard
            title="Voter Turnout"
            value={`${stats.percentage.toFixed(1)}%`}
            icon={Users}
            color="bg-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <DateWiseChart placeId={selectedPlaceId} />
          <VotingCharts placeId={selectedPlaceId} />
        </div>
      </div>
    </div>
  );
};