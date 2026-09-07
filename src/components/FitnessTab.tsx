import React, { useState } from 'react';
import {
  Plus,
  Flame,
  Footprints,
  Clock,
  Droplets,
  Play,
  Check,
  Dumbbell,
  Trash2,
  Trophy,
} from 'lucide-react';
import { Workout, DailyStats } from '../types';

interface FitnessTabProps {
  workouts: Workout[];
  dailyStats: DailyStats;
  onOpenLogModal: () => void;
  onToggleWorkoutCompleted: (id: string) => void;
  onDeleteWorkout: (id: string) => void;
  onStartLiveSession: (workout: Workout) => void;
  onUpdateWater: (delta: number) => void;
}

export const FitnessTab: React.FC<FitnessTabProps> = ({
  workouts,
  dailyStats,
  onOpenLogModal,
  onToggleWorkoutCompleted,
  onDeleteWorkout,
  onStartLiveSession,
  onUpdateWater,
}) => {
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');

  const filteredWorkouts = workouts.filter((w) => {
    if (filter === 'scheduled') return !w.completed;
    if (filter === 'completed') return w.completed;
    return true;
  });

  const stepPercentage = Math.min(
    100,
    Math.round((dailyStats.steps / dailyStats.stepGoal) * 100)
  );

  const presetRoutines: Omit<Workout, 'id'>[] = [
    {
      title: 'Full Body HIIT Express',
      type: 'HIIT',
      durationMinutes: 20,
      calories: 220,
      intensity: 'high',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      exercises: [
        { id: 'p1', name: 'Jumping Jacks', sets: 3, reps: 30 },
        { id: 'p2', name: 'Burpees', sets: 3, reps: 15 },
        { id: 'p3', name: 'Mountain Climbers', sets: 3, reps: 25 },
        { id: 'p4', name: 'High Knees', sets: 3, reps: 30 },
      ],
    },
    {
      title: 'Core & Stability Flow',
      type: 'Core',
      durationMinutes: 15,
      calories: 110,
      intensity: 'moderate',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      exercises: [
        { id: 'p5', name: 'Plank Hold', sets: 3, reps: 45 },
        { id: 'p6', name: 'Bicycle Crunches', sets: 3, reps: 20 },
        { id: 'p7', name: 'Leg Raises', sets: 3, reps: 15 },
      ],
    },
    {
      title: 'Upper Strength Blast',
      type: 'Strength',
      durationMinutes: 30,
      calories: 210,
      intensity: 'high',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      exercises: [
        { id: 'p8', name: 'Push-Ups', sets: 4, reps: 15 },
        { id: 'p9', name: 'Dumbbell Rows', sets: 3, reps: 12, weightKg: 14 },
        { id: 'p10', name: 'Overhead Press', sets: 3, reps: 10, weightKg: 12 },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a] text-[#e0e0e0]">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#666]">
            Fitness Engine
          </span>
          <h1 className="text-xl font-light text-[#e0e0e0]">
            Activity & Movement<span className="text-[#2dd4bf]">.</span>
          </h1>
        </div>
        <button
          id="log-workout-btn"
          onClick={onOpenLogModal}
          className="px-3 py-1.5 rounded-full bg-[#161616] hover:bg-[#202020] border border-[#262626] text-[#2dd4bf] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(45,212,191,0.15)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Workout</span>
        </button>
      </div>

      {/* Daily Metrics Card */}
      <div className="p-4 rounded-2xl bg-[#121212] border border-[#1e1e1e] space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Footprints className="w-4 h-4 text-[#2dd4bf]" />
            <span className="font-semibold text-[#e0e0e0]">Daily Steps Target</span>
          </div>
          <span className="font-mono text-xs text-[#2dd4bf] font-bold">
            {dailyStats.steps.toLocaleString()} / {dailyStats.stepGoal.toLocaleString()}
          </span>
        </div>

        {/* Steps Progress Bar */}
        <div className="w-full bg-[#1c1c1c] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#2dd4bf] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(45,212,191,0.4)]"
            style={{ width: `${stepPercentage}%` }}
          />
        </div>

        {/* 3 Metrics Row */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#1a1a1a]">
          <div className="p-2.5 rounded-xl bg-[#161616] border border-[#222] flex flex-col items-center justify-center text-center">
            <Flame className="w-3.5 h-3.5 text-amber-400 mb-1" />
            <span className="text-[10px] text-[#777] uppercase font-mono">Burned</span>
            <span className="text-xs font-semibold font-mono text-[#e0e0e0]">
              {dailyStats.caloriesBurned} kcal
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161616] border border-[#222] flex flex-col items-center justify-center text-center">
            <Clock className="w-3.5 h-3.5 text-[#2dd4bf] mb-1" />
            <span className="text-[10px] text-[#777] uppercase font-mono">Active</span>
            <span className="text-xs font-semibold font-mono text-[#e0e0e0]">
              {dailyStats.activeMinutes} mins
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161616] border border-[#222] flex flex-col items-center justify-center text-center">
            <Trophy className="w-3.5 h-3.5 text-yellow-400 mb-1" />
            <span className="text-[10px] text-[#777] uppercase font-mono">Streak</span>
            <span className="text-xs font-semibold font-mono text-[#e0e0e0]">
              {dailyStats.streakDays} Days
            </span>
          </div>
        </div>

        {/* Hydration Tracker */}
        <div className="p-3 rounded-xl bg-[#161616] border border-[#222] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#112426] border border-[#2dd4bf]/30 flex items-center justify-center text-[#2dd4bf]">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#e0e0e0]">Hydration Tracker</div>
              <div className="text-[10px] font-mono text-[#666]">
                {dailyStats.waterGlasses} of 8 glasses logged
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUpdateWater(-1)}
              disabled={dailyStats.waterGlasses <= 0}
              className="w-6 h-6 rounded-lg bg-[#1f1f1f] text-[#888] hover:text-[#e0e0e0] flex items-center justify-center font-mono disabled:opacity-40"
            >
              -
            </button>
            <span className="text-xs font-mono font-bold text-[#2dd4bf] w-4 text-center">
              {dailyStats.waterGlasses}
            </span>
            <button
              onClick={() => onUpdateWater(1)}
              className="w-6 h-6 rounded-lg bg-[#2dd4bf] text-black font-bold flex items-center justify-center text-xs hover:bg-[#25c4af]"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Quick Start Routines */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777] font-mono">
            Interactive Presets
          </h2>
          <span className="text-[10px] text-[#555] font-mono">Instant Live Session</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {presetRoutines.map((preset, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#121212] border border-[#1e1e1e] hover:border-[#2dd4bf]/40 flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-[#181818] border border-[#282828] text-[#2dd4bf] flex items-center justify-center">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#e0e0e0]">{preset.title}</div>
                  <div className="text-[10px] font-mono text-[#666]">
                    {preset.durationMinutes}m • {preset.calories} kcal • {preset.exercises?.length || 0} exercises
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  onStartLiveSession({
                    ...preset,
                    id: `preset-${Date.now()}-${idx}`,
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#2dd4bf] text-black hover:bg-[#25c4af] text-xs font-semibold flex items-center gap-1 transition-all shadow-[0_0_10px_rgba(45,212,191,0.25)]"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Workouts History / Scheduled */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#777] font-mono">
            Session History ({filteredWorkouts.length})
          </h2>

          <div className="flex bg-[#141414] p-0.5 rounded-lg border border-[#222] text-[10px] font-mono">
            {(['all', 'scheduled', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2 py-0.5 rounded-md capitalize transition-colors ${
                  filter === tab
                    ? 'bg-[#222] text-[#2dd4bf] font-medium'
                    : 'text-[#666] hover:text-[#bbb]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredWorkouts.length === 0 ? (
          <div className="text-center py-8 rounded-2xl bg-[#121212] border border-[#1e1e1e] text-[#666] text-xs font-mono">
            No workouts found for this filter.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredWorkouts.map((w) => (
              <div
                key={w.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  w.completed
                    ? 'bg-[#101010] border-[#1a1a1a] opacity-80'
                    : 'bg-[#121212] border-[#1e1e1e] hover:border-[#282828]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2.5">
                    <button
                      onClick={() => onToggleWorkoutCompleted(w.id)}
                      className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-colors ${
                        w.completed
                          ? 'bg-[#2dd4bf] border-[#2dd4bf] text-black'
                          : 'border-[#3a3a3a] hover:border-[#2dd4bf]'
                      }`}
                    >
                      {w.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div>
                      <div className={`text-xs font-medium ${w.completed ? 'line-through text-[#666]' : 'text-[#e0e0e0]'}`}>
                        {w.title}
                      </div>
                      <div className="text-[10px] font-mono text-[#777] flex items-center gap-2 mt-0.5">
                        <span className="text-[#2dd4bf]">{w.type}</span>
                        <span>•</span>
                        <span>{w.durationMinutes} mins</span>
                        <span>•</span>
                        <span>{w.calories} kcal</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {!w.completed && (
                      <button
                        onClick={() => onStartLiveSession(w)}
                        className="p-1.5 rounded-lg bg-[#181818] border border-[#282828] text-[#2dd4bf] hover:bg-[#202020] transition-colors"
                        title="Start active session"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteWorkout(w.id)}
                      className="p-1.5 text-[#555] hover:text-red-400 rounded-lg hover:bg-[#181818] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {w.exercises && w.exercises.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#1a1a1a] flex flex-wrap gap-1.5">
                    {w.exercises.map((ex) => (
                      <span
                        key={ex.id}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#181818] border border-[#252525] text-[#888]"
                      >
                        {ex.name} ({ex.sets}x{ex.reps})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
