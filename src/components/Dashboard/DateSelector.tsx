import React from 'react';
import { useVotingStore } from '../../store/votingStore';
import { useAuthStore } from '../../store/authStore';
import { Calendar, CheckCircle, XCircle, Play, Lock } from 'lucide-react';

export const DateSelector = () => {
  const { votingDates, currentDate, setDateActive, setDateComplete, setCurrentDate } = useVotingStore();
  const user = useAuthStore(state => state.user);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDateStatusChange = (date: string, action: 'complete' | 'activate', e: React.MouseEvent) => {
    e.stopPropagation();
    if (action === 'complete') {
      const dateObj = votingDates.find(d => d.date === date);
      if (dateObj) {
        setDateComplete(date, !dateObj.isComplete);
      }
    } else {
      setDateActive(date, !votingDates.find(d => d.date === date)?.isActive);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Voting Dates</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {votingDates.map((date) => (
          <div
            key={date.date}
            onClick={() => setCurrentDate(date.date)}
            className={`w-full cursor-pointer transition-all duration-200 ${
              currentDate === date.date 
                ? 'bg-blue-50 border-blue-500' 
                : 'bg-white hover:bg-gray-50 border-gray-200'
            } p-4 rounded-lg border shadow-sm hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                currentDate === date.date ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {formatDate(date.date)}
              </span>
              <div className="flex items-center gap-2">
                {date.isActive && (
                  <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full animate-pulse">
                    LIVE
                  </span>
                )}
                {date.isComplete && (
                  <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                    Complete
                  </span>
                )}
              </div>
            </div>

            {user?.role === 'SUPER_ADMIN' && (
              <div className="flex gap-2 mt-2">
                <span
                  onClick={(e) => handleDateStatusChange(date.date, 'activate', e)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
                    date.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {date.isActive ? (
                      <>
                        <Lock className="h-3 w-3" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" />
                        <span>Activate</span>
                      </>
                    )}
                  </div>
                </span>
                <span
                  onClick={(e) => handleDateStatusChange(date.date, 'complete', e)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer text-center ${
                    date.isComplete
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    {date.isComplete ? (
                      <>
                        <XCircle className="h-3 w-3" />
                        <span>Reopen</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        <span>Complete</span>
                      </>
                    )}
                  </div>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};