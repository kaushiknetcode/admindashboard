import React from 'react';
import { useVotingStore } from '../../store/votingStore';
import { FileText, Users, Vote, TrendingUp } from 'lucide-react';

interface SummaryProps {
  date: string;
}

export const DateSummary: React.FC<SummaryProps> = ({ date }) => {
  const { places, votingData } = useVotingStore();

  const getDaySummary = () => {
    const dayData = votingData.filter(d => d.date === date);
    const totalVoters = places.reduce((sum, p) => sum + p.totalVoters, 0);
    
    const summary = {
      totalVotes: 0,
      maleVotes: 0,
      femaleVotes: 0,
      placeWise: places.map(place => {
        const placeData = dayData.find(d => d.placeId === place.id);
        return {
          name: place.name,
          totalVoters: place.totalVoters,
          votesCount: placeData?.votesCount || 0,
          maleVoters: placeData?.maleVoters || 0,
          femaleVoters: placeData?.femaleVoters || 0,
          percentage: ((placeData?.votesCount || 0) / place.totalVoters) * 100,
        };
      }),
    };

    summary.placeWise.forEach(place => {
      summary.totalVotes += place.votesCount;
      summary.maleVotes += place.maleVoters;
      summary.femaleVotes += place.femaleVoters;
    });

    return {
      ...summary,
      totalPercentage: (summary.totalVotes / totalVoters) * 100,
    };
  };

  const summary = getDaySummary();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <FileText className="h-6 w-6 text-blue-500" />
        <span>Voting Summary - {new Date(date).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Vote className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium">Total Votes Cast</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600">{summary.totalVotes}</p>
          <p className="text-sm text-blue-600">({summary.totalPercentage.toFixed(1)}% turnout)</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-purple-500" />
            <h4 className="font-medium">Gender Distribution</h4>
          </div>
          <p className="text-md font-medium text-purple-600">
            Male: {summary.maleVotes} ({((summary.maleVotes / summary.totalVotes) * 100).toFixed(1)}%)
          </p>
          <p className="text-md font-medium text-purple-600">
            Female: {summary.femaleVotes} ({((summary.femaleVotes / summary.totalVotes) * 100).toFixed(1)}%)
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h4 className="font-medium">Highest Turnout</h4>
          </div>
          {(() => {
            const highest = [...summary.placeWise].sort((a, b) => b.percentage - a.percentage)[0];
            return (
              <>
                <p className="text-md font-medium text-green-600">{highest.name}</p>
                <p className="text-md font-medium text-green-600">
                  {highest.percentage.toFixed(1)}% ({highest.votesCount} votes)
                </p>
              </>
            );
          })()}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Place
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Voters
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Votes Cast
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Male
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Female
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turnout %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summary.placeWise.map((place) => (
              <tr key={place.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {place.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {place.totalVoters}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {place.votesCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {place.maleVoters}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {place.femaleVoters}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {place.percentage.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};