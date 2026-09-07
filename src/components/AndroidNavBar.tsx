import React from 'react';

export const AndroidNavBar: React.FC = () => {
  return (
    <div
      id="android-system-nav-bar"
      className="w-full h-8 bg-[#0a0a0a] flex items-center justify-center shrink-0 border-t border-[#161616]"
    >
      {/* Android 3-button or pill gesture bar */}
      <div className="flex items-center justify-center space-x-12 opacity-60 hover:opacity-100 transition-opacity">
        <div className="w-3.5 h-3.5 border-2 border-[#666] rotate-45 rounded-[2px]" title="Back"></div>
        <div className="w-3.5 h-3.5 border-2 border-[#666] rounded-full" title="Home"></div>
        <div className="w-3.5 h-3.5 border-2 border-[#666] rounded-[2px]" title="Recents"></div>
      </div>
    </div>
  );
};
