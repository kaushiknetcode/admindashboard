import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon, Calendar } from 'lucide-react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      };
      
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Kolkata'
      };

      setTime(now.toLocaleTimeString('en-IN', timeOptions));
      setDate(now.toLocaleDateString('en-IN', dateOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700 w-[280px] text-right">{date}</span>
        </div>
        <div className="w-px h-4 bg-blue-200" />
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700 w-[100px] text-right font-mono">{time}</span>
        </div>
      </div>
    </div>
  );
};