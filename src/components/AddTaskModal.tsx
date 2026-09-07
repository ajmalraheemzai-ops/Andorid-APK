import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Priority, SubTask, Task } from '../types';

interface AddTaskModalProps {
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('14:00');
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const categories = ['Work', 'Personal', 'Health', 'Focus', 'Errands'];
  const priorities: Priority[] = ['low', 'medium', 'high'];

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority,
      dueDate,
      dueTime: dueTime.trim() || undefined,
      notes: notes.trim() || undefined,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
    });
    onClose();
  };

  return (
    <div
      id="add-task-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 transition-all"
    >
      <div className="w-full max-w-sm bg-[#121212] rounded-3xl border border-[#1e1e1e] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#e0e0e0]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#666]">
              New Record
            </span>
            <h2 className="text-lg font-light text-[#e0e0e0]">
              Create New Task<span className="text-[#2dd4bf]">.</span>
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
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Complete strategy analysis"
              className="w-full bg-[#161616] border border-[#222] rounded-xl px-3.5 py-2.5 text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#2dd4bf] transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[#888] font-medium mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    category === cat
                      ? 'bg-[#2dd4bf] text-black font-semibold shadow-[0_0_10px_rgba(45,212,191,0.25)]'
                      : 'bg-[#161616] border border-[#222] text-[#888] hover:text-[#e0e0e0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[#888] font-medium mb-1">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorities.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-1.5 rounded-lg capitalize font-medium border transition-all ${
                    priority === p
                      ? p === 'high'
                        ? 'bg-[#2a1313] text-red-400 border-red-900/60 font-semibold'
                        : p === 'medium'
                        ? 'bg-[#261f12] text-amber-400 border-amber-900/60 font-semibold'
                        : 'bg-[#161616] text-[#2dd4bf] border-[#2dd4bf] font-semibold'
                      : 'bg-[#161616] border-[#222] text-[#666]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[#888] font-medium mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#161616] border border-[#222] rounded-xl px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-[#2dd4bf]"
              />
            </div>
            <div>
              <label className="block text-[#888] font-medium mb-1">
                Time (optional)
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-[#161616] border border-[#222] rounded-xl px-3 py-2 text-[#e0e0e0] focus:outline-none focus:border-[#2dd4bf]"
              />
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-[#888] font-medium mb-1">
              Subtasks
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add a step..."
                className="flex-1 bg-[#161616] border border-[#222] rounded-xl px-3 py-2 text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#2dd4bf]"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 rounded-xl bg-[#1a1a1a] border border-[#333] text-[#2dd4bf] hover:bg-[#222] font-semibold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {subtasks.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between bg-[#161616] border border-[#222] px-3 py-1.5 rounded-lg"
                  >
                    <span className="text-[#ccc]">{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
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
              Notes (optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Context or details..."
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
              id="submit-create-task-btn"
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#2dd4bf] hover:bg-[#25c4af] text-black font-semibold transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)]"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
