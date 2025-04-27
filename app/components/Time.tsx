'use client';

import { useEffect, useState } from 'react';

export default function Time() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const londonTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now).toUpperCase();
      
      setTime(londonTime);
    };

    // Update time immediately
    updateTime();

    // Update time every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black">
      <div className="text-2xl font-semibold text-[#FFD700]">
        {time}
      </div>
      <h1 className="text-3xl font-bold text-[#FFD700]">Hotel Management</h1>
      <div className="text-2xl font-semibold invisible text-[#FFD700]">
        {time}
      </div>
    </div>
  );
}
