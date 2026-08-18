import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { analyzeDocumentApi } from '../services/api';
import {
  FileSearch,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Loader2,
  Layers,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

export const DocumentLearning: React.FC = () => {
  const { educationLevel, language, saveNote, startQuizForTopic } = useApp();

  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('summary');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<any | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setDocumentText(content);
    };
    reader.readAsText(file);
  };

  const handleRunAnalysis = async () => {
    if (!documentText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await analyzeDocumentApi(
        documentText,
        fileName || 'Uploaded Document',
        selectedAction,
        language,
        educationLevel
      );
      setInsights(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveAsNote = () => {
    if (!insights) return;
    saveNote({
      id: 'doc-note-' + Date.now(),
      topic: fileName || 'Document Insights',
      educationLevel,
      language,
      createdAt: new Date().toISOString(),
      tags: ['Document Analysis', 'Textbook Notes'],
      summary: insights.documentSummary || 'Summary of uploaded material',
      contentMarkdown: insights.structuredNotes || `# Notes from ${fileName}\n\n${insights.documentSummary}`,
      keyPoints: insights.keyTakeaways || [],
      examTips: insights.potentialExamQuestions || []
    });
    alert('Document notes saved to Notes Studio!');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12" id="document-learning-studio">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Document & Syllabus Intelligence
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Upload textbook chapters, lecture slides, research papers, or syllabus outlines for instant deep insights.
            </p>
          </div>
        </div>
      </div>

      {/* Upload and Input Console */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* File Upload Box */}
          <label className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center min-h-[160px]">
            <UploadCloud className="w-8 h-8 text-indigo-500 mb-2" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {fileName ? fileName : 'Upload Text, PDF, or Notes file'}
            </span>
            <span className="text-[11px] text-slate-400 mt-1">
              Supports .txt, .md, .csv, and textbook lecture notes
            </span>
            <input
              type="file"
              accept=".txt,.md,.json,.csv,.doc"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Direct Text Paste Box */}
          <textarea
            value={documentText}
            onChange={e => setDocumentText(e.target.value)}
            placeholder="Or paste textbook chapter, lecture transcripts, syllabus outline, or research notes directly here..."
            className="w-full h-[160px] p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Action Type Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Goal:
            </span>
            {[
              { id: 'summary', label: 'Executive Summary' },
              { id: 'notes', label: 'Structured Exam Notes' },
              { id: 'questions', label: 'Probable Exam Questions' },
              { id: 'concepts', label: 'Core Concept Matrix' }
            ].map(action => (
              <button
                key={action.id}
                type="button"
                onClick={() => setSelectedAction(action.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedAction === action.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || !documentText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isAnalyzing ? 'Extracting Insights...' : 'Analyze Document'}</span>
          </button>
        </div>
      </div>

      {/* Insights Results */}
      {insights && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Extracted Intelligence
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {fileName || 'Document Analysis Report'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveAsNote}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Save to Notes</span>
              </button>

              <button
                type="button"
                onClick={() => startQuizForTopic(fileName || 'Document Key Concepts')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Generate Quiz</span>
              </button>
            </div>
          </div>

          {/* Summary */}
          {insights.documentSummary && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-1">
                Executive Synthesis
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {insights.documentSummary}
              </p>
            </div>
          )}

          {/* Main Concepts Grid */}
          {insights.mainConcepts && insights.mainConcepts.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Core Conceptual Modules
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {insights.mainConcepts.map((item: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
                    <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
                      {item.concept}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Structured Notes or Markdown */}
          {insights.structuredNotes && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {insights.structuredNotes}
            </div>
          )}

          {/* Exam Questions Extracted */}
          {insights.potentialExamQuestions && insights.potentialExamQuestions.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3">
                High-Probability Exam Questions
              </h4>
              <div className="space-y-2">
                {insights.potentialExamQuestions.map((q: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                    <span className="font-bold text-amber-600">Q{i + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
