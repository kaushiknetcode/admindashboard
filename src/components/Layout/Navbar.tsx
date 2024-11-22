import React from 'react';
import { LogOut, Train } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useVotingStore } from '../../store/votingStore';
import { Clock } from './Clock';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const places = useVotingStore(state => state.places);
  
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

  const getPlaceName = (placeId: number) => {
    return places.find(place => place.id === placeId)?.name || '';
  };

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and Title Section */}
        <div className="flex flex-col items-center py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/4/4b/Indian_Railways_logo.png"
              alt="Indian Railways Logo"
              className="h-16 w-16"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">EASTERN RAILWAY</h1>
              <h2 className="text-xl font-semibold text-red-600">SECRET BALLOT ELECTION 2024</h2>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Train className="h-6 w-6 text-red-600" />
            <span className="text-lg font-medium">
              Voting Dashboard
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Clock />
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-gray-700">
                  {`${getFullRoleName(user.role)}${user.placeId ? ` - ${getPlaceName(user.placeId)}` : ''}`}
                </span>
              )}
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};