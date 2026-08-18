import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  HelpCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const CompanionSidebar: React.FC = () => {
  const {
    activeResponse,
    generateNotesForActiveTopic,
    startQuizForTopic,
    handleAskQuestion,
    recentSearches,
    stats,
    educationLevel
  } = useApp();

  const activeTopic = activeResponse?.query || 'Photosynthesis';

  const recentSubjects = [
    { title: 'Binary Search in C++', level: 'College • DSA', icon: 'C+', bg: 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60' },
    { title: 'Photosynthesis', level: 'Biology • Grade 9', icon: '🌱', bg: 'bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/60' },
    { title: 'TCP vs UDP Protocols', level: 'Networking • B.Tech', icon: '📦', bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60' },
    { title: 'Nephron Filtration', level: 'NEET • Physiology', icon: '🩺', bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60' }
  ];

  return (
    <aside
      id="learning-companion-sidebar"
      className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 space-y-7 flex-shrink-0 overflow-y-auto hidden xl:block"
    >
      {/* Companion Actions */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Learning Companion
        </h4>
        <div className="space-y-3">
          <button
            type="button"
            onClick={generateNotesForActiveTopic}
            className="w-full flex items-center justify-between p-3.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 rounded-2xl text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Generate Summary Notes</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => startQuizForTopic(activeTopic)}
            className="w-full flex items-center justify-between p-3.5 bg-orange-50 dark:bg-orange-950/60 border border-orange-100 dark:border-orange-800/80 rounded-2xl text-xs font-bold text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Start Quick Quiz</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Personalized Goals */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Personalized Goals
        </h4>
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Daily Goal: Mastery
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              75%
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[75%] rounded-full transition-all duration-500" />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 italic leading-relaxed">
            "You are 2 high-yield concepts away from completing today's target!"
          </p>
        </div>
      </div>

      {/* Recent Subjects */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Recent Subjects
        </h4>
        <div className="space-y-3">
          {recentSearches.slice(0, 4).map((query, idx) => {
            const fallbackSubject = recentSubjects[idx % recentSubjects.length];
            return (
              <div
                key={idx}
                onClick={() => handleAskQuestion(query)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${fallbackSubject.bg}`}>
                  {fallbackSubject.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {query}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {educationLevel.replace('_', ' ')} • Recent
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
