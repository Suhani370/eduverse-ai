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
  ChevronUp
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

  const handleCopyExplanation = () => {
    const textToCopy = `# ${data.query}\n\n## Quick Answer\n${data.quickAnswer}\n\n## Simple Explanation\n${data.simpleExplanation}\n\n## Detailed Explanation\n${data.detailedExplanation}\n\n## Key Takeaways\n${data.keyPoints?.map(p => `- ${p}`).join('\n') || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToNotes = () => {
    saveNote({
      id: 'note-' + Date.now(),
      topic: data.query,
      subject: 'Academic & Applied Sciences',
      educationLevel,
      language,
      createdAt: new Date().toISOString(),
      tags: [data.query, educationLevel, 'High-Yield'],
      summary: data.quickAnswer,
      contentMarkdown: `# ${data.query}\n\n## Executive Summary\n${data.quickAnswer}\n\n## Intuitive Explanation\n${data.simpleExplanation}\n\n## Conceptual Deep-Dive\n${data.detailedExplanation}`,
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

  return (
    <div className="w-full space-y-6 pb-8 animate-in fade-in duration-300" id="structured-response-container">
      {/* Medical Disclaimer if health/biological */}
      {data.medicalDisclaimer && <MedicalDisclaimerBanner />}

      {/* 1. Quick Answer & Key Definition Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-indigo-800/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Core Conceptual Takeaway</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyExplanation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
                title="Copy Full Explanation"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden xs:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToNotes}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Save into Notes Studio"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Save Note</span>
              </button>
            </div>
          </div>

          <p className="text-base sm:text-lg font-semibold leading-relaxed text-indigo-50">
            {data.quickAnswer}
          </p>
        </div>
      </section>

      {/* 2. Intuitive Breakdown & Real-World Analogy */}
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
          <section className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 rounded-3xl border border-amber-200 dark:border-amber-900/50 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2 text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-5 h-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200">
                  Real-World Analogy
                </h3>
              </div>

              <div className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300 mb-2">
                "{data.realWorldAnalogy.analogy}"
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {data.realWorldAnalogy.explanation}
              </p>
            </div>

            {data.realWorldAnalogy.targetContext && (
              <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-400 font-medium flex items-center gap-1.5">
                <span className="font-bold">Mental Model:</span>
                <span>{data.realWorldAnalogy.targetContext}</span>
              </div>
            )}
          </section>
        )}
      </div>

      {/* 3. Interactive Visualization Engine */}
      {data.visualization && (
        <section className="w-full">
          <VisualizationEngine
            data={data.visualization}
            queryTopic={data.query}
          />
        </section>
      )}

      {/* 4. Comparative Analysis if available */}
      {data.comparison && (
        <section className="w-full">
          <ComparisonView data={data.comparison} />
        </section>
      )}

      {/* 5. Code & Algorithm Lab if available */}
      {data.codeBlock && (
        <section className="w-full">
          <CodeLab data={data.codeBlock} />
        </section>
      )}

      {/* 6. Detailed Academic Breakdown with LaTeX KaTeX */}
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
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
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

      {/* 7. Key Points & Common Misconceptions Grid */}
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

      {/* 8. Interactive Quick Revision Flip Cards */}
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

      {/* 9. Practice Questions & Exam Strategy */}
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

      {/* 10. Action Launcher Footer */}
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
            onClick={() => startQuizForTopic(data.query)}
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