import React from 'react';
import { Calendar, CheckSquare, Dumbbell, Sparkles } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingTasksCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
  pendingTasksCount,
}) => {
  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell },
    { id: 'ai', label: 'Assistant', icon: Sparkles },
  ];

  return (
    <div
      id="bottom-navigation-bar"
      className="w-full bg-[#101010]/95 backdrop-blur-md border-t border-[#1e1e1e] px-4 py-2 flex items-center justify-around shrink-0 z-20"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'text-[#2dd4bf]'
                : 'text-[#666] hover:text-[#aaa]'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              {tab.id === 'tasks' && pendingTasksCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#2dd4bf] text-black font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {pendingTasksCount > 9 ? '9+' : pendingTasksCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? 'text-[#2dd4bf] font-semibold' : ''}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#2dd4bf] shadow-[0_0_6px_#2dd4bf]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
