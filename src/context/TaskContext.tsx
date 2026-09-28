import React, { createContext, useContext, useState } from 'react';
import { Task, Priority, TaskCategory } from '../types';
import { useAuth } from './AuthContext';

interface CreateTaskInput {
  title: string;
  description?: string;
  priority: Priority;
  category: TaskCategory;
  dueDate?: string;
}

interface TaskContextType {
  tasks: Task[];
  userTasks: Task[];
  createTask: (input: CreateTaskInput) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  stats: {
    total: number;
    completed: number;
    active: number;
    completionPercentage: number;
  };
}

// Initial tasks for demo users demonstrating that tasks belong strictly to user_id
const INITIAL_TASKS: Task[] = [
  // Alex's tasks
  {
    id: 'task_alex_1',
    userId: 'user_alex',
    title: 'Review quarterly goals & roadmap',
    description: 'Prepare notes for product sync and prioritize sprint items for Q4.',
    isCompleted: false,
    priority: 'high',
    category: 'work',
    dueDate: '2026-10-02',
    createdAt: '2026-09-25T09:15:00Z',
  },
  {
    id: 'task_alex_2',
    userId: 'user_alex',
    title: 'Order groceries and meal prep',
    description: 'Buy vegetables, Greek yogurt, coffee beans, and oats.',
    isCompleted: true,
    priority: 'medium',
    category: 'personal',
    dueDate: '2026-09-29',
    createdAt: '2026-09-26T14:30:00Z',
  },
  {
    id: 'task_alex_3',
    userId: 'user_alex',
    title: 'Read 2 chapters of System Design Interview',
    description: 'Focus on distributed cache and rate limiting architectures.',
    isCompleted: false,
    priority: 'low',
    category: 'study',
    dueDate: '2026-10-05',
    createdAt: '2026-09-27T18:00:00Z',
  },

  // Sarah's tasks (completely separate from Alex's)
  {
    id: 'task_sarah_1',
    userId: 'user_sarah',
    title: 'Finalize Figma design components',
    description: 'Ensure color tokens, typography scales, and button states match design system specs.',
    isCompleted: true,
    priority: 'high',
    category: 'work',
    dueDate: '2026-09-28',
    createdAt: '2026-09-24T10:00:00Z',
  },
  {
    id: 'task_sarah_2',
    userId: 'user_sarah',
    title: 'Book dentist appointment',
    description: 'Call Dr. Martinez clinic for routine checkup and cleaning.',
    isCompleted: false,
    priority: 'medium',
    category: 'personal',
    dueDate: '2026-10-01',
    createdAt: '2026-09-27T11:20:00Z',
  },
  {
    id: 'task_sarah_3',
    userId: 'user_sarah',
    title: 'Submit quarterly budget report',
    description: 'Consolidate vendor invoices and software subscription expenses.',
    isCompleted: false,
    priority: 'urgent' as any, // fallback or high
    category: 'work',
    dueDate: '2026-09-30',
    createdAt: '2026-09-28T08:45:00Z',
  },
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  // Pure in-memory state: NO localStorage, NO fake server backend
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  // Requirement 5: Each user should only see their own tasks
  const userTasks = currentUser
    ? tasks.filter((task) => task.userId === currentUser.id)
    : [];

  const createTask = (input: CreateTaskInput) => {
    if (!currentUser) return;

    const newTask: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUser.id,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      isCompleted: false,
      priority: input.priority || 'medium',
      category: input.category || 'general',
      dueDate: input.dueDate || undefined,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id && t.userId === currentUser?.id) {
          return { ...t, isCompleted: !t.isCompleted };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) =>
      prev.filter((t) => !(t.id === id && t.userId === currentUser?.id))
    );
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id && t.userId === currentUser?.id) {
          return { ...t, ...updates };
        }
        return t;
      })
    );
  };

  const total = userTasks.length;
  const completed = userTasks.filter((t) => t.isCompleted).length;
  const active = total - completed;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        userTasks,
        createTask,
        toggleTask,
        deleteTask,
        updateTask,
        stats: {
          total,
          completed,
          active,
          completionPercentage,
        },
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
