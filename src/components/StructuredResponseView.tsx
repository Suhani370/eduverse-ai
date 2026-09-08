import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { StructuredEducationalResponse } from '../types';
import { VisualizationEngine } from './VisualizationEngine';
import { CodeLab } from './CodeLab';
import { ComparisonView } from './ComparisonView';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HelpCircle,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Share2,
  GraduationCap,
  BrainCircuit,
  MessageSquare,
  Flame,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Play,
  Square,
  Box,
  Terminal,
  Cpu,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  XCircle
} from 'lucide-react';

interface StructuredResponseViewProps {
  data: StructuredEducationalResponse;
}

export const StructuredResponseView: React.FC<StructuredResponseViewProps> = ({ data }) => {
  const {
    saveNote,
    startQuizForTopic,
    handleAskQuestion,
    educationLevel,
    language
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [showFullDetailed, setShowFullDetailed] = useState(true);

  // Inline Dry-Run state
  const [activeDryRunStep, setActiveDryRunStep] = useState(0);
  const [isDryRunPlaying, setIsDryRunPlaying] = useState(false);

  // Inline Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});

  const handleCopyExplanation = () => {
    const textToCopy = `# ${data.query}\n\n## Quick Answer\n${data.quickAnswer}\n\n## Simple Explanation\n${data.simpleExplanation}\n\n## Detailed Explanation\n${data.detailedExplanation}\n\n## Key Takeaways\n${data.keyPoints?.map(p => `- ${p}`).join('\n') || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToNotes = () => {
    saveNote({
      id: 'note-' + Date.now(),
      topic: data.detectedTopic || data.query,
      subject: data.detectedSubject || 'Academic & Applied Sciences',
      educationLevel: data.educationLevel || educationLevel,
      language: data.language || language,
      createdAt: new Date().toISOString(),
      tags: [data.detectedTopic || data.query, data.educationLevel || educationLevel, 'High-Yield'],
      summary: data.quickAnswer,
      contentMarkdown: `# ${data.detectedTopic || data.query}\n\n## Executive Summary\n${data.quickAnswer}\n\n## Intuitive Explanation\n${data.simpleExplanation}\n\n## Conceptual Deep-Dive\n${data.detailedExplanation}`,
      keyPoints: data.keyPoints || [],
      examTips: data.examTips || []
    });
    alert('Saved to Study Notes Studio!');
  };

  const toggleCardFlip = (idx: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
    setRevealedExplanations(prev => ({
      ...prev,
      [qIdx]: true
    }));
  };

  // Dry run player effect
  const dryRunSteps = data.dryRun || [];
  React.useEffect(() => {
    let timer: any;
    if (isDryRunPlaying && dryRunSteps.length > 0) {
      timer = setInterval(() => {
        setActiveDryRunStep(prev => {
          if (prev >= dryRunSteps.length - 1) {
            setIsDryRunPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isDryRunPlaying, dryRunSteps.length]);

  return (
    <div className="w-full space-y-6 pb-8 animate-in fade-in duration-300" id="structured-response-container">
      {/* Medical Disclaimer if health/biological */}
      {data.medicalDisclaimer && <MedicalDisclaimerBanner />}

      {/* Intelligence & Topic Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          {data.detectedSubject && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              {data.detectedSubject}
            </span>
          )}
          {data.detectedIntent && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 capitalize">
              Intent: {data.detectedIntent.replace('_', ' ')}
            </span>
          )}
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40">
            Language: {data.language}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40 capitalize">
            Level: {data.educationLevel?.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyExplanation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            title="Copy Full Explanation"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToNotes}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="Save into Notes Studio"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save Note</span>
          </button>
        </div>
      </div>

      {/* 1. Quick Answer & Key Definition Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-indigo-800/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Core Conceptual Takeaway</span>
            </div>
            {data.detectedTopic && (
              <span className="text-xs text-indigo-200/80 font-medium">
                Topic: {data.detectedTopic}
              </span>
            )}
          </div>

          <p className="text-base sm:text-lg font-semibold leading-relaxed text-indigo-50">
            {data.quickAnswer}
          </p>
        </div>
      </section>

      {/* 2. Executive Summary Card if Intent is Summary or summaryPayload exists */}
      {data.summaryPayload && (
        <section className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 rounded-3xl border border-amber-300/70 dark:border-amber-900/60 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-amber-200">
              Executive AI Summary & Key Takeaways
            </h3>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-amber-950 dark:text-amber-100 text-sm font-semibold mb-4 leading-relaxed">
            {data.summaryPayload.oneLine}
          </div>

          {data.summaryPayload.bulletPoints && data.summaryPayload.bulletPoints.length > 0 && (
            <div className="space-y-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                High-Yield Points
              </span>
              <ul className="space-y-2">
                {data.summaryPayload.bulletPoints.map((bp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.summaryPayload.detailedSummary && (
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 leading-relaxed">
              {data.summaryPayload.detailedSummary}
            </p>
          )}
        </section>
      )}

      {/* 3. Intuitive Breakdown & Real-World Analogy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Simple Beginner Explanation */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Intuitive Explanation
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {data.simpleExplanation}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Adapted for {data.educationLevel?.replace('_', ' ') || 'Learner'}</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{data.language || 'English'}</span>
          </div>
        </section>

        {/* Real-World Analogy */}
        {data.realWorldAnalogy && (
          <section className="bg-gradient-to-br from-indigo-50/50 via-slate-50 to-transparent dark:from-indigo-950/20 dark:via-slate-900 dark:to-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2 text-indigo-600 dark:text-indigo-400">
                <Lightbulb className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Real-World Mental Model
                </h3>
              </div>

              <div className="text-xs sm:text-sm font-bold text-indigo-950 dark:text-indigo-200 mb-2">
                "{data.realWorldAnalogy.analogy}"
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {data.realWorldAnalogy.explanation}
              </p>
            </div>

            {data.realWorldAnalogy.targetContext && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300">Context:</span>
                <span>{data.realWorldAnalogy.targetContext}</span>
              </div>
            )}
          </section>
        )}
      </div>

      {/* 4. Interactive 2D & 3D Visualization Engine */}
      {(data.visualization || data.threeDData) && (
        <section className="w-full">
          <VisualizationEngine
            data={data.visualization || {
              type: 'flowchart',
              title: data.query,
              description: data.quickAnswer,
              nodes: [
                { id: '1', label: 'Start', sublabel: 'Initial State', icon: 'CircleDot', details: 'Initial precondition' },
                { id: '2', label: data.detectedTopic || 'Core Mechanism', sublabel: 'Execution', icon: 'Cpu', details: data.quickAnswer },
                { id: '3', label: 'Completion', sublabel: 'Outcome', icon: 'Check', details: 'Final verified result' }
              ],
              steps: [
                { stepNumber: 1, title: 'Step 1: Initialization', description: 'Setting up preconditions', activeNodeIds: ['1'] },
                { stepNumber: 2, title: 'Step 2: Core Execution', description: 'Running main mechanism', activeNodeIds: ['2'] },
                { stepNumber: 3, title: 'Step 3: Verification', description: 'Confirming final outcome', activeNodeIds: ['3'] }
              ]
            }}
            threeDData={data.threeDData}
            queryTopic={data.detectedTopic || data.query}
          />
        </section>
      )}

      {/* 5. Algorithm & Code Step-by-Step Dry Run / Trace */}
      {dryRunSteps.length > 0 && (
        <section className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-7 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Step-by-Step Code / Algorithm Dry Run Trace
                </h3>
                <p className="text-xs text-slate-400">
                  Step {activeDryRunStep + 1} of {dryRunSteps.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveDryRunStep(prev => Math.max(0, prev - 1))}
                disabled={activeDryRunStep === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
                title="Previous Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsDryRunPlaying(p => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {isDryRunPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isDryRunPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveDryRunStep(prev => Math.min(dryRunSteps.length - 1, prev + 1))}
                disabled={activeDryRunStep === dryRunSteps.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer"
                title="Next Step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Step Card */}
          {dryRunSteps[activeDryRunStep] && (
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 mb-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-indigo-400">
                  Step #{dryRunSteps[activeDryRunStep].stepNumber || activeDryRunStep + 1}
                </span>
                {dryRunSteps[activeDryRunStep].highlightLine !== undefined && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                    Line {dryRunSteps[activeDryRunStep].highlightLine}
                  </span>
                )}
              </div>

              <p className="text-sm font-medium text-slate-200 mb-3">
                {dryRunSteps[activeDryRunStep].explanation}
              </p>

              {/* Variables State */}
              {dryRunSteps[activeDryRunStep].variableState && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Memory / Variable Values
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(dryRunSteps[activeDryRunStep].variableState).map(([k, v]) => (
                      <div key={k} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs flex items-center gap-1.5">
                        <span className="text-amber-400 font-bold">{k}</span>
                        <span className="text-slate-500">=</span>
                        <span className="text-emerald-400 font-semibold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Trace Stepper Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {dryRunSteps.map((step, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveDryRunStep(idx);
                  setIsDryRunPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold shrink-0 transition-all cursor-pointer ${
                  activeDryRunStep === idx
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                Step {idx + 1}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 6. Comparative Analysis if available */}
      {data.comparison && (
        <section className="w-full">
          <ComparisonView data={data.comparison} />
        </section>
      )}

      {/* 7. Code & Algorithm Lab if available */}
      {data.codeBlock && (
        <section className="w-full">
          <CodeLab data={data.codeBlock} />
        </section>
      )}

      {/* 8. Inline Quiz Assessment if quizPayload exists */}
      {data.quizPayload && data.quizPayload.questions && data.quizPayload.questions.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-indigo-200 dark:border-indigo-900/60 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Interactive Practice Quiz: {data.quizPayload.topic || data.detectedTopic || data.query}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {data.quizPayload.questions.length} Diagnostic Questions
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => startQuizForTopic(data.quizPayload?.topic || data.query)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Open in Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-5">
            {data.quizPayload.questions.map((q, qIdx) => {
              const selectedOpt = quizAnswers[qIdx];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === Number(q.correctAnswer);

              return (
                <div key={q.id || qIdx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Q{qIdx + 1}. {q.question}
                    </span>
                    {isAnswered && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {isCorrect ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    )}
                  </div>

                  {q.options && (
                    <div className="space-y-2 mb-3">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = selectedOpt === optIdx;
                        const isRightOpt = Number(q.correctAnswer) === optIdx;

                        let optClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400';
                        if (isAnswered) {
                          if (isRightOpt) {
                            optClass = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-semibold';
                          } else if (isChosen) {
                            optClass = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-950 dark:text-rose-200 line-through';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${optClass}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isRightOpt && <Check className="w-4 h-4 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {isAnswered && q.explanation && (
                    <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                      <span className="font-bold text-indigo-700 dark:text-indigo-300">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 9. Detailed Academic Breakdown with LaTeX KaTeX */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                Comprehensive Technical Deep-Dive
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Rigorous theory, mechanisms, and mathematical formulations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFullDetailed(prev => !prev)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title={showFullDetailed ? 'Collapse Deep Dive' : 'Expand Deep Dive'}
          >
            {showFullDetailed ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showFullDetailed && (
          <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {data.detailedExplanation}
            </ReactMarkdown>
          </div>
        )}
      </section>

      {/* 10. Key Points & Common Misconceptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* High-Yield Key Points */}
        {data.keyPoints && data.keyPoints.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                High-Yield Key Takeaways
              </h3>
            </div>

            <ul className="space-y-2.5">
              {data.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Common Misconceptions */}
        {data.commonMistakes && data.commonMistakes.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-rose-500">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Common Misconceptions & Corrections
              </h3>
            </div>

            <div className="space-y-3">
              {data.commonMistakes.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 text-xs">
                  <div className="font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-start gap-1.5">
                    <span className="text-rose-500 font-bold shrink-0">❌ Misconception:</span>
                    <span>{item.mistake}</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 pl-4 border-l-2 border-emerald-500 mt-1.5 leading-relaxed">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Fact: </span>
                    {item.correction}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 11. Interactive Quick Revision Flip Cards */}
      {data.quickRevisionCards && data.quickRevisionCards.length > 0 && (
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Active Recall Revision Cards
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Click any card to flip</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {data.quickRevisionCards.map((card, idx) => {
              const isFlipped = flippedCards[idx];

              return (
                <div
                  key={idx}
                  onClick={() => toggleCardFlip(idx)}
                  className={`min-h-[130px] p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isFlipped
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-400'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span className={isFlipped ? 'text-indigo-200' : 'text-slate-400'}>
                      Card {idx + 1} • {isFlipped ? 'Answer' : 'Question'}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${isFlipped ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {isFlipped ? 'Flipped' : 'Click to flip'}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isFlipped ? 'text-white font-semibold' : 'text-slate-900 dark:text-slate-100'}`}>
                    {isFlipped ? card.back : card.front}
                  </p>

                  <div className="mt-2 text-[10px] font-semibold text-right opacity-70">
                    {isFlipped ? 'Tap to see question' : 'Tap to reveal answer'}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 12. Practice Questions & Exam Strategy */}
      {(data.practiceQuestions?.length || data.examTips?.length || data.interviewQuestions?.length) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Practice Questions */}
          {data.practiceQuestions && data.practiceQuestions.length > 0 && (
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
                <HelpCircle className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Practice & Application Exercises
                </h3>
              </div>

              <div className="space-y-2.5">
                {data.practiceQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">Q{idx + 1}.</span>
                    <span className="leading-relaxed">{q}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Exam Tips / Interview Questions */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-amber-500">
              <Flame className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Exam Scoring Tips & High-Yield Tactics
              </h3>
            </div>

            <div className="space-y-2.5">
              {(data.examTips || data.interviewQuestions || []).map((tip, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                  <span className="font-bold text-amber-600 shrink-0">★ Tip {idx + 1}:</span>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {/* 13. Action Launcher Footer */}
      <section className="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950/40 dark:to-cyan-950/40 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Ready to test your mastery or save this material?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Generate an adaptive self-assessment or save exam notes to your workspace.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => startQuizForTopic(data.detectedTopic || data.query)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Generate Diagnostic Quiz</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToNotes}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Save to Notes Studio</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default StructuredResponseView;