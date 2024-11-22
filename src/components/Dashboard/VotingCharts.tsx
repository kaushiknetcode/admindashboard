import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useVotingStore } from '../../store/votingStore';

const COLORS = ['#3B82F6', '#EC4899'];

export const VotingCharts: React.FC<{ placeId: number | null }> = ({ placeId }) => {
  const getZonalData = useVotingStore(state => state.getZonalData);
  const getPlaceData = useVotingStore(state => state.getPlaceData);
  const places = useVotingStore(state => state.places);

  const getData = () => {
    if (placeId === null) {
      const zonalData = getZonalData();
      return {
        genderData: [
          { name: 'Male', value: zonalData.totalMale },
          { name: 'Female', value: zonalData.totalFemale },
        ],
        barData: places.map(place => {
          const data = getPlaceData(place.id);
          const latest = data[data.length - 1] || { votesCount: 0 };
          const percentage = (latest.votesCount / place.totalVoters) * 100;
          return {
            name: place.name,
            votes: latest.votesCount,
            percentage: parseFloat(percentage.toFixed(1)),
          };
        }),
      };
    } else {
      const placeData = getPlaceData(placeId);
      const latest = placeData[placeData.length - 1] || { maleVoters: 0, femaleVoters: 0 };
      return {
        genderData: [
          { name: 'Male', value: latest.maleVoters },
          { name: 'Female', value: latest.femaleVoters },
        ],
        barData: placeData.map((data, index) => ({
          name: `Entry ${index + 1}`,
          votes: data.votesCount,
        })),
      };
    }
  };

  const { genderData, barData } = getData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          {placeId === null ? 'Votes by Place' : 'Voting Progress'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="votes" name="Votes Cast" fill="#3B82F6" />
            {placeId === null && (
              <Bar dataKey="percentage" name="Turnout %" fill="#10B981" />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};