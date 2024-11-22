import React, { useState } from 'react';
import { useVotingStore } from '../../store/votingStore';
import { useAuthStore } from '../../store/authStore';
import { ClipboardList, Users, UserCheck, AlertCircle } from 'lucide-react';

export const DataEntryForm: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const { addVotingData, places, currentDate, votingDates, getCumulativeVotes } = useVotingStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    votesCount: '',
    maleVoters: '',
    femaleVoters: '',
  });

  if (!user) return null;

  const activeDate = votingDates.find(d => d.date === currentDate);
  if (!activeDate?.isActive || activeDate?.isComplete) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">
          {activeDate?.isComplete 
            ? "This voting date is marked as complete. No new entries allowed." 
            : "No active voting date available"}
        </p>
      </div>
    );
  }

  const validateData = () => {
    const votes = parseInt(formData.votesCount);
    const male = parseInt(formData.maleVoters);
    const female = parseInt(formData.femaleVoters);

    if (male + female !== votes) {
      setError(`Total votes (${votes}) must equal sum of male (${male}) and female (${female}) voters`);
      return false;
    }

    // Check if total votes would exceed the place's total voters
    const place = places.find(p => p.id === user.placeId);
    if (!place) {
      setError('Invalid place ID');
      return false;
    }

    const { byPlace } = getCumulativeVotes();
    const currentPlaceVotes = byPlace[user.placeId] || 0;
    const newTotalVotes = currentPlaceVotes + votes;

    if (newTotalVotes > place.totalVoters) {
      setError(`Total votes (${newTotalVotes}) would exceed total registered voters (${place.totalVoters})`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateData()) return;
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    if (!user) return;
    const place = places.find(p => p.id === user.placeId);
    if (!place) return;

    addVotingData({
      placeId: user.placeId,
      votesCount: parseInt(formData.votesCount),
      maleVoters: parseInt(formData.maleVoters),
      femaleVoters: parseInt(formData.femaleVoters),
      date: currentDate || activeDate.date,
      submittedBy: {
        role: user.role,
        placeName: place.name,
      },
    });

    setFormData({ votesCount: '', maleVoters: '', femaleVoters: '' });
    setShowConfirmation(false);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Get remaining votes for the current place
  const getRemainingVotes = () => {
    const place = places.find(p => p.id === user.placeId);
    if (!place) return 0;
    const { byPlace } = getCumulativeVotes();
    const currentVotes = byPlace[user.placeId] || 0;
    return place.totalVoters - currentVotes;
  };

  const remainingVotes = getRemainingVotes();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-500 p-2 rounded-lg">
          <ClipboardList className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Vote Entry Form</h2>
      </div>

      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <p className="text-blue-800 font-medium">
          Remaining votes available: {remainingVotes}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-blue-500" />
              <label className="block text-sm font-medium text-gray-700">
                Total Votes Cast
              </label>
            </div>
            <input
              type="number"
              name="votesCount"
              value={formData.votesCount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              min="0"
              max={remainingVotes}
              placeholder={`Enter total votes (max: ${remainingVotes})`}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="h-5 w-5 text-blue-500" />
              <label className="block text-sm font-medium text-gray-700">
                Male Voters
              </label>
            </div>
            <input
              type="number"
              name="maleVoters"
              value={formData.maleVoters}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              min="0"
              placeholder="Enter male voters"
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="h-5 w-5 text-blue-500" />
              <label className="block text-sm font-medium text-gray-700">
                Female Voters
              </label>
            </div>
            <input
              type="number"
              name="femaleVoters"
              value={formData.femaleVoters}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              min="0"
              placeholder="Enter female voters"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
        >
          Submit Data
        </button>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Confirm Data Submission</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Votes Cast:</span>
                  <span className="font-semibold text-gray-800">{formData.votesCount}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Male Voters:</span>
                  <span className="font-semibold text-gray-800">{formData.maleVoters}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Female Voters:</span>
                  <span className="font-semibold text-gray-800">{formData.femaleVoters}</span>
                </li>
              </ul>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={confirmSubmit}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};