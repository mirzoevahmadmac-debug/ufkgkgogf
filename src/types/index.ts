export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type TaskCategory = 'work' | 'personal' | 'urgent' | 'study' | 'general';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: Priority;
  category: TaskCategory;
  dueDate?: string; // YYYY-MM-DD
  createdAt: string;
}

export type TaskFilter = 'all' | 'active' | 'completed';
export type TaskSort = 'newest' | 'oldest' | 'dueDate' | 'priority';
