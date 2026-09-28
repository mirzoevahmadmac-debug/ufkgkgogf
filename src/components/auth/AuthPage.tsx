import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Layers,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthPage: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Interaction states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSupabaseInfo, setShowSupabaseInfo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'register') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Failed to sign in.');
        }
      } else {
        const res = await register(email, password, name);
        if (!res.success) {
          setError(res.error || 'Failed to create account.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError(null);
    setIsLoading(true);
    try {
      const res = await login(demoEmail, 'password123');
      if (!res.success) {
        setError(res.error || 'Demo sign in failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between selection:bg-zinc-900 selection:text-white">
      {/* Top Bar */}
      <header className="border-b border-zinc-200/80 bg-white/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-zinc-900 text-base tracking-tight block">TaskFlow</span>
              <span className="text-[11px] text-zinc-600 block -mt-0.5">Personal Task Manager</span>
            </div>
          </div>

          <button
            onClick={() => setShowSupabaseInfo(!showSupabaseInfo)}
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 transition-colors px-3 py-1.5 rounded-lg font-medium cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Ready</span>
          </button>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Supabase Notice Modal / Banner if toggled */}
          <AnimatePresence>
            {showSupabaseInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-white border border-emerald-200/80 rounded-2xl p-4 shadow-sm text-xs text-zinc-600"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 font-semibold text-emerald-800">
                    <Database className="w-4 h-4 text-emerald-600" />
                    Frontend Architecture Ready for Supabase
                  </div>
                  <button
                    onClick={() => setShowSupabaseInfo(false)}
                    className="text-zinc-600 hover:text-zinc-900 text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-2 text-zinc-600 leading-relaxed">
                  As requested, this is frontend and UI only without fake backend or localStorage. State is managed via pure in-memory React context. When you are ready to connect Supabase, simply hook up <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">supabase.auth</code> and table <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">tasks</code>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-white rounded-3xl border border-zinc-200/90 shadow-xl shadow-zinc-900/5 p-6 sm:p-8"
          >
            {/* Title & Description */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                {mode === 'login' ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-sm text-zinc-500 mt-1.5">
                {mode === 'login'
                  ? 'Sign in to access your personal tasks'
                  : 'Start organizing your daily workflow today'}
              </p>
            </div>

            {/* Mode Toggle Switch */}
            <div className="flex p-1 bg-zinc-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200/70 text-rose-700 text-xs leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Your Name <span className="text-zinc-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-700">
                    Password
                  </label>
                  {mode === 'register' && (
                    <span className="text-[11px] text-zinc-600">min 6 chars</span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins for immediate testing of user isolation */}
            <div className="mt-6 pt-5 border-t border-zinc-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                  Quick Demo Accounts
                </span>
                <span className="text-[11px] text-zinc-600">Tests user task isolation</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('alex@example.com')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/80 transition-all text-left cursor-pointer group"
                >
                  <span className="text-xs font-semibold text-zinc-800 group-hover:text-zinc-900">
                    Alex Morgan
                  </span>
                  <span className="text-[10px] text-zinc-600">alex@example.com</span>
                  <span className="text-[10px] text-emerald-700 font-medium mt-1">3 tasks loaded</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('sarah@example.com')}
                  className="flex flex-col items-start p-2.5 rounded-xl border border-zinc-200/90 hover:border-zinc-300 hover:bg-zinc-50/80 transition-all text-left cursor-pointer group"
                >
                  <span className="text-xs font-semibold text-zinc-800 group-hover:text-zinc-900">
                    Sarah Chen
                  </span>
                  <span className="text-[10px] text-zinc-600">sarah@example.com</span>
                  <span className="text-[10px] text-emerald-700 font-medium mt-1">3 tasks loaded</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Bottom helper text */}
          <div className="text-center mt-5 text-xs text-zinc-600">
            <span>Clean Frontend UI · Ready to connect Supabase</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/70 py-4 px-6 text-center text-xs text-zinc-600">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TaskFlow © 2026 · Pure frontend task management</span>
          <div className="flex items-center gap-4 text-zinc-600">
            <span>In-Memory State</span>
            <span>·</span>
            <span>Framer Motion</span>
            <span>·</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
