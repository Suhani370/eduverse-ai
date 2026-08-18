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
  Sparkles,
  Send,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

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

  const handleFooterAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const question = footerAskInput.trim();

    if (!question || isLoading) {
      return;
    }

    handleAskQuestion(question);
    setFooterAskInput('');
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden select-none">

      {/* Left Navigation Sidebar */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <Navbar
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Main + Companion Area */}
        <div className="flex-1 flex overflow-hidden min-w-0">

          {/* Main View */}
          <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto min-w-0 select-text">

            {/* Landing Page */}
            {currentView === 'landing' && (
              <LandingPage />
            )}

            {/* Dashboard */}
            {currentView === 'dashboard' && (
              <DashboardView />
            )}

            {/* Notes Studio */}
            {currentView === 'notes' && (
              <NotesStudio />
            )}

            {/* Quiz Arena */}
            {currentView === 'quiz' && (
              <QuizArena />
            )}

            {/* Document Learning */}
            {currentView === 'document' && (
              <DocumentLearning />
            )}

            {/* Code Lab */}
            {currentView === 'code' && (
              <div className="space-y-6 max-w-5xl mx-auto">

                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-2xl font-extrabold tracking-tight">
                    Interactive Code & Algorithm Lab
                  </h2>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Explore algorithmic blueprints with line-by-line logic
                    and safe server-side execution.
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

            {/* Learn View */}
            {currentView === 'learn' && (
              <div className="space-y-6 max-w-5xl mx-auto">

                {/* Ask Bar */}
                <div className="sticky top-0 z-10 pt-1 pb-2 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm">
                  <AskAnythingBar compact />
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="w-full max-w-md mx-auto py-16 text-center space-y-4">

                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-md animate-bounce">
                      <Sparkles className="w-7 h-7 animate-spin" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Synthesizing Educational Blueprint...
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Structuring real-world analogies, step-by-step
                        visualizations, and exam insights.
                      </p>
                    </div>

                  </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                  <div className="w-full max-w-xl mx-auto p-5 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200 text-xs space-y-3">

                    <div className="flex items-center gap-2 font-bold">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span>Unable to complete request</span>
                    </div>

                    <p>{error}</p>

                    <button
                      type="button"
                      onClick={() => handleAskQuestion(activeQuery)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-[11px] shadow-sm cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Try Again</span>
                    </button>

                  </div>
                )}

                {/* Structured AI Response */}
                {!isLoading && activeResponse && (
                  <StructuredResponseView
                    data={activeResponse}
                  />
                )}

              </div>
            )}

          </main>

          {/* Right Learning Companion */}
          <CompanionSidebar />

        </div>

        {/* Footer Ask Bar */}
        <footer className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">

          <form
            onSubmit={handleFooterAskSubmit}
            className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all"
          >

            <input
              type="text"
              value={footerAskInput}
              onChange={(e) => setFooterAskInput(e.target.value)}
              placeholder="Ask a follow-up or explore a new concept..."
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none py-1.5"
            />

            <button
              type="submit"
              disabled={isLoading || !footerAskInput.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>

          </form>

        </footer>

      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}