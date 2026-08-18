import React from 'react';
import { useApp } from '../context/AppContext';
import { EDUCATION_LEVELS, FEATURE_TAGS } from '../data/constants';
import {
  LayoutDashboard,
  Flame,
  CheckCircle2,
  BookOpen,
  Award,
  ArrowRight,
  Sparkles,
  GraduationCap,
  History,
  Trash2,
  BrainCircuit,
  Columns,
  Code,
  FileText
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    stats,
    educationLevel,
    setEducationLevel,
    handleAskQuestion,
    recentSearches,
    clearHistory,
    savedNotes,
    setCurrentView,
    startQuizForTopic
  } = useApp();

  const currentLevelObj = EDUCATION_LEVELS.find(l => l.id === educationLevel) || EDUCATION_LEVELS[3];

  const recommendedTracks = [
    {
      title: 'Operating Systems & Networking',
      query: 'TCP vs UDP with real-world courier analogy',
      level: 'B.Tech / Engineering',
      icon: '💻',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/30'
    },
    {
      title: 'Human Physiology & Renal System',
      query: 'Explain Nephron structure and filtration mechanism',
      level: 'Medical / NEET',
      icon: '🩺',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30'
    },
    {
      title: 'Data Structures & Algorithms',
      query: 'C++ code for Binary Search with line-by-line breakdown',
      level: 'Computer Science',
      icon: '⚡',
      color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30'
    },
    {
      title: 'Plant Biology & Energy Cycles',
      query: 'Explain photosynthesis with a visual flow',
      level: 'High School & College',
      icon: '🌱',
      color: 'from-green-500/10 to-emerald-500/10 border-green-500/30'
    },
    {
      title: 'Classical Mechanics & Motion',
      query: 'Explain Newton’s Laws of Motion with real world vehicle examples',
      level: 'Physics & Applied Science',
      icon: '🚀',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/30'
    },
    {
      title: 'Constitutional Law & Rights',
      query: 'Explain Fundamental Rights vs Directive Principles with landmark case laws',
      level: 'Law & UPSC',
      icon: '⚖️',
      color: 'from-purple-500/10 to-indigo-500/10 border-purple-500/30'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-12" id="learner-dashboard">
      
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl border border-indigo-800/60 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduVerse Adaptive Learning Space</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back to your Study Cockpit
          </h1>
          <p className="text-sm text-indigo-200/80 mt-2 leading-relaxed">
            Currently tailored for <strong className="text-white">{currentLevelObj.label}</strong>. Ask any concept, test with diagnostic quizzes, or inspect step-by-step visualizations.
          </p>
        </div>

        {/* Decorative circle */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Streak */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.studyStreakDays} <span className="text-xs font-semibold text-slate-400">Days</span>
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Study Streak
            </div>
          </div>
        </div>

        {/* Metric 2: Topics Learned */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.topicsLearnedCount}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Topics Explored
            </div>
          </div>
        </div>

        {/* Metric 3: Quiz Score */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.averageQuizScore}%
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Quiz Average
            </div>
          </div>
        </div>

        {/* Metric 4: Saved Notes */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {savedNotes.length}
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Saved Study Notes
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recommended Pathways */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Recommended High-Yield Pathways
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Click to learn instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {recommendedTracks.map((track, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAskQuestion(track.query)}
                  className={`p-4 rounded-2xl border bg-gradient-to-br ${track.color} hover:border-indigo-500 transition-all cursor-pointer group flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="text-lg">{track.icon}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
                        {track.level}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {track.query}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Start Learning</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Studio Launchers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('quiz')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all group cursor-pointer shadow-xs"
            >
              <BrainCircuit className="w-5 h-5 text-indigo-600 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                Launch Quiz Arena
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Test diagnostic mastery</div>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('notes')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all group cursor-pointer shadow-xs"
            >
              <FileText className="w-5 h-5 text-emerald-600 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                Notes Studio
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Generate exam sheets</div>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('document')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left transition-all group cursor-pointer shadow-xs"
            >
              <Sparkles className="w-5 h-5 text-cyan-600 mb-2" />
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-600">
                Doc Intelligence
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Analyze syllabus / PDF</div>
            </button>
          </div>
        </div>

        {/* Right Column: Search History & Level Settings */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recent History Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Topics
                </h3>
              </div>
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {recentSearches.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No recent searches yet.
              </div>
            ) : (
              <div className="space-y-2">
                {recentSearches.slice(0, 6).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskQuestion(item)}
                    className="w-full text-left p-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all truncate block cursor-pointer"
                  >
                    • {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Learner Level Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>Target Learner Persona</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-2xl">{currentLevelObj.emoji}</span>
                <div>
                  <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                    {currentLevelObj.label}
                  </div>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    {currentLevelObj.tag}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentLevelObj.description}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
