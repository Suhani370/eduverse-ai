import React from 'react';
import { useApp } from '../context/AppContext';
import { AskAnythingBar } from './AskAnythingBar';
import { EDUCATION_LEVELS, FEATURE_TAGS } from '../data/constants';
import { DEMO_RESPONSES } from '../data/demoTopics';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  HelpCircle,
  Code,
  Globe,
  FileText,
  ShieldCheck,
  CheckCircle2,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, handleAskQuestion, setEducationLevel } = useApp();

  const showcaseTopics = [
    {
      id: 'photosynthesis',
      title: 'Photosynthesis with Interactive Flow',
      level: 'Biology & Environmental Science',
      badge: 'Visual Diagram',
      icon: '🌱',
      query: 'Explain photosynthesis with a visual flow'
    },
    {
      id: 'tcp-vs-udp',
      title: 'TCP vs UDP with Courier Analogy',
      level: 'Computer Networking',
      badge: 'Deep Comparison',
      icon: '📦',
      query: 'TCP vs UDP with real-world courier analogy'
    },
    {
      id: 'binary-search',
      title: 'Binary Search with Live C++ Runner',
      level: 'Data Structures & Algorithms',
      badge: 'Code Lab Sandbox',
      icon: '⚡',
      query: 'C++ code for Binary Search with line-by-line breakdown'
    },
    {
      id: 'nephron',
      title: 'Nephron Filtration Mechanism',
      level: 'Human Physiology & NEET',
      badge: 'Medical Science',
      icon: '🩺',
      query: 'Explain Nephron structure and filtration mechanism'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12 sm:space-y-16 pb-16" id="landing-page">
      
      {/* Hero Section */}
      <section className="text-center pt-6 sm:pt-10 max-w-4xl mx-auto px-4">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-xs mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Personalized AI Learning Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          Learn Anything.{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Understand Everything.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mt-4 sm:mt-5 leading-relaxed font-normal">
          Personalized explanations adapted to your age, degree, and language. Structured with real-world analogies, interactive flowcharts, live code execution, and high-yield exam notes.
        </p>

        {/* Hero Ask Input Bar */}
        <div className="mt-8">
          <AskAnythingBar />
        </div>
      </section>

      {/* Interactive Showcase Preview Grid */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Explore Live Conceptual Blueprints
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any topic to experience full structured learning in action.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {showcaseTopics.map((topic, idx) => (
            <div
              key={idx}
              onClick={() => handleAskQuestion(topic.query)}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {topic.badge}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {topic.level}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                <span>View Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Target Learners Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 mx-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            For Every Learner
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Adapts vocabulary, depth, and examples to your level
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {EDUCATION_LEVELS.map(lvl => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => {
                setEducationLevel(lvl.id);
                setCurrentView('learn');
              }}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 text-left hover:border-indigo-500 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="text-2xl mb-1">{lvl.emoji}</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                {lvl.label}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {lvl.tag}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Core Educational Pillars */}
      <section className="px-4">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Why EduVerse AI
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Structured for Real Understanding, Not Generic Chat
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Visual Diagrams & Steppers
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Never get stuck in text walls. Inspect process flows, interactive node breakdowns, and animated step-by-step progressions.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Diagnostics & Quiz Arena
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Test your understanding immediately. Identify weak topics and review personalized remedial explanations with one click.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              12+ Authentic Native Languages
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Learn comfortably in Hindi, Hinglish, Tamil, Telugu, Bengali, Gujarati, Marathi, Punjabi, and global languages with authentic scripts.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="text-center bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white mx-4 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to master your next subject?</h2>
        <p className="text-xs sm:text-sm text-indigo-200/80 max-w-md mx-auto mt-2 mb-6">
          Experience personalized, structured understanding across any academic or professional discipline.
        </p>
        <button
          type="button"
          onClick={() => setCurrentView('learn')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-indigo-950 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition-all cursor-pointer"
        >
          <span>Start Learning Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
