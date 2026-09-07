import React, { useState, useEffect } from 'react';
import { Task, Workout, DailyStats, ChatMessage, TabType } from './types';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidNavBar } from './components/AndroidNavBar';
import { BottomNavigation } from './components/BottomNavigation';
import { TodayTab } from './components/TodayTab';
import { TasksTab } from './components/TasksTab';
import { FitnessTab } from './components/FitnessTab';
import { AIChatTab } from './components/AIChatTab';
import { AddTaskModal } from './components/AddTaskModal';
import { LogWorkoutModal } from './components/LogWorkoutModal';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Modals state
  const [isAddTaskOpen, setIsAddTaskOpen] = useState<boolean>(false);
  const [isLogWorkoutOpen, setIsLogWorkoutOpen] = useState<boolean>(false);
  const [activeWorkoutSession, setActiveWorkoutSession] = useState<Workout | null>(null);

  // Initial demo data
  const defaultTasks: Task[] = [
    {
      id: 't1',
      title: 'Review quarterly fitness & work objectives',
      category: 'Work',
      priority: 'high',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '10:30',
      notes: 'Ensure milestones align with energy management and daily habits.',
      subtasks: [
        { id: 'st1', title: 'Prepare summary deck', completed: true },
        { id: 'st2', title: 'Review sprint velocity', completed: false },
      ],
    },
    {
      id: 't2',
      title: 'Meal prep high-protein lunches for week',
      category: 'Health',
      priority: 'medium',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '18:00',
      notes: 'Grilled chicken, quinoa, steamed broccoli, olive oil dressing.',
    },
    {
      id: 't3',
      title: 'Draft architecture overview for team',
      category: 'Focus',
      priority: 'high',
      completed: true,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '09:00',
    },
    {
      id: 't4',
      title: 'Evening mobility & foam rolling (15 min)',
      category: 'Health',
      priority: 'low',
      completed: false,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '21:00',
    },
  ];

  const defaultWorkouts: Workout[] = [
    {
      id: 'w1',
      title: 'Morning Push & Core Conditioning',
      type: 'Strength',
      durationMinutes: 40,
      calories: 320,
      intensity: 'high',
      date: new Date().toISOString().split('T')[0],
      time: '07:30',
      completed: true,
      exercises: [
        { id: 'e1', name: 'Barbell Bench Press', sets: 4, reps: 10, weightKg: 70 },
        { id: 'e2', name: 'Overhead Dumbbell Press', sets: 3, reps: 12, weightKg: 16 },
        { id: 'e3', name: 'Hanging Leg Raises', sets: 3, reps: 15 },
      ],
    },
    {
      id: 'w2',
      title: 'Evening Zone 2 Aerobic Run',
      type: 'Cardio',
      durationMinutes: 30,
      calories: 280,
      intensity: 'moderate',
      date: new Date().toISOString().split('T')[0],
      time: '18:30',
      completed: false,
    },
  ];

  const defaultStats: DailyStats = {
    steps: 7420,
    stepGoal: 10000,
    activeMinutes: 45,
    caloriesBurned: 490,
    waterGlasses: 5,
    streakDays: 14,
  };

  const defaultChat: ChatMessage[] = [
    {
      id: 'm1',
      role: 'assistant',
      content:
        'Hello! I am your **Android Todo & Fitness Assistant**. I am linked directly to your current schedule, active tasks, and workout logs. How can I optimize your performance today?',
      timestamp: '9:00 AM',
    },
  ];

  // Persistent state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('android_tasks_data');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('android_workouts_data');
    return saved ? JSON.parse(saved) : defaultWorkouts;
  });

  const [dailyStats, setDailyStats] = useState<DailyStats>(() => {
    const saved = localStorage.getItem('android_stats_data');
    return saved ? JSON.parse(saved) : defaultStats;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('android_chat_data');
    return saved ? JSON.parse(saved) : defaultChat;
  });

  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('android_tasks_data', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('android_workouts_data', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('android_stats_data', JSON.stringify(dailyStats));
  }, [dailyStats]);

  useEffect(() => {
    localStorage.setItem('android_chat_data', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Tasks handlers
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTaskCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleToggleSubtaskCompleted = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId || !t.subtasks) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ),
        };
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Workouts handlers
  const handleAddWorkout = (newWorkoutData: Omit<Workout, 'id'>) => {
    const newWorkout: Workout = {
      ...newWorkoutData,
      id: `workout-${Date.now()}`,
    };
    setWorkouts((prev) => [newWorkout, ...prev]);
  };

  const handleToggleWorkoutCompleted = (id: string) => {
    setWorkouts((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const newCompleted = !w.completed;
          if (newCompleted) {
            setDailyStats((stats) => ({
              ...stats,
              activeMinutes: stats.activeMinutes + w.durationMinutes,
              caloriesBurned: stats.caloriesBurned + w.calories,
            }));
          }
          return { ...w, completed: newCompleted };
        }
        return w;
      })
    );
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const handleFinishActiveWorkout = (workout: Workout, elapsedSeconds: number) => {
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    setWorkouts((prev) => {
      const exists = prev.find((w) => w.id === workout.id);
      if (exists) {
        return prev.map((w) =>
          w.id === workout.id
            ? { ...w, completed: true, durationMinutes: elapsedMinutes }
            : w
        );
      }
      return [
        { ...workout, completed: true, durationMinutes: elapsedMinutes },
        ...prev,
      ];
    });

    setDailyStats((stats) => ({
      ...stats,
      activeMinutes: stats.activeMinutes + elapsedMinutes,
      caloriesBurned: stats.caloriesBurned + Math.round((workout.calories * elapsedMinutes) / Math.max(1, workout.durationMinutes)),
    }));

    setActiveWorkoutSession(null);
  };

  const handleUpdateWater = (delta: number) => {
    setDailyStats((stats) => ({
      ...stats,
      waterGlasses: Math.max(0, stats.waterGlasses + delta),
    }));
  };

  // AI Chat handler
  const handleSendMessage = async (text: string) => {
    const now = new Date();
    const timeString = `${now.getHours() % 12 || 12}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: timeString,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            tasks,
            workouts,
            dailyStats,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: data.reply || 'Here is your daily optimization breakdown.',
        timestamp: timeString,
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat API Error:', err);
      // Fallback local heuristic reply if server is initializing
      const fallbackReply = generateFallbackResponse(text, tasks, workouts, dailyStats);
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: timeString,
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };

  return (
    <div className="w-full h-screen bg-[#050505] flex items-center justify-center p-0 md:p-6 select-none">
      {/* Android Device Outer Bezel */}
      <div className="w-full h-full md:max-w-[420px] md:h-[840px] md:max-h-[96vh] bg-[#0a0a0a] md:rounded-[44px] md:border-[6px] md:border-[#1e1e1e] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden relative">
        {/* Android Status Bar */}
        <AndroidStatusBar />

        {/* Tab View Container */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'today' && (
            <TodayTab
              tasks={tasks}
              workouts={workouts}
              dailyStats={dailyStats}
              onNavigateTab={setActiveTab}
              onOpenAddTaskModal={() => setIsAddTaskOpen(true)}
              onOpenLogModal={() => setIsLogWorkoutOpen(true)}
              onToggleTaskCompleted={handleToggleTaskCompleted}
              onStartLiveWorkout={(w) => setActiveWorkoutSession(w)}
              onUpdateWater={handleUpdateWater}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksTab
              tasks={tasks}
              onOpenAddTaskModal={() => setIsAddTaskOpen(true)}
              onToggleTaskCompleted={handleToggleTaskCompleted}
              onToggleSubtaskCompleted={handleToggleSubtaskCompleted}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'fitness' && (
            <FitnessTab
              workouts={workouts}
              dailyStats={dailyStats}
              onOpenLogModal={() => setIsLogWorkoutOpen(true)}
              onToggleWorkoutCompleted={handleToggleWorkoutCompleted}
              onDeleteWorkout={handleDeleteWorkout}
              onStartLiveSession={(w) => setActiveWorkoutSession(w)}
              onUpdateWater={handleUpdateWater}
            />
          )}

          {activeTab === 'ai' && (
            <AIChatTab
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              isLoading={isChatLoading}
              tasks={tasks}
              workouts={workouts}
            />
          )}
        </div>

        {/* Bottom Tab Bar */}
        <BottomNavigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingTasksCount={tasks.filter((t) => !t.completed).length}
        />

        {/* Android System Nav Bar */}
        <AndroidNavBar />

        {/* Modals */}
        {isAddTaskOpen && (
          <AddTaskModal
            onClose={() => setIsAddTaskOpen(false)}
            onAddTask={handleAddTask}
          />
        )}

        {isLogWorkoutOpen && (
          <LogWorkoutModal
            onClose={() => setIsLogWorkoutOpen(false)}
            onAddWorkout={handleAddWorkout}
          />
        )}

        {activeWorkoutSession && (
          <ActiveWorkoutModal
            workout={activeWorkoutSession}
            onClose={() => setActiveWorkoutSession(null)}
            onFinish={handleFinishActiveWorkout}
          />
        )}
      </div>
    </div>
  );
};

// Fallback response helper
function generateFallbackResponse(
  query: string,
  tasks: Task[],
  workouts: Workout[],
  stats: DailyStats
): string {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const q = query.toLowerCase();

  if (q.includes('priorit') || q.includes('task')) {
    const high = pendingTasks.filter((t) => t.priority === 'high');
    return `### ⚡ Task Prioritization
You have **${pendingTasks.length} pending tasks**, with **${high.length} high-priority item(s)**:
${high.map((t) => `- **${t.title}** (${t.category}${t.dueTime ? ` @ ${t.dueTime}` : ''})`).join('\n') || '- No high priority items currently!'}

**Recommendation:** Complete your highest cognitive load tasks first before engaging in passive errands.`;
  }

  if (q.includes('workout') || q.includes('fitness') || q.includes('exercise')) {
    return `### 💪 Workout & Movement Advisory
- **Active Today:** ${stats.activeMinutes} mins
- **Calories Burned:** ${stats.caloriesBurned} kcal
- **Steps:** ${stats.steps.toLocaleString()} / ${stats.stepGoal.toLocaleString()}

**Recommendation:** Aim for a 20-minute bodyweight routine or brisk walk to reach your step milestone.`;
  }

  if (q.includes('water') || q.includes('hydrat')) {
    return `### 💧 Hydration & Recovery
You have logged **${stats.waterGlasses} of 8 glasses** today.
- Drink a large glass immediately before your next task session.
- Maintain consistent electrolyte intake if exercising in high temperatures.`;
  }

  return `### 📋 Daily Performance Synthesis
- **Pending Tasks:** ${pendingTasks.length}
- **Steps:** ${stats.steps.toLocaleString()} / ${stats.stepGoal.toLocaleString()}
- **Streak:** ${stats.streakDays} consecutive days active

Stay focused on single-tasking your top priorities and keep momentum going!`;
}
