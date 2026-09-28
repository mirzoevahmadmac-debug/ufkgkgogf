import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (email: string) => void;
}

// Initial demo accounts in memory for immediate multi-user testing
const INITIAL_USERS: User[] = [
  {
    id: 'user_alex',
    email: 'alex@example.com',
    name: 'Alex Morgan',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'user_sarah',
    email: 'sarah@example.com',
    name: 'Sarah Chen',
    createdAt: '2026-09-10T11:30:00Z',
  },
];

// In-memory credentials map (email -> password)
const INITIAL_CREDENTIALS: Record<string, string> = {
  'alex@example.com': 'password123',
  'sarah@example.com': 'password123',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pure in-memory state (NO localStorage, NO fake server)
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [credentials, setCredentials] = useState<Record<string, string>>(INITIAL_CREDENTIALS);
  // Default to null so user lands on login/register page
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Simulate brief network delay for realistic UI transition
    await new Promise((resolve) => setTimeout(resolve, 350));

    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    const storedPassword = credentials[normalizedEmail];

    if (!user || storedPassword !== password) {
      return {
        success: false,
        error: 'Invalid email or password. If you are new, please create an account first.',
      };
    }

    setCurrentUser(user);
    return { success: true };
  };

  const register = async (
    email: string,
    password: string,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();

    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const existingUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      name: name?.trim() || normalizedEmail.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCredentials((prev) => ({ ...prev, [normalizedEmail]: password }));
    setCurrentUser(newUser);

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        switchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
