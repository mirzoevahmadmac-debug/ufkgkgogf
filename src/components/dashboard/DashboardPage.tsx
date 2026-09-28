import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  CheckCircle2,
  Clock,
  CheckSquare,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { Header } from './Header';
import { TaskList } from './TaskList';
import { TaskCreateModal } from './TaskCreateModal';
import { SupabaseModal } from './SupabaseModal';

export const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { stats, userTasks } = useTasks();

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between selection:bg-zinc-900 selection:text-white">
      {/* Top Navigation */}
      <Header
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* User Isolation Reminder Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-950">
                User Task Isolation Active
              </p>
              <p className="text-[11px] text-emerald-700">
                Logged in as <strong className="font-semibold">{currentUser.email}</strong>. Only tasks created by or assigned to your account are visible.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-emerald-800 font-medium bg-emerald-100/70 px-2.5 py-1 rounded-md shrink-0">
            User ID: <span className="font-mono">{currentUser.id.slice(0, 14)}...</span>
          </div>
        </div>

        {/* Dashboard Title & Quick Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              My Tasks
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Manage, organize, and complete your personal action items
            </p>
          </div>

          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Tasks */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Total Tasks
              </span>
              <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-900">{stats.total}</span>
              <span className="text-xs text-zinc-500">recorded</span>
            </div>
          </div>

          {/* Active Tasks */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Active / Pending
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-900">{stats.active}</span>
              <span className="text-xs text-zinc-500">in progress</span>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Completed
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-900">{stats.completed}</span>
              <span className="text-xs text-zinc-500">done</span>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-xs col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Progress
              </span>
              <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <span className="text-2xl font-bold text-zinc-900">
                {stats.completionPercentage}%
              </span>
              <span className="text-xs text-zinc-500">completion</span>
            </div>
            {/* Progress Bar */}
            <div className="mt-2.5 w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-zinc-900 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Task List Main Section */}
        <section>
          <TaskList onOpenNewTaskModal={() => setIsNewTaskOpen(true)} />
        </section>
      </main>

      {/* Task Creation Modal */}
      <TaskCreateModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />

      {/* Supabase Schema Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-200/70 py-4 px-6 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TaskFlow · My Tasks · Personal Workspace</span>
          <div className="flex items-center gap-4 text-zinc-600">
            <span>Scoped to {currentUser.email}</span>
            <span>·</span>
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className="text-zinc-600 hover:text-zinc-900 underline cursor-pointer"
            >
              Supabase Ready
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
