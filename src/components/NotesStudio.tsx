import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyNote } from '../types';
import { generateStudyNotesApi } from '../services/api';
import {
  FileText,
  Plus,
  Search,
  Bookmark,
  Trash2,
  Download,
  Share2,
  Printer,
  Sparkles,
  CheckCircle,
  Tag,
  Loader2,
  Layers,
  GraduationCap,
  Globe
} from 'lucide-react';

export const NotesStudio: React.FC = () => {
  const {
    savedNotes,
    saveNote,
    deleteNote,
    bookmarkNote,
    educationLevel,
    language
  } = useApp();

  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(() => savedNotes[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTopicInput, setNewTopicInput] = useState('');

  const filteredNotes = savedNotes.filter(note =>
    note.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleGenerateNewNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicInput.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const note = await generateStudyNotesApi(newTopicInput.trim(), educationLevel, language);
      saveNote(note);
      setSelectedNote(note);
      setNewTopicInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportMarkdown = (note: StudyNote) => {
    const blob = new Blob([note.contentMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.topic.replace(/\s+/g, '_')}_Notes.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12" id="notes-studio">
      {/* Studio Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              EduVerse Study Notes Studio
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              High-yield exam notes, formula sheets, key concepts, and instant revision summaries.
            </p>
          </div>
        </div>

        {/* Generate Note Form */}
        <form onSubmit={handleGenerateNewNote} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={newTopicInput}
            onChange={e => setNewTopicInput(e.target.value)}
            placeholder="Generate notes for: 'Photosynthesis', 'OSI Model'..."
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden w-full sm:w-64"
          />
          <button
            type="submit"
            disabled={isGenerating || !newTopicInput.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isGenerating ? 'Generating...' : 'New Note'}</span>
          </button>
        </form>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Notes List Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search saved notes..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden"
            />
          </div>

          {/* Notes Cards */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-400">
                No notes found. Enter a topic above to generate exam-ready study notes!
              </div>
            ) : (
              filteredNotes.map(note => {
                const isSelected = selectedNote?.id === note.id;

                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {note.topic}
                      </h4>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          bookmarkNote(note.id);
                        }}
                        className="text-slate-400 hover:text-amber-500"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${note.isBookmarked ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {note.summary || note.contentMarkdown.substring(0, 80)}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {note.educationLevel}
                      </span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Note Detail Viewer */}
        <div className="lg:col-span-8">
          {selectedNote ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              {/* Note Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {selectedNote.subject || 'Study Notes'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {selectedNote.language} • {new Date(selectedNote.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    {selectedNote.topic}
                  </h1>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleExportMarkdown(selectedNote)}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Export Markdown File"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Print Notes"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteNote(selectedNote.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Key Takeaway Cards */}
              {selectedNote.keyPoints && selectedNote.keyPoints.length > 0 && (
                <div className="my-5 p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>High-Yield Key Takeaways</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {selectedNote.keyPoints.map((kp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Markdown Content Body */}
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-100 dark:border-slate-800 pt-5 font-sans">
                {selectedNote.contentMarkdown}
              </div>

              {/* Exam Tips Highlights */}
              {selectedNote.examTips && selectedNote.examTips.length > 0 && (
                <div className="mt-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs">
                  <div className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Exam Tips & High-Scoring Tactics</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-800 dark:text-slate-200 text-[11px]">
                    {selectedNote.examTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-sm">
              Select a note on the left or generate a new study note above!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
