import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  Trash2,
  Calendar,
  AlertTriangle,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { Task } from '../../types';
import { useTasks } from '../../context/TaskContext';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);

  // Formatting date and overdue check
  const getDueStatus = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date().toISOString().split('T')[0];
    const isOverdue = dueDate < today && !task.isCompleted;
    const isToday = dueDate === today;

    const parts = dueDate.split('-');
    const formatted =
      parts.length === 3
        ? new Date(
            parseInt(parts[0]),
            parseInt(parts[1]) - 1,
            parseInt(parts[2])
          ).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : dueDate;

    return {
      formatted,
      isOverdue,
      isToday,
    };
  };

  const dueStatus = getDueStatus(task.dueDate);

  const getPriorityStyle = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return {
          label: 'High',
          color: 'text-rose-600',
          dot: 'bg-rose-500',
        };
      case 'medium':
        return {
          label: 'Medium',
          color: 'text-amber-600',
          dot: 'bg-amber-500',
        };
      case 'low':
      default:
        return {
          label: 'Low',
          color: 'text-zinc-500',
          dot: 'bg-zinc-400',
        };
    }
  };

  const priorityStyle = getPriorityStyle(task.priority);

  const handleDelete = () => {
    setIsDeleting(true);
    // Smooth exit
    setTimeout(() => {
      deleteTask(task.id);
    }, 180);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDeleting ? 0 : 1, y: 0, scale: isDeleting ? 0.98 : 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-white border rounded-2xl p-4 sm:p-4.5 transition-all hover:shadow-sm ${
        task.isCompleted
          ? 'border-zinc-200/60 bg-zinc-50/50'
          : 'border-zinc-200 hover:border-zinc-300'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Interactive Checkbox */}
        <button
          type="button"
          onClick={() => toggleTask(task.id)}
          className={`shrink-0 mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
            task.isCompleted
              ? 'bg-zinc-900 border-zinc-900 text-white shadow-2xs'
              : 'border-zinc-300 hover:border-zinc-500 bg-white'
          }`}
          aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {task.isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </motion.div>
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => toggleTask(task.id)}
              className={`text-sm font-medium tracking-tight cursor-pointer select-none transition-colors ${
                task.isCompleted
                  ? 'line-through text-zinc-400'
                  : 'text-zinc-900 hover:text-zinc-700'
              }`}
            >
              {task.title}
            </h3>

            {/* Delete button (accessible on desktop hover or visible on mobile) */}
            <button
              type="button"
              onClick={handleDelete}
              className="shrink-0 p-1.5 -mr-1 -mt-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer opacity-70 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              title="Delete task"
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Description if present */}
          {task.description && (
            <p
              className={`mt-1 text-xs leading-relaxed line-clamp-2 ${
                task.isCompleted ? 'text-zinc-400 line-through' : 'text-zinc-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Unboxed Metadata Line (Zero-Pill Discipline) */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-600">
            {/* Priority Indicator */}
            <span className={`inline-flex items-center gap-1 font-medium ${priorityStyle.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
              {priorityStyle.label}
            </span>

            <span>·</span>

            {/* Category */}
            <span className="capitalize text-zinc-600">
              {task.category}
            </span>

            {/* Due Date if set */}
            {dueStatus && (
              <>
                <span>·</span>
                <span
                  className={`inline-flex items-center gap-1 font-medium ${
                    dueStatus.isOverdue
                      ? 'text-rose-600'
                      : dueStatus.isToday
                      ? 'text-amber-600'
                      : 'text-zinc-500'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  {dueStatus.isOverdue
                    ? `Overdue (${dueStatus.formatted})`
                    : dueStatus.isToday
                    ? 'Due Today'
                    : `Due ${dueStatus.formatted}`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
