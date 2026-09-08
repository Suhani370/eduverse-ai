import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';

import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { CompanionSidebar } from './components/CompanionSidebar';

import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { AskAnythingBar } from './components/AskAnythingBar';
import StructuredResponseView from './components/StructuredResponseView';
import { QuizArena } from './components/QuizArena';
import { NotesStudio } from './components/NotesStudio';
import { DocumentLearning } from './components/DocumentLearning';
import { CodeLab } from './components/CodeLab';

import { DEMO_RESPONSES } from './data/demoTopics';

import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Lightbulb,
  Loader2,
  MessageCircle,
  PlayCircle,
  RotateCcw,
  Send,
  Sparkles,
  Target,
  X,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                               Empty Learning                               */
/* -------------------------------------------------------------------------- */

const EmptyLearningState: React.FC<{
  onAsk: (question: string) => void;
}> = ({ onAsk }) => {
  const examples = [
    'Explain photosynthesis with a real-world example',
    'Explain binary search step by step with visualization',
    'Explain TCP vs UDP with a practical example',
    'Explain recursion using a simple analogy',
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center shadow-sm">
          <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Learn anything, visually.
        </h1>

        <p className="mt-3 text-sm sm:text-base leading-6 text-slate-500 dark:text-slate-400">
          Ask a concept and EduVerse will break it into simple theory,
          real-world examples, step-by-step reasoning, visual explanations,
          and practice questions.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <LearningFeature
          icon={<BookOpen className="w-4 h-4" />}
          title="Simple Theory"
          description="Understand the concept first."
        />

        <LearningFeature
          icon={<Lightbulb className="w-4 h-4" />}
          title="Real Examples"
          description="Connect it with real life."
        />

        <LearningFeature
          icon={<PlayCircle className="w-4 h-4" />}
          title="Visual Learning"
          description="Follow the concept step by step."
        />

        <LearningFeature
          icon={<Target className="w-4 h-4" />}
          title="Practice"
          description="Test your understanding."
        />
      </div>

      <div className="mt-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-3">
          Try one of these
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => onAsk(example)}
              className="group text-left p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-5">
                    {example}
                  </p>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const LearningFeature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
        {icon}
      </div>

      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Loading Screen                                */
/* -------------------------------------------------------------------------- */

const LearningLoadingState: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 sm:py-16">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Building your learning explanation...
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Preparing theory, examples, steps, visual explanation and
              practice.
            </p>
          </div>
        </div>

        <div className="mt-7 space-y-3">
          <LoadingRow text="Understanding the question" />
          <LoadingRow text="Structuring the concept" />
          <LoadingRow text="Preparing examples and explanation" />
          <LoadingRow text="Preparing visual learning flow" />
        </div>
      </div>
    </div>
  );
};

const LoadingRow: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
      <CheckCircle2 className="w-4 h-4 text-indigo-500" />
      <span>{text}</span>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Error State                                  */
/* -------------------------------------------------------------------------- */

