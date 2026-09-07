import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, X, Dumbbell, Timer } from 'lucide-react';
import { Workout } from '../types';

interface ActiveWorkoutModalProps {
  workout: Workout;
  onClose: () => void;
  onFinish: (workout: Workout, elapsedSeconds: number) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  workout,
  onClose,
  onFinish,
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [restSeconds, setRestSeconds] = useState<number>(0);
  const [isRestActive, setIsRestActive] = useState<boolean>(false);
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // Workout stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  // Rest countdown
  useEffect(() => {
    let restInterval: NodeJS.Timeout | null = null;
    if (isRestActive && restSeconds > 0) {
      restInterval = setInterval(() => {
        setRestSeconds((r) => {
          if (r <= 1) {
            setIsRestActive(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [isRestActive, restSeconds]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRestTimer = (duration: number) => {
    setRestSeconds(duration);
    setIsRestActive(true);
  };

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFinish = () => {
    onFinish(workout, seconds);
  };

  return (
    <div
      id="active-workout-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="w-full max-w-sm bg-[#121212] rounded-3xl border border-[#1e1e1e] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#e0e0e0]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-ping" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#2dd4bf] font-semibold">
              Live Session
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#1a1a1a] text-[#666] hover:text-[#e0e0e0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stopwatch & Info */}
        <div className="p-6 flex flex-col items-center justify-center bg-radial from-[#181818] to-[#121212] border-b border-[#1e1e1e]">
          <h2 className="text-sm font-medium text-[#aaa] mb-1">{workout.title}</h2>
          <div className="text-4xl font-mono font-light text-[#2dd4bf] tracking-widest my-2 drop-shadow-[0_0_12px_rgba(45,212,191,0.3)]">
            {formatTime(seconds)}
          </div>
          <span className="text-[11px] font-mono text-[#666]">
            Target: {workout.durationMinutes} mins • {workout.intensity} intensity
          </span>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className="p-3 rounded-full bg-[#2dd4bf] text-black hover:bg-[#25c4af] transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)]"
            >
              {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
            <button
              onClick={() => {
                setIsActive(false);
                setSeconds(0);
              }}
              className="p-3 rounded-full bg-[#1c1c1c] text-[#888] hover:text-[#e0e0e0] hover:bg-[#252525] border border-[#282828] transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rest Timer Quick Launch */}
        <div className="px-5 py-3 border-b border-[#1e1e1e] bg-[#0e0e0e] flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-[#888]">
            <Timer className="w-3.5 h-3.5 text-[#2dd4bf]" />
            <span className="font-mono text-[11px]">Rest Interval:</span>
          </div>
          <div className="flex gap-1.5">
            {[30, 60, 90].map((duration) => (
              <button
                key={duration}
                onClick={() => startRestTimer(duration)}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-all ${
                  isRestActive && restSeconds > 0
                    ? 'border-[#2dd4bf] text-[#2dd4bf] bg-[#1a2e2b]'
                    : 'border-[#222] bg-[#161616] text-[#888] hover:text-[#e0e0e0]'
                }`}
              >
                {duration}s
              </button>
            ))}
          </div>
        </div>

        {/* Rest Countdown Bar */}
        {isRestActive && (
          <div className="px-5 py-2 bg-[#162925] border-b border-[#2dd4bf]/20 flex items-center justify-between text-xs font-mono text-[#2dd4bf]">
            <span>RESTING COUNTDOWN</span>
            <span className="font-bold">{restSeconds}s remaining</span>
          </div>
        )}

        {/* Exercise Checklist */}
        <div className="p-5 overflow-y-auto flex-1 space-y-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#666]">
            Exercise Checklist ({workout.exercises?.length || 0})
          </span>

          {workout.exercises && workout.exercises.length > 0 ? (
            workout.exercises.map((ex) => {
              const isChecked = completedExercises[ex.id];
              return (
                <div
                  key={ex.id}
                  onClick={() => toggleExercise(ex.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-[#152320] border-[#2dd4bf]/40 text-[#2dd4bf]'
                      : 'bg-[#161616] border-[#222] text-[#ccc] hover:border-[#333]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-[#2dd4bf] border-[#2dd4bf] text-black'
                          : 'border-[#444] bg-[#1a1a1a]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className={`text-xs font-medium ${isChecked ? 'line-through opacity-70' : ''}`}>
                        {ex.name}
                      </div>
                      <div className="text-[10px] font-mono text-[#666]">
                        {ex.sets || 3} sets × {ex.reps || 10} reps {ex.weightKg ? `(${ex.weightKg} kg)` : ''}
                      </div>
                    </div>
                  </div>
                  <Dumbbell className={`w-3.5 h-3.5 ${isChecked ? 'text-[#2dd4bf]' : 'text-[#444]'}`} />
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-xs text-[#555] font-mono">
              Continuous session • No discrete exercises logged
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#1e1e1e] bg-[#121212] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#222] bg-[#161616] text-[#888] hover:text-[#e0e0e0] text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            id="finish-workout-btn"
            onClick={handleFinish}
            className="flex-1 py-2.5 rounded-xl bg-[#2dd4bf] hover:bg-[#25c4af] text-black text-xs font-semibold transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Finish & Log
          </button>
        </div>
      </div>
    </div>
  );
};
