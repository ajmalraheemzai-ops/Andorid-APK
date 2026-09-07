import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Trash2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { ChatMessage, Task, Workout } from '../types';

interface AIChatTabProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearChat: () => void;
  isLoading: boolean;
  tasks: Task[];
  workouts: Workout[];
}

export const AIChatTab: React.FC<AIChatTabProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  tasks,
  workouts,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText.trim();
    setInputText('');
    onSendMessage(text);
  };

  const handleQuickPromptClick = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const quickPrompts = [
    { label: '📅 Analyze Today', prompt: 'Analyze today’s schedule, pending tasks, and workout plan. Give me a concise executive action plan.' },
    { label: '💪 Suggest Workout', prompt: 'Based on my recent workouts and recovery status, what quick 25-minute workout should I do next?' },
    { label: '⚡ Prioritize Tasks', prompt: 'Help me prioritize my open tasks using the Eisenhower Matrix or priority order.' },
    { label: '💧 Hydration & Recovery', prompt: 'What are 3 quick tips for optimal recovery and staying hydrated today?' },
  ];

  const pendingTasks = tasks.filter((t) => !t.completed);
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysWorkouts = workouts.filter((w) => w.date === todayStr);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0a0a] text-[#e0e0e0]">
      {/* Top Context & Controls Header */}
      <div className="px-5 py-3.5 border-b border-[#1e1e1e] bg-[#121212]/90 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#1a1a1a] border border-[#333] text-[#2dd4bf] flex items-center justify-center shadow-[0_0_10px_rgba(45,212,191,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h1 className="text-xs font-medium text-[#e0e0e0] flex items-center gap-1.5">
              <span>Android AI Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-pulse"></span>
            </h1>
            <p className="text-[10px] font-mono text-[#666]">
              Synced with {pendingTasks.length} tasks & {todaysWorkouts.length} workouts
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            id="clear-chat-btn"
            onClick={onClearChat}
            className="p-1.5 text-[#666] hover:text-[#e0e0e0] rounded-lg hover:bg-[#1a1a1a] transition-colors"
            title="Clear chat history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium border ${
                  isUser
                    ? 'bg-[#1a1a1a] border-[#333] text-[#2dd4bf]'
                    : 'bg-[#161616] border-[#222] text-[#2dd4bf]'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-[#2dd4bf]" />}
              </div>

              <div
                className={`max-w-[84%] px-4 py-3 rounded-2xl text-xs leading-relaxed transition-all ${
                  isUser
                    ? 'bg-[#2dd4bf] text-black font-medium rounded-tr-xs shadow-[0_0_15px_rgba(45,212,191,0.2)]'
                    : 'bg-[#121212] text-[#e0e0e0] border border-[#1e1e1e] rounded-tl-xs shadow-lg'
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="markdown-body text-[#e0e0e0] space-y-2 [&_strong]:text-[#2dd4bf] [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:bg-[#1a1a1a] [&_code]:text-[#2dd4bf] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded">
                    <Markdown>{message.content}</Markdown>
                  </div>
                )}
                <div
                  className={`text-[9px] font-mono mt-1.5 text-right ${
                    isUser
                      ? 'text-black/60'
                      : 'text-[#666]'
                  }`}
                >
                  {message.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#161616] border border-[#222] text-[#2dd4bf] flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-3.5 h-3.5 text-[#2dd4bf] animate-pulse" />
            </div>
            <div className="bg-[#121212] border border-[#1e1e1e] rounded-2xl rounded-tl-xs px-4 py-3 shadow-lg">
              <div className="flex items-center space-x-1.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf] animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-[10px] font-mono text-[#777]">Synthesizing routine & schedules...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 border-t border-[#1a1a1a] bg-[#0c0c0c]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              id={`quick-prompt-${idx}`}
              onClick={() => handleQuickPromptClick(item.prompt)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full bg-[#161616] hover:bg-[#1f1f1f] border border-[#222] hover:border-[#333] text-[#888] hover:text-[#2dd4bf] text-[11px] font-medium whitespace-nowrap transition-colors disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-[#121212] border-t border-[#1e1e1e]">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about tasks, workouts, or upcoming day..."
            disabled={isLoading}
            className="flex-1 bg-[#161616] border border-[#222] rounded-full px-4 py-2.5 text-xs text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#2dd4bf] transition-colors disabled:opacity-50"
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="w-9 h-9 rounded-full bg-[#2dd4bf] hover:bg-[#25c4af] text-black flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(45,212,191,0.25)]"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
};