const LearningErrorState: React.FC<{
  error: string;
  activeQuery: string;
  onRetry: () => void;
}> = ({ error, activeQuery, onRetry }) => {
  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="rounded-3xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 p-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-rose-950/50 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>

          <div className="flex-1">
            <h2 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              We couldn't generate the explanation
            </h2>

            <p className="mt-2 text-xs leading-5 text-rose-700 dark:text-rose-300">
              {error}
            </p>

            {activeQuery && (
              <div className="mt-3 p-3 rounded-xl bg-white/70 dark:bg-black/10 text-xs text-rose-800 dark:text-rose-200">
                <span className="font-semibold">Question:</span>{' '}
                {activeQuery}
              </div>
            )}

            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Main Layout                                   */
/* -------------------------------------------------------------------------- */

const MainLayout: React.FC = () => {
  const {
    currentView,
    activeResponse,
    isLoading,
    error,
    activeQuery,
    handleAskQuestion,
  } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [footerAskInput, setFooterAskInput] = useState('');

  const handleAsk = (question: string) => {
    const cleanedQuestion = question.trim();

    if (!cleanedQuestion || isLoading) {
      return;
    }

    handleAskQuestion(cleanedQuestion);
  };

  const handleFooterAskSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const question = footerAskInput.trim();

    if (!question || isLoading) {
      return;
    }

    handleAsk(question);
    setFooterAskInput('');
  };

  const handleRetry = () => {
    if (!activeQuery || isLoading) {
      return;
    }

    handleAskQuestion(activeQuery);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* ------------------------------------------------------------------ */}
      {/* Sidebar                                                            */}
      {/* ------------------------------------------------------------------ */}

      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Main Application                                                   */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* -------------------------------------------------------------- */}
          {/* Main Content                                                    */}
          {/* -------------------------------------------------------------- */}

          <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="min-h-full p-4 sm:p-6 lg:p-7">
              {/* ---------------------------------------------------------- */}
              {/* Landing                                                     */}
              {/* ---------------------------------------------------------- */}

              {currentView === 'landing' && <LandingPage />}

              {/* ---------------------------------------------------------- */}
              {/* Dashboard                                                   */}
              {/* ---------------------------------------------------------- */}

              {currentView === 'dashboard' && <DashboardView />}

              {/* ---------------------------------------------------------- */}
              {/* Notes                                                       */}
              {/* ---------------------------------------------------------- */}

              {currentView === 'notes' && <NotesStudio />}

              {/* ---------------------------------------------------------- */}
              {/* Quiz                                                        */}
              {/* ---------------------------------------------------------- */}

              {currentView === 'quiz' && <QuizArena />}

              {/* ---------------------------------------------------------- */}
              {/* Documents                                                   */}
              {/* ---------------------------------------------------------- */}

              {currentView === 'document' && <DocumentLearning />}

              {/* ---------------------------------------------------------- */}
              {/* Code Lab                                                    */}
              {/* ---------------------------------------------------------- */}

              {currentView === 'code' && (
                <div className="max-w-5xl mx-auto space-y-6">
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      Interactive Learning
                    </div>

                    <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Interactive Code & Algorithm Lab
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-5">
                      Understand algorithms through structured logic,
                      examples and step-by-step execution.
                    </p>
                  </div>

                  <AskAnythingBar />

                  {activeResponse?.codeBlock ? (
                    <CodeLab data={activeResponse.codeBlock} />
                  ) : (
                    <CodeLab
                      data={DEMO_RESPONSES['binary-search'].codeBlock!}
                    />
                  )}
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* Learn / AI Explanation                                     */}
              {/* ---------------------------------------------------------- */}

              {currentView === 'learn' && (
                <div className="max-w-6xl mx-auto">
                  {/* Ask bar */}

                  <div className="sticky top-0 z-20 -mx-1 px-1 pt-1 pb-3 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md">
                    <AskAnythingBar compact />
                  </div>

                  {/* Loading */}

                  {isLoading && <LearningLoadingState />}

                  {/* Error */}

                  {!isLoading && error && (
                    <LearningErrorState
                      error={error}
                      activeQuery={activeQuery}
                      onRetry={handleRetry}
                    />
                  )}

                  {/* Response */}

                  {!isLoading && !error && activeResponse && (
                    <div className="space-y-6">
                      {/* Learning response header */}

                      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-500 dark:text-indigo-400">
                              AI Learning Blueprint
                            </p>

                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {activeQuery || 'Your learning explanation'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <StructuredResponseView data={activeResponse} />
                    </div>
                  )}

                  {/* Empty state */}

                  {!isLoading && !error && !activeResponse && (
                    <EmptyLearningState onAsk={handleAsk} />
                  )}
                </div>
              )}
            </div>
          </main>

          {/* -------------------------------------------------------------- */}
          {/* Learning Companion                                             */}
          {/* -------------------------------------------------------------- */}

          <aside className="hidden xl:block w-[330px] shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 overflow-y-auto">
            <CompanionSidebar />
          </aside>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Global Ask Footer                                                */}
        {/* ---------------------------------------------------------------- */}

        <footer className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4">
          <form
            onSubmit={handleFooterAskSubmit}
            className="mx-auto flex max-w-4xl items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 transition-all focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white dark:focus-within:bg-slate-900"
          >
            <MessageCircle className="hidden sm:block w-4 h-4 text-slate-400 shrink-0" />

            <input
              type="text"
              value={footerAskInput}
              onChange={(e) => setFooterAskInput(e.target.value)}
              disabled={isLoading}
              placeholder="Ask a follow-up or explore a new concept..."
              aria-label="Ask a follow-up question"
              className="min-w-0 flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 disabled:opacity-50 py-2"
            />

            {footerAskInput && !isLoading && (
              <button
                type="button"
                onClick={() => setFooterAskInput('')}
                aria-label="Clear question"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading || !footerAskInput.trim()}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
            >
              <span className="hidden sm:inline">Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                    App                                     */
/* -------------------------------------------------------------------------- */

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}