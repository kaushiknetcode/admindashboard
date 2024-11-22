import React from 'react';
import { useVotingStore } from '../../store/votingStore';

export const ActivityLog: React.FC = () => {
  const activityLogs = useVotingStore(state => state.activityLogs);

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
    return `${dateStr} at ${timeStr}`;
  };

  const getFullRoleName = (role: string) => {
    switch (role) {
      case 'APO':
        return 'Assistant Presiding Officer';
      case 'PO':
        return 'Presiding Officer';
      case 'SUPER_ADMIN':
        return 'Super Admin';
      default:
        return role;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        {activityLogs.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No activity yet</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {activityLogs.map((log) => (
              <li key={log.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {`${getFullRoleName(log.role)} - ${log.placeName}`}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Submitted {log.votesCount} votes ({log.maleVoters} male, {log.femaleVoters} female)
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {formatDateTime(log.timestamp)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};