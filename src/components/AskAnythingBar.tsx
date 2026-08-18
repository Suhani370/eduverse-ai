import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { RESPONSE_MODES, SUGGESTED_PROMPTS } from '../data/constants';
import { ResponseMode } from '../types';
import {
  Search,
  Sparkles,
  ArrowRight,
  Mic,
  MicOff,
  Paperclip,
  Loader2,
  FileText,
  HelpCircle,
  Code,
  Network,
  Columns,
  Zap,
  CornerDownLeft
} from 'lucide-react';

interface AskAnythingBarProps {
  compact?: boolean;
}

export const AskAnythingBar: React.FC<AskAnythingBarProps> = ({ compact = false }) => {
  const {
    activeQuery,
    setActiveQuery,
    handleAskQuestion,
    isLoading,
    responseMode,
    setResponseMode,
    setCurrentView
  } = useApp();

  const [inputVal, setInputVal] = useState(activeQuery);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setInputVal(activeQuery);
  }, [activeQuery]);

  // Voice speech-to-text recognition setup
  const toggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please type your question.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const onSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    handleAskQuestion(inputVal.trim());
  };

  const handlePromptClick = (prompt: string) => {
    setInputVal(prompt);
    handleAskQuestion(prompt);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${compact ? '' : 'my-4 sm:my-6'}`} id="ask-anything-container">
      {/* Response Mode Selector Pills */}
      {!compact && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2.5 no-scrollbar scroll-smooth">
          {RESPONSE_MODES.map(mode => {
            const isSelected = responseMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setResponseMode(mode.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25 ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title={mode.description}
              >
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Search / Ask Input Card */}
      <form
        onSubmit={onSubmit}
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-xl shadow-indigo-500/5 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="pl-2 sm:pl-3 text-slate-400 dark:text-slate-500 shrink-0">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 text-indigo-500" />
            )}
          </div>

          <input
            id="ask-input-field"
            type="text"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Ask anything: 'Explain Photosynthesis', 'TCP vs UDP', 'Binary search in C++', 'Make notes'..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden py-1.5"
            disabled={isLoading}
          />

          {/* Quick Actions inside Input Bar */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pr-1">
            {/* Document Upload Shortcut */}
            <button
              type="button"
              onClick={() => setCurrentView('document')}
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              title="Upload Document / PDF for analysis"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Voice Input Mic */}
            <button
              type="button"
              onClick={toggleVoice}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Voice Input (Ask with speech)'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Submit Button */}
            <button
              id="ask-submit-btn"
              type="submit"
              disabled={isLoading || !inputVal.trim()}
              className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Generate Explanation"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Prompt Chips */}
      {!compact && (
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
            Try:
          </span>
          {SUGGESTED_PROMPTS.slice(0, 5).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptClick(prompt)}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200/50 dark:border-slate-700/50 transition-all cursor-pointer"
            >
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
