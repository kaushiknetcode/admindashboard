import React from 'react';
import { useVotingStore } from '../../store/votingStore';

interface PlaceSelectorProps {
  selectedPlaceId: number | null;
  onSelect: (placeId: number | null) => void;
}

export const PlaceSelector: React.FC<PlaceSelectorProps> = ({
  selectedPlaceId,
  onSelect,
}) => {
  const places = useVotingStore(state => state.places);

  return (
    <div className="flex items-center space-x-4">
      <label className="text-sm font-medium text-gray-700">View Data For:</label>
      <select
        value={selectedPlaceId || ''}
        onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        <option value="">Zonal View (All Places)</option>
        {places.map((place) => (
          <option key={place.id} value={place.id}>
            {place.name}
          </option>
        ))}
      </select>
    </div>
  );
};