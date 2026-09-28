import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { AuthPage } from './components/auth/AuthPage';
import { DashboardPage } from './components/dashboard/DashboardPage';

const MainRouter: React.FC = () => {
  const { currentUser } = useAuth();

  return currentUser ? <DashboardPage /> : <AuthPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <MainRouter />
      </TaskProvider>
    </AuthProvider>
  );
}
