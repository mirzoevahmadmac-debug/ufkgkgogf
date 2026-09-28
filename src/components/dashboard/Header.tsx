import React, { useState } from 'react';
import {
  CheckCircle2,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Database,
  Users,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenSupabaseModal: () => void;
  onOpenNewTaskModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSupabaseModal,
  onOpenNewTaskModal,
}) => {
  const { currentUser, logout, users, switchUser } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentUser) return null;

  // Generate initials from name or email
  const initials = currentUser.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : currentUser.email[0].toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Section Name */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-zinc-900 text-base tracking-tight hidden sm:inline">
              TaskFlow
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-zinc-900 text-sm sm:text-base">
              My Tasks
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-600">
              Personal Space
            </span>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Supabase Ready Info button */}
          <button
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/70 transition-colors px-3 py-1.5 rounded-lg font-medium cursor-pointer"
            title="View Supabase Schema & RLS guidelines"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Supabase Ready</span>
          </button>

          {/* User Profile & Multi-User Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-800 leading-tight">
                  {currentUser.name || currentUser.email.split('@')[0]}
                </span>
                <span className="text-[10px] text-zinc-600 leading-none">
                  {currentUser.email}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
            </button>

            {/* Dropdown for account info & user switcher */}
            {showUserDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-zinc-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 border-b border-zinc-100 mb-2">
                    <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
                      Current User
                    </p>
                    <p className="text-xs font-semibold text-zinc-900 mt-0.5">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-zinc-600">{currentUser.email}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Tasks are strictly private to this account</span>
                    </div>
                  </div>

                  {/* Switch to other account in memory to verify isolation */}
                  <div className="mb-2">
                    <p className="text-[10px] font-semibold text-zinc-600 px-2 mb-1 uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3 h-3 text-zinc-400" />
                      <span>Switch Account (Test Isolation)</span>
                    </p>
                    <div className="space-y-1">
                      {users.map((user) => (
                        <button
                          key={user.id}
                          disabled={user.id === currentUser.id}
                          onClick={() => {
                            switchUser(user.email);
                            setShowUserDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            user.id === currentUser.id
                              ? 'bg-zinc-100 font-semibold text-zinc-900 cursor-default'
                              : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <div className="w-5 h-5 rounded-md bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-700">
                              {user.name ? user.name[0] : user.email[0].toUpperCase()}
                            </div>
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.id === currentUser.id && (
                            <span className="text-[10px] text-zinc-600 font-medium">Active</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-2 border-t border-zinc-100">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Explicit Logout Button in navbar as required */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-rose-600 hover:bg-rose-50/70 border border-zinc-200 hover:border-rose-200 transition-all px-3 py-1.5 rounded-xl cursor-pointer"
            title="Log out of your account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 truncate">
                {currentUser.name || currentUser.email}
              </p>
              <p className="text-[11px] text-zinc-600 truncate">{currentUser.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-1">
              Switch Test Account
            </p>
            {users.map((user) => (
              <button
                key={user.id}
                disabled={user.id === currentUser.id}
                onClick={() => {
                  switchUser(user.email);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between ${
                  user.id === currentUser.id
                    ? 'bg-zinc-100 font-semibold text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <span>{user.email}</span>
                {user.id === currentUser.id && (
                  <span className="text-[10px] text-zinc-600">Active</span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSupabaseModal();
              }}
              className="flex-1 py-2 text-xs text-zinc-700 bg-zinc-100 rounded-lg font-medium flex items-center justify-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase Schema</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="flex-1 py-2 text-xs text-rose-600 bg-rose-50 rounded-lg font-semibold flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
