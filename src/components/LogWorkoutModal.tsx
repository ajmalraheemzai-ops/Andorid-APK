import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Workout, Exercise } from '../types';

interface LogWorkoutModalProps {
  onClose: () => void;
  onAddWorkout: (workout: Omit<Workout, 'id'>) => void;
}

export const LogWorkoutModal: React.FC<LogWorkoutModalProps> = ({
  onClose,
  onAddWorkout,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Strength');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [calories, setCalories] = useState(180);
  const [intensity, setIntensity] = useState<'light' | 'moderate' | 'high'>('moderate');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00');
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseName, setExerciseName] = useState('');

  const workoutTypes = ['Strength', 'Cardio', 'HIIT', 'Core', 'Yoga', 'Walking'];
  const intensityLevels: ('light' | 'moderate' | 'high')[] = ['light', 'moderate', 'high'];

  const handleAddExercise = () => {
    if (!exerciseName.trim()) return;
    setExercises([
      ...exercises,
      {
        id: `ex-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: exerciseName.trim(),
        sets: 3,
        reps: 12,
      },
    ]);
    setExerciseName('');
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddWorkout({
      title: title.trim(),
      type,
      durationMinutes: Number(durationMinutes) || 30,
      calories: Number(calories) || 150,
      intensity,
      date,
      time: time.trim() || undefined,
      completed,
      notes: notes.trim() || undefined,
      exercises: exercises.length > 0 ? exercises : undefined,
    });
    onClose();
  };

  return (
    <div
      id="log-workout-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 transition-all"
    >
      <div className="w-full max-w-sm bg-[#121212] rounded-3xl border border-[#1e1e1e] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#e0e0e0]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#666]">
              Fitness Log
            </span>
            <h2 className="text-lg font-light text-[#e0e0e0]">
              Log or Schedule Workout<span className="text-[#2dd4bf]">.</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#1a1a1a] text-[#666] hover:text-[#e0e0e0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Title */}
          <div>
            <label className="block text-[#888] font-medium mb-1">
              Workout Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Upper Body Dumbbell Routine"
              className="w-full bg-[#161616] border border-[#222] rounded-xl px-3.5 py-2.5 text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#2dd4bf] transition-colors"
            />
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-[#888] font-medium mb-1">
              Activity Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {workoutTypes.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    type === t
                      ? 'bg-[#2dd4bf] text-black font-semibold shadow-[0_0_10px_rgba(45,212,191,0.25)]'
                      : 'bg-[#161616] border border-[#222] text-[#888] hover:text-[#e0e0e0]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Calories */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#888] font-medium mb-1">
                Duration (mins)
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-[#161616] border border-[#222] rounded-xl px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-[#2dd4bf]"
              />
            </div>
            <div>
              <label className="block text-[#888] font-medium mb-1">
                Est. Calories (kcal)
              </label>
              <input
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full bg-[#161616] border border-[#222] rounded-xl px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-[#2dd4bf]"
              />
            </div>
          </div>

          {/* Intensity */}
          <div>
            <label className="block text-[#888] font-medium mb-1">
              Intensity
            </label>
            <div className="grid grid-cols-3 gap-2">
              {intensityLevels.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setIntensity(item)}
                  className={`py-1.5 rounded-lg capitalize font-medium border transition-all ${
                    intensity === item
                      ? 'bg-[#1a1a1a] text-[#2dd4bf] border-[#2dd4bf] font-semibold shadow-[0_0_8px_rgba(45,212,191,0.2)]'
                      : 'bg-[#161616] border-[#222] text-[#666] hover:text-[#aaa]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#888] font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#161616] border border-[#222] rounded-xl px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-[#2dd4bf]"
              />
            </div>
            <div>
              <label className="block text-[#888] font-medium mb-1">
                Time (optional)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#161616] border border-[#222] rounded-xl px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-[#2dd4bf]"
              />
            </div>
          </div>

          {/* Completed checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="already-completed-check"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="rounded accent-[#2dd4bf] bg-[#161616] border-[#333] w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="already-completed-check"
              className="text-[#bbb] font-medium cursor-pointer"
            >
              Already completed this workout
            </label>
          </div>

          {/* Add Exercise */}
          <div>
            <label className="block text-[#888] font-medium mb-1">
              Add Exercises (optional)
            </label>
            <div className="flex gap-1.5 mb-1.5">
              <input
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                placeholder="Exercise name (e.g., Squats)"
                className="flex-1 bg-[#161616] border border-[#222] rounded-xl px-3 py-1.5 text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#2dd4bf]"
              />
              <button
                type="button"
                onClick={handleAddExercise}
                className="px-3 rounded-xl bg-[#1a1a1a] border border-[#333] text-[#2dd4bf] hover:bg-[#222] font-semibold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {exercises.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {exercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between bg-[#161616] border border-[#222] px-3 py-1.5 rounded-lg"
                  >
                    <span className="text-[#ccc] font-medium">
                      {ex.name} ({ex.sets} sets × {ex.reps} reps)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(ex.id)}
                      className="text-[#666] hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[#888] font-medium mb-1">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Form cues, how it felt, or warm-up notes..."
              className="w-full bg-[#161616] border border-[#222] rounded-xl px-3.5 py-2 text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#2dd4bf]"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-[#1e1e1e]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#222] bg-[#161616] text-[#888] hover:text-[#e0e0e0] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-log-workout-btn"
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#2dd4bf] hover:bg-[#25c4af] text-black font-semibold transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)]"
            >
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
