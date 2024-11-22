import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useVotingStore } from '../../store/votingStore';

export const DateWiseChart: React.FC<{ placeId: number | null }> = ({ placeId }) => {
  const { votingDates, votingData, places } = useVotingStore();

  const getData = () => {
    return votingDates.map(date => {
      const dayData = votingData.filter(d => d.date === date.date);
      
      if (placeId) {
        const placeData = dayData.find(d => d.placeId === placeId);
        const place = places.find(p => p.id === placeId);
        return {
          date: new Date(date.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          votes: placeData?.votesCount || 0,
          percentage: place ? ((placeData?.votesCount || 0) / place.totalVoters * 100).toFixed(1) : 0
        };
      }

      const totalVotes = dayData.reduce((sum, d) => sum + d.votesCount, 0);
      const totalVoters = places.reduce((sum, p) => sum + p.totalVoters, 0);
      return {
        date: new Date(date.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        votes: totalVotes,
        percentage: ((totalVotes / totalVoters) * 100).toFixed(1)
      };
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Voting Progress by Date</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={getData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="votes" name="Votes Cast" fill="#3B82F6" />
          <Bar yAxisId="right" dataKey="percentage" name="Turnout %" fill="#10B981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};