import React, { useState } from 'react';
import { Plus, Search, Check, ChevronDown, ChevronUp, Trash2, Calendar, Clock } from 'lucide-react';
import { Task } from '../types';

interface TasksTabProps {
  tasks: Task[];
  onOpenAddTaskModal: () => void;
  onToggleTaskCompleted: (id: string) => void;
  onToggleSubtaskCompleted: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  onOpenAddTaskModal,
  onToggleTaskCompleted,
  onToggleSubtaskCompleted,
  onDeleteTask,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'today'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Work', 'Personal', 'Health', 'Focus', 'Errands'];

  const toggleExpand = (id: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((task) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchNotes = task.notes?.toLowerCase().includes(q);
      const matchCategory = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchCategory) return false;
    }

    // Status filter
    if (filter === 'pending' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (filter === 'today' && task.dueDate !== todayStr) return false;

    // Category filter
    if (selectedCategory !== 'All' && task.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  const getPriorityBadge = (p: Task['priority']) => {
    switch (p) {
      case 'high':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#2a1313] text-red-400 border border-red-900/60">
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-[#261f12] text-amber-400 border border-amber-900/60">
            MED
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-[#161616] text-[#2dd4bf] border border-[#222]">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a] text-[#e0e0e0]">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#666]">
            Workflow & To-dos
          </span>
          <h1 className="text-xl font-light text-[#e0e0e0]">
            Task Central<span className="text-[#2dd4bf]">.</span>
          </h1>
        </div>
        <button
          id="new-task-btn"
          onClick={onOpenAddTaskModal}
          className="px-3 py-1.5 rounded-full bg-[#161616] hover:bg-[#202020] border border-[#262626] text-[#2dd4bf] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(45,212,191,0.15)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter or search tasks..."
          className="w-full bg-[#121212] border border-[#1e1e1e] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#2dd4bf] transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-[#141414] p-1 rounded-xl border border-[#1e1e1e]">
        {(['all', 'pending', 'completed', 'today'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1 text-center text-xs font-medium capitalize rounded-lg transition-all ${
              filter === tab
                ? 'bg-[#1f1f1f] text-[#2dd4bf] shadow-sm'
                : 'text-[#666] hover:text-[#bbb]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#2dd4bf] text-black font-semibold shadow-[0_0_8px_rgba(45,212,191,0.25)]'
                : 'bg-[#141414] border border-[#222] text-[#777] hover:text-[#ccc]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 rounded-2xl bg-[#121212] border border-[#1e1e1e] text-[#666] text-xs font-mono">
            No matching tasks found.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const completedSubtasks =
              task.subtasks?.filter((st) => st.completed).length || 0;
            const isExpanded = expandedTasks[task.id];

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  task.completed
                    ? 'bg-[#101010] border-[#181818] opacity-75'
                    : 'bg-[#121212] border-[#1e1e1e] hover:border-[#282828]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2.5 flex-1 pr-2">
                    <button
                      onClick={() => onToggleTaskCompleted(task.id)}
                      className={`w-5 h-5 mt-0.5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                        task.completed
                          ? 'bg-[#2dd4bf] border-[#2dd4bf] text-black'
                          : 'border-[#3a3a3a] hover:border-[#2dd4bf]'
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {getPriorityBadge(task.priority)}
                        <span className="text-[10px] font-mono text-[#666] bg-[#161616] px-2 py-0.5 rounded border border-[#222]">
                          {task.category}
                        </span>
                      </div>

                      <div
                        className={`text-xs font-medium leading-snug break-words ${
                          task.completed
                            ? 'line-through text-[#666]'
                            : 'text-[#e0e0e0]'
                        }`}
                      >
                        {task.title}
                      </div>

                      {task.notes && (
                        <p className="text-[11px] text-[#777] mt-1 line-clamp-2">
                          {task.notes}
                        </p>
                      )}

                      {/* Meta info */}
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-[#666]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#555]" />
                          {task.dueDate}
                        </span>
                        {task.dueTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#555]" />
                            {task.dueTime}
                          </span>
                        )}
                        {hasSubtasks && (
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="flex items-center gap-0.5 text-[#2dd4bf] hover:underline"
                          >
                            <span>
                              {completedSubtasks}/{task.subtasks!.length} steps
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-[#555] hover:text-red-400 rounded-lg hover:bg-[#181818] transition-colors shrink-0"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtask accordion */}
                {hasSubtasks && isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-[#1a1a1a] space-y-1.5 pl-7">
                    {task.subtasks!.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => onToggleSubtaskCompleted(task.id, st.id)}
                        className="flex items-center space-x-2 text-xs cursor-pointer select-none group"
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                            st.completed
                              ? 'bg-[#2dd4bf] border-[#2dd4bf] text-black'
                              : 'border-[#444] group-hover:border-[#2dd4bf]'
                          }`}
                        >
                          {st.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span
                          className={`${
                            st.completed
                              ? 'line-through text-[#666]'
                              : 'text-[#bbb]'
                          }`}
                        >
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
