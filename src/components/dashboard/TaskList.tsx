import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpDown,
  Plus,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { Task, TaskFilter, TaskSort, Priority } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  onOpenNewTaskModal: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onOpenNewTaskModal }) => {
  const { userTasks } = useTasks();

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<TaskSort>('newest');

  // Filter & sort logic
  const filteredTasks = useMemo(() => {
    return userTasks
      .filter((task) => {
        // Status filter
        if (filter === 'active' && task.isCompleted) return false;
        if (filter === 'completed' && !task.isCompleted) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          const matchCat = task.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'priority') {
          const rank: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
          return rank[b.priority] - rank[a.priority];
        }
        return 0;
      });
  }, [userTasks, filter, priorityFilter, searchQuery, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== '' || filter !== 'all' || priorityFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Filters */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your tasks..."
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          {/* Quick Add Button on mobile/tablet */}
          <button
            onClick={onOpenNewTaskModal}
            className="sm:hidden w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-zinc-100 sm:border-0 sm:pt-0">
          {/* Status Tabs */}
          <div className="flex p-0.5 bg-zinc-100 rounded-xl">
            {(['all', 'active', 'completed'] as TaskFilter[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-white text-zinc-900 shadow-2xs font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 focus:bg-white focus:outline-none focus:border-zinc-900"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Sort Select */}
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1">
              <ArrowUpDown className="w-3 h-3 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as TaskSort)}
                className="text-xs bg-transparent border-0 focus:outline-none text-zinc-700 cursor-pointer pr-1"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task List Count & Active Filters Indicator */}
      <div className="flex items-center justify-between px-1 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-semibold text-zinc-800">{filteredTasks.length}</strong> of{' '}
            <strong className="font-semibold text-zinc-800">{userTasks.length}</strong> {userTasks.length === 1 ? 'task' : 'tasks'}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-zinc-500 hover:text-zinc-900 underline text-[11px] cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Tasks Render List */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-dashed border-zinc-300 rounded-3xl p-8 sm:p-12 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-400">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900">
                {userTasks.length === 0
                  ? 'No tasks yet'
                  : 'No tasks match your filters'}
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto mt-1 leading-relaxed">
                {userTasks.length === 0
                  ? 'Your personal workspace is empty. Create your first task to start tracking your work!'
                  : 'Try clearing your search keyword or switching your filter criteria.'}
              </p>

              <div className="mt-4">
                {userTasks.length === 0 ? (
                  <button
                    onClick={onOpenNewTaskModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Your First Task</span>
                  </button>
                ) : (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-medium transition-all cursor-pointer"
                  >
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
