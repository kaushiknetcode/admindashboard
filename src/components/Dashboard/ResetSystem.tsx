import React, { useState } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useVotingStore } from '../../store/votingStore';

export const ResetSystem = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resetVotingStore = useVotingStore(state => state.reset);

  const handleReset = async () => {
    if (confirmationStep < 2) {
      setConfirmationStep(prev => prev + 1);
      return;
    }

    try {
      setIsResetting(true);
      setError(null);
      
      resetVotingStore();
      setShowConfirmation(false);
      setConfirmationStep(0);
      
      alert('System reset successful');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsResetting(false);
    }
  };

  const getConfirmationMessage = () => {
    switch (confirmationStep) {
      case 0:
        return "Are you sure you want to reset the entire system? This will clear all voting data.";
      case 1:
        return "This action cannot be undone. All vote counts and activity logs will be permanently deleted.";
      case 2:
        return "FINAL WARNING: Proceeding will reset everything to initial state. Are you absolutely sure?";
      default:
        return "";
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmationStep(0);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 p-2 rounded-lg">
            <RotateCcw className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">System Reset</h2>
        </div>
        <div>
          <span
            onClick={() => setShowConfirmation(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Reset System
          </span>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h3 className="text-xl font-semibold text-gray-800">System Reset Confirmation</h3>
            </div>

            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <p className="text-red-700">{getConfirmationMessage()}</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex space-x-4">
              <span
                onClick={handleReset}
                className={`flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors cursor-pointer text-center ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isResetting ? 'Resetting...' : confirmationStep < 2 ? 'Continue' : 'Reset Everything'}
              </span>
              <span
                onClick={handleCancel}
                className={`flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors cursor-pointer text-center ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};