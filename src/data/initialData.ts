import { Task, Workout, DailyFitnessStats, ChatMessage } from '../types';

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffsetString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Review quarterly project deliverables',
    category: 'Work',
    priority: 'high',
    dueDate: getTodayString(),
    dueTime: '10:30',
    completed: true,
    subtasks: [
      { id: 'st-1', title: 'Audit client feedback', completed: true },
      { id: 'st-2', title: 'Draft update email', completed: true },
    ],
    notes: 'Send summary to team lead before lunch',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    title: 'Prepare healthy post-workout meal',
    category: 'Health',
    priority: 'medium',
    dueDate: getTodayString(),
    dueTime: '13:00',
    completed: false,
    notes: 'Grilled chicken salad with quinoa and avocado',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    title: 'Client product demo & feedback sync',
    category: 'Work',
    priority: 'high',
    dueDate: getTodayString(),
    dueTime: '15:00',
    completed: false,
    subtasks: [
      { id: 'st-3', title: 'Test screen share & demo build', completed: true },
      { id: 'st-4', title: 'Note down feature requests', completed: false },
    ],
    notes: 'Keep meeting strictly within 30 minutes',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-4',
    title: 'Evening reading & digital wind-down',
    category: 'Personal',
    priority: 'low',
    dueDate: getTodayString(),
    dueTime: '21:30',
    completed: false,
    notes: 'Chapter 4 & 5 of Atomic Habits (no phone after 10 PM)',
    createdAt: new Date().toISOString(),
  },
  // Tomorrow / Upcoming
  {
    id: 't-5',
    title: 'Team sprint backlog refinement',
    category: 'Work',
    priority: 'medium',
    dueDate: getTomorrowString(),
    dueTime: '11:00',
    completed: false,
    subtasks: [
      { id: 'st-5', title: 'Estimate story points', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-6',
    title: 'Pick up running shoes & grocery run',
    category: 'Errands',
    priority: 'low',
    dueDate: getTomorrowString(),
    dueTime: '17:30',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const initialWorkouts: Workout[] = [
  {
    id: 'w-1',
    title: 'Morning Zone 2 Outdoor Run',
    type: 'Running',
    durationMinutes: 35,
    calories: 340,
    date: getTodayString(),
    time: '07:00',
    completed: true,
    intensity: 'Moderate',
    notes: '5.2 km at steady 6:40/km pace. Felt energized!',
    exercises: [
      { id: 'e-1', name: 'Dynamic Hamstring Stretch', sets: 2, completed: true },
      { id: 'e-2', name: 'Zone 2 Aerobic Run', sets: 1, completed: true },
      { id: 'e-3', name: 'Calf & Quad Cool-down', sets: 2, completed: true },
    ],
  },
  {
    id: 'w-2',
    title: 'Full Body Functional Strength',
    type: 'Strength',
    durationMinutes: 45,
    calories: 290,
    date: getTodayString(),
    time: '18:00',
    completed: false,
    intensity: 'High',
    notes: 'Focus on clean dumbbell form and core brace',
    exercises: [
      { id: 'e-4', name: 'Goblet Squats', sets: 4, reps: 12, weightKg: 18, completed: false },
      { id: 'e-5', name: 'Dumbbell Overhead Press', sets: 3, reps: 10, weightKg: 12, completed: false },
      { id: 'e-6', name: 'Romanian Deadlifts', sets: 3, reps: 10, weightKg: 24, completed: false },
      { id: 'e-7', name: 'Plank Hold', sets: 3, reps: 45, completed: false },
    ],
  },
  {
    id: 'w-3',
    title: 'Mobility & Hip Flexor Flow',
    type: 'Yoga',
    durationMinutes: 20,
    calories: 95,
    date: getTomorrowString(),
    time: '07:30',
    completed: false,
    intensity: 'Light',
    notes: 'Active recovery focus before sprint planning',
  },
  {
    id: 'w-4',
    title: 'HIIT Express Intervals',
    type: 'HIIT',
    durationMinutes: 25,
    calories: 260,
    date: getTomorrowString(),
    time: '18:30',
    completed: false,
    intensity: 'High',
    notes: 'Tabata protocol (20s on / 10s off)',
  },
];

export const initialStats: DailyFitnessStats = {
  steps: 6840,
  stepGoal: 10000,
  activeMinutes: 35,
  caloriesBurned: 340,
  waterGlasses: 5,
  streakDays: 4,
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'm-1',
    role: 'assistant',
    content: "Hi there! I'm your Android Todo & Fitness assistant. I have full context of your tasks, workouts, and upcoming schedule. How can I help you plan your day or optimize your training?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];
