import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LanguageSelector } from './LanguageSelector';
import { LevelSelector } from './LevelSelector';
import {
  Menu,
  Search,
  Flame,
  Sun,
  Moon,
  Sparkles,
  Loader2
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    activeQuery,
    handleAskQuestion,
    isLoading,
    isDarkMode,
    toggleDarkMode,
    stats
  } = useApp();

  const [headerSearchInput, setHeaderSearchInput] = useState('');

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerSearchInput.trim() || isLoading) return;
    handleAskQuestion(headerSearchInput.trim());
    setHeaderSearchInput('');
  };

  return (
    <header
      id="app-top-header"
      className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-30"
    >
      {/* Mobile Toggle & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live Search Input */}
        <form onSubmit={handleHeaderSearchSubmit} className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <Search className="w-4 h-4" />}
          </span>
          <input
            type="text"
            value={headerSearchInput}
            onChange={e => setHeaderSearchInput(e.target.value)}
            placeholder="Ask anything about biology, algorithms, physics, law..."
            className="w-full bg-slate-100 dark:bg-slate-800/80 border-none rounded-full py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Language Selector */}
        <div className="hidden sm:block">
          <LanguageSelector />
        </div>

        {/* Education Level Selector */}
        <div className="hidden md:block">
          <LevelSelector />
        </div>

        {/* Study Streak Pill */}
        <div
          title={`${stats.studyStreakDays} Day Streak!`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-xs select-none"
        >
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
          <span className="hidden xs:inline">{stats.studyStreakDays}d</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Avatar Circle */}
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shadow-xs select-none">
          EV
        </div>
      </div>
    </header>
  );
};
