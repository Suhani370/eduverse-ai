import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { QuizQuestion, QuizResult } from '../types';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

export const QuizArena: React.FC = () => {
  const {
    activeQuiz,
    startQuizForTopic,
    recordQuizResult,
    handleAskQuestion,
    educationLevel,
    language,
    isLoading
  } = useApp();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [quizTopicInput, setQuizTopicInput] = useState('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const questions = activeQuiz?.questions || [];
  const currentQ: QuizQuestion | undefined = questions[currentIdx];

  // Timer
  useEffect(() => {
    let timer: any;
    if (!isSubmitted && questions.length > 0) {
      timer = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSubmitted, questions.length]);

  const handleSelectOption = (optionIdx: number) => {
    if (isSubmitted || !currentQ) return;
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setShowHint(false);
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (questions.length === 0) return;

    let score = 0;
    const weakTopics: string[] = [];

    questions.forEach(q => {
      const selected = userAnswers[q.id];
      if (selected === q.correctAnswer) {
        score += 1;
      } else if (q.topicTag) {
        weakTopics.push(q.topicTag);
      }
    });

    const percentage = Math.round((score / questions.length) * 100);

    // Trigger celebratory confetti if passed well
    if (percentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const result: QuizResult = {
      score,
      total: questions.length,
      percentage,
      userAnswers,
      weakTopics: Array.from(new Set(weakTopics)),
      revisionRecommendations: weakTopics.map(t => `Review underlying principles of ${t}`),
      completedAt: new Date().toISOString()
    };

    recordQuizResult(result);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setUserAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
    setSecondsElapsed(0);
    setShowHint(false);
  };

  const handleNewQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopicInput.trim()) return;
    startQuizForTopic(quizTopicInput.trim(), questionCount, difficulty);
    setQuizTopicInput('');
    setIsSubmitted(false);
    setUserAnswers({});
    setCurrentIdx(0);
  };

  // If no quiz is loaded, show clean launchpad
  if (!activeQuiz || questions.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 px-4" id="quiz-empty-launchpad">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 text-center shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <BrainCircuit className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            EduVerse Smart Quiz Arena
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 mb-6">
            Test your understanding with conceptual questions, real-world application scenarios, and step-by-step diagnostic feedback.
          </p>

          <form onSubmit={handleNewQuizSubmit} className="max-w-md mx-auto space-y-4">
            <input
              type="text"
              value={quizTopicInput}
              onChange={e => setQuizTopicInput(e.target.value)}
              placeholder="Enter any topic: 'Photosynthesis', 'TCP vs UDP', 'Binary Search'..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />

            {/* Question count & difficulty selector */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Questions
                </label>
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                  {[3, 5, 10].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        questionCount === cnt
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {cnt} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">
                  Difficulty
                </label>
                <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                  {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        difficulty === diff
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !quizTopicInput.trim()}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
            >
              {isLoading ? 'Generating Smart Quiz...' : `Generate ${questionCount} Questions (${difficulty})`}
            </button>
          </form>

          {/* Quick topic pills */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['Photosynthesis', 'TCP vs UDP', 'Binary Search', 'Newton’s Laws', 'DBMS Normalization'].map(topic => (
              <button
                key={topic}
                type="button"
                onClick={() => startQuizForTopic(topic, questionCount, difficulty)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                Quiz on {topic}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Results View
  if (isSubmitted) {
    let score = 0;
    const weakTopics: string[] = [];
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) score++;
      else if (q.topicTag) weakTopics.push(q.topicTag);
    });
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 pb-12" id="quiz-results-container">
        {/* Score Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quiz Completed</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {activeQuiz.topic}
          </h2>

          <div className="my-6 inline-flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {score} / {questions.length}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Final Score</div>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className={`text-3xl sm:text-4xl font-extrabold ${percentage >= 70 ? 'text-emerald-600' : 'text-amber-500'}`}>
                {percentage}%
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mastery Level</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            {weakTopics.length > 0 && (
              <button
                type="button"
                onClick={() => handleAskQuestion(`Explain and clarify weak concepts in ${activeQuiz.topic}: ${weakTopics.join(', ')}`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Review Weak Topics with AI</span>
              </button>
            )}
          </div>
        </div>

        {/* Detailed Question Explanations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 pl-2">
            Detailed Diagnostic Breakdown
          </h3>

          {questions.map((q, idx) => {
            const userSelected = userAnswers[q.id];
            const isCorrect = userSelected === q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border p-5 sm:p-6 shadow-sm ${
                  isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/50'
                    : 'border-rose-200 dark:border-rose-900/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Q{idx + 1}.</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{q.question}</span>
                  </div>
                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full shrink-0">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>

                {/* Options Review */}
                {q.options && (
                  <div className="space-y-1.5 mb-4">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = userSelected === optIdx;
                      const isCorrectChoice = Number(q.correctAnswer) === optIdx;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                            isCorrectChoice
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 font-semibold'
                              : isUserChoice
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800 line-through'
                              : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrectChoice && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanation */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Explanation:</span>
                  </div>
                  <p>{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Question Taker View
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 pb-12" id="quiz-question-taker">
      {/* Header bar with Topic and Timer */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            Interactive Quiz
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            {activeQuiz.topic}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>
              {Math.floor(secondsElapsed / 60)}:{(secondsElapsed % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <span className="text-xs font-bold text-slate-400">
            {currentIdx + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
            Question {currentIdx + 1}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options?.map((opt, optIdx) => {
              const isSelected = userAnswers[currentQ.id] === optIdx;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm font-medium border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-200 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hint Accordion */}
          {currentQ.hint && (
            <div className="mt-5">
              {showHint ? (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Hint:</strong> {currentQ.hint}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowHint(true)}
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Need a hint?</span>
                </button>
              )}
            </div>
          )}

          {/* Bottom Nav Stepper */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>

            {currentIdx === questions.length - 1 ? (
              <button
                type="button"
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
              >
                Submit & Check Answers
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
