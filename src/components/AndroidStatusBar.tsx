import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formatted = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')}`;
      setCurrentTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="android-status-bar"
      className="w-full h-7 px-6 bg-[#0a0a0a] text-[#888] flex items-center justify-between text-[11px] font-mono select-none z-30 shrink-0 border-b border-[#161616]"
    >
      <div className="flex items-center space-x-1 font-semibold text-[#e0e0e0]">
        <span>{currentTime}</span>
      </div>
      <div className="flex items-center space-x-2 text-[#888]">
        <Signal className="w-3 h-3 text-[#2dd4bf]" />
        <Wifi className="w-3 h-3 text-[#2dd4bf]" />
        <div className="flex items-center space-x-1">
          <span className="text-[10px] text-[#aaa]">98%</span>
          <Battery className="w-3.5 h-3.5 text-[#2dd4bf]" />
        </div>
      </div>
    </div>
  );
};
