import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Dumbbell,
  Sparkles,
  Plus,
  Flame,
  Droplets,
  ArrowRight,
  SunMedium,
  Check,
  Play,
} from 'lucide-react';
import { Task, Workout, DailyStats, TabType } from '../types';

interface TodayTabProps {
  tasks: Task[];
  workouts: Workout[];
  dailyStats: DailyStats;
  onNavigateTab: (tab: TabType) => void;
  onOpenAddTaskModal: () => void;
  onOpenLogModal: () => void;
  onToggleTaskCompleted: (id: string) => void;
  onStartLiveWorkout: (workout: Workout) => void;
  onUpdateWater: (delta: number) => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  tasks,
  workouts,
  dailyStats,
  onNavigateTab,
  onOpenAddTaskModal,
  onOpenLogModal,
  onToggleTaskCompleted,
  onStartLiveWorkout,
  onUpdateWater,
}) => {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateFormatted = today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const todayStr = today.toISOString().split('T')[0];

  const todaysTasks = tasks.filter((t) => t.dueDate === todayStr || !t.completed);
  const completedTasks = todaysTasks.filter((t) => t.completed).length;
  const pendingTasks = todaysTasks.filter((t) => !t.completed);

  const todaysWorkouts = workouts.filter((w) => w.date === todayStr);
  const completedWorkouts = todaysWorkouts.filter((w) => w.completed).length;

  // Next high priority task
  const nextPriorityTask =
    pendingTasks.find((t) => t.priority === 'high') || pendingTasks[0];

  // Next workout
  const nextWorkout =
    todaysWorkouts.find((w) => !w.completed) || todaysWorkouts[0];

  // Overall completion rate
  const totalItems = todaysTasks.length + todaysWorkouts.length;
  const completedItems = completedTasks + completedWorkouts;
  const progressPercent =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 100;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a] text-[#e0e0e0]">
      {/* Greeting & Date Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center space-x-1.5 text-xs text-[#777] font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#2dd4bf]" />
            <span>
              {dayName}, {dateFormatted}
            </span>
          </div>
          <h1 className="text-xl font-light tracking-tight text-[#e0e0e0] mt-0.5">
            Good day, <span className="font-semibold text-white">Alex</span>
            <span className="text-[#2dd4bf]">.</span>
          </h1>
        </div>

        {/* Weather chip */}
        <div className="px-3 py-1 rounded-full bg-[#141414] border border-[#222] flex items-center space-x-1.5 text-xs text-[#aaa]">
          <SunMedium className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-[11px]">72°F Clear</span>
        </div>
      </div>

      {/* Progress Hero Card */}
      <div className="p-4 rounded-2xl bg-[#121212] border border-[#1e1e1e] shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#666]">
              Daily Routine Completion
            </span>
            <div className="text-2xl font-light text-[#e0e0e0] mt-0.5 font-mono">
              {progressPercent}%
            </div>
            <p className="text-[11px] text-[#777] mt-1 font-mono">
              {completedItems} of {totalItems} items completed today
            </p>
          </div>

          <div className="w-14 h-14 rounded-full border-4 border-[#1c1c1c] border-t-[#2dd4bf] border-r-[#2dd4bf] flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.2)]">
            <CheckCircle2 className="w-6 h-6 text-[#2dd4bf]" />
          </div>
        </div>

        <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-[#2dd4bf] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onOpenAddTaskModal}
          className="p-3 rounded-xl bg-[#121212] border border-[#1e1e1e] hover:border-[#2dd4bf]/40 flex flex-col items-center justify-center transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#181818] border border-[#262626] text-[#2dd4bf] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium text-[#aaa] group-hover:text-white">
            Task
          </span>
        </button>

        <button
          onClick={onOpenLogModal}
          className="p-3 rounded-xl bg-[#121212] border border-[#1e1e1e] hover:border-[#2dd4bf]/40 flex flex-col items-center justify-center transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#181818] border border-[#262626] text-[#2dd4bf] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium text-[#aaa] group-hover:text-white">
            Workout
          </span>
        </button>

        <button
          onClick={() => onUpdateWater(1)}
          className="p-3 rounded-xl bg-[#121212] border border-[#1e1e1e] hover:border-[#2dd4bf]/40 flex flex-col items-center justify-center transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#181818] border border-[#262626] text-[#2dd4bf] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <Droplets className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium text-[#aaa] group-hover:text-white">
            +1 Water
          </span>
        </button>

        <button
          onClick={() => onNavigateTab('ai')}
          className="p-3 rounded-xl bg-[#121212] border border-[#1e1e1e] hover:border-[#2dd4bf]/40 flex flex-col items-center justify-center transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#181818] border border-[#262626] text-[#2dd4bf] flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-medium text-[#aaa] group-hover:text-white">
            AI Coach
          </span>
        </button>
      </div>

      {/* Next Up Priority Task */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777] font-mono">
            Next Critical Task
          </h2>
          <button
            onClick={() => onNavigateTab('tasks')}
            className="text-[10px] font-mono text-[#2dd4bf] hover:underline flex items-center gap-0.5"
          >
            <span>View All ({pendingTasks.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {nextPriorityTask ? (
          <div className="p-3.5 rounded-2xl bg-[#121212] border border-[#1e1e1e] hover:border-[#282828] flex items-start justify-between transition-all">
            <div className="flex items-start space-x-2.5 flex-1 pr-2">
              <button
                onClick={() => onToggleTaskCompleted(nextPriorityTask.id)}
                className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                  nextPriorityTask.completed
                    ? 'bg-[#2dd4bf] border-[#2dd4bf] text-black'
                    : 'border-[#3a3a3a] hover:border-[#2dd4bf]'
                }`}
              >
                {nextPriorityTask.completed && (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                )}
              </button>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase ${
                      nextPriorityTask.priority === 'high'
                        ? 'bg-[#2a1313] text-red-400 border border-red-900/60'
                        : 'bg-[#261f12] text-amber-400 border border-amber-900/60'
                    }`}
                  >
                    {nextPriorityTask.priority}
                  </span>
                  <span className="text-[10px] font-mono text-[#666]">
                    {nextPriorityTask.category}
                  </span>
                </div>
                <div className="text-xs font-medium text-[#e0e0e0]">
                  {nextPriorityTask.title}
                </div>
                {nextPriorityTask.dueTime && (
                  <div className="text-[10px] font-mono text-[#777] mt-1">
                    Scheduled for {nextPriorityTask.dueTime}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#121212] border border-[#1e1e1e] text-center text-xs text-[#666] font-mono">
            🎉 All scheduled tasks completed for today!
          </div>
        )}
      </div>

      {/* Today's Fitness Session */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777] font-mono">
            Target Workout
          </h2>
          <button
            onClick={() => onNavigateTab('fitness')}
            className="text-[10px] font-mono text-[#2dd4bf] hover:underline flex items-center gap-0.5"
          >
            <span>Fitness Tab</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {nextWorkout ? (
          <div className="p-3.5 rounded-2xl bg-[#121212] border border-[#1e1e1e] hover:border-[#282828] flex items-center justify-between transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#181818] border border-[#282828] text-[#2dd4bf] flex items-center justify-center">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-medium text-[#e0e0e0]">
                  {nextWorkout.title}
                </div>
                <div className="text-[10px] font-mono text-[#666] flex items-center gap-2 mt-0.5">
                  <span className="text-[#2dd4bf]">{nextWorkout.type}</span>
                  <span>•</span>
                  <span>{nextWorkout.durationMinutes} mins</span>
                  <span>•</span>
                  <span>{nextWorkout.calories} kcal</span>
                </div>
              </div>
            </div>

            {!nextWorkout.completed ? (
              <button
                onClick={() => onStartLiveWorkout(nextWorkout)}
                className="px-3 py-1.5 rounded-lg bg-[#2dd4bf] hover:bg-[#25c4af] text-black text-xs font-semibold flex items-center gap-1 transition-all shadow-[0_0_10px_rgba(45,212,191,0.25)]"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start</span>
              </button>
            ) : (
              <span className="text-[10px] font-mono text-[#2dd4bf] bg-[#162925] px-2 py-1 rounded-md border border-[#2dd4bf]/30">
                Completed
              </span>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#121212] border border-[#1e1e1e] text-center text-xs text-[#666] font-mono flex items-center justify-between">
            <span>No workout scheduled yet today.</span>
            <button
              onClick={onOpenLogModal}
              className="text-[#2dd4bf] font-medium hover:underline text-xs"
            >
              + Add Session
            </button>
          </div>
        )}
      </div>

      {/* Daily Health Snippet */}
      <div className="p-3.5 rounded-2xl bg-[#121212] border border-[#1e1e1e] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2.5">
          <Flame className="w-4 h-4 text-amber-400" />
          <span className="text-[#bbb]">Active Calorie Expenditure</span>
        </div>
        <span className="font-mono text-xs font-bold text-[#e0e0e0]">
          {dailyStats.caloriesBurned} kcal
        </span>
      </div>
    </div>
  );
};
