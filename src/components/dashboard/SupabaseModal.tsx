import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Database, Shield, Key } from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const sqlSchema = `-- Supabase SQL Schema for TaskFlow
-- Paste this directly into your Supabase SQL Editor:

-- 1. Create tasks table
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  is_completed boolean not null default false,
  priority text not null check (priority in ('low', 'medium', 'high')),
  category text not null default 'general',
  due_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.tasks enable row level security;

-- 3. RLS Policy: Each user can only view their own tasks
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

-- 4. RLS Policy: Users can insert their own tasks
create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

-- 5. RLS Policy: Users can update their own tasks
create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

-- 6. RLS Policy: Users can delete their own tasks
create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs transition-opacity"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 sm:p-7 z-10 max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900 tracking-tight">
                    Supabase Schema & RLS Architecture
                  </h2>
                  <p className="text-xs text-zinc-600">
                    Frontend is architected to match this schema 1:1
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 overflow-y-auto space-y-4 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900 mb-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Row Level Security (RLS)</span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed text-[11px]">
                    Guarantees that each user strictly accesses only their own tasks via <code className="text-zinc-800 bg-zinc-200/60 px-1 py-0.5 rounded">auth.uid() = user_id</code>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900 mb-1">
                    <Key className="w-3.5 h-3.5 text-zinc-700" />
                    <span>Pure In-Memory Frontend</span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed text-[11px]">
                    Currently runs without localStorage or fake server backends. Ready to connect via <code className="text-zinc-800 bg-zinc-200/60 px-1 py-0.5 rounded">@supabase/supabase-js</code>.
                  </p>
                </div>
              </div>

              {/* Code block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-700">
                    Supabase SQL Migration Script
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-zinc-900 text-zinc-100 rounded-2xl text-[11px] leading-relaxed overflow-x-auto font-mono max-h-60 border border-zinc-800">
                  {sqlSchema}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
