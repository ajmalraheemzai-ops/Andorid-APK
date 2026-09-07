export type Priority = 'high' | 'medium' | 'low';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
  dueTime?: string;
  notes?: string;
  subtasks?: SubTask[];
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weightKg?: number;
}

export interface Workout {
  id: string;
  title: string;
  type: string;
  durationMinutes: number;
  calories: number;
  intensity: 'light' | 'moderate' | 'high';
  date: string;
  time?: string;
  completed: boolean;
  notes?: string;
  exercises?: Exercise[];
}

export interface DailyStats {
  steps: number;
  stepGoal: number;
  activeMinutes: number;
  caloriesBurned: number;
  waterGlasses: number;
  streakDays: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type TabType = 'today' | 'tasks' | 'fitness' | 'ai';
