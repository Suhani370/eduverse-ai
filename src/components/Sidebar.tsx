import React from 'react';
import { useApp, ViewType } from '../context/AppContext';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  HelpCircle,
  Code,
  FileSearch,
  Compass,
  FileText,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView } = useApp();

  const navItems: { id: ViewType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Ask Anything', icon: Sparkles },
    { id: 'notes', label: 'Study Notes', icon: FileText },
    { id: 'quiz', label: 'Quiz Arena', icon: HelpCircle },
    { id: 'code', label: 'Code Lab', icon: Code },
    { id: 'document', label: 'Doc Intelligence', icon: FileSearch },
    { id: 'landing', label: 'Explore Showcase', icon: Compass },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        id="app-sidebar"
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div
            onClick={() => {
              setCurrentView('landing');
              if (onCloseMobile) onCloseMobile();
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md group-hover:bg-indigo-700 transition-colors">
              E
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">
                EduVerse AI
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Learning Engine
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentView(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Pro Card & Status at Bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white text-sm shadow-md">
            <p className="font-bold text-xs uppercase tracking-wider text-indigo-400 mb-1">
              EduVerse Pro Engine
            </p>
            <p className="text-slate-400 text-xs mb-3 leading-relaxed">
              Unlock unlimited interactive visualizations and syllabus intelligence.
            </p>
            <button
              type="button"
              onClick={() => {
                setCurrentView('learn');
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Start Learning Free
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
