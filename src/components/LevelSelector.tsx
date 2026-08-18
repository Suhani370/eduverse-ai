import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EDUCATION_LEVELS } from '../data/constants';
import { EducationLevel } from '../types';
import { GraduationCap, Check, ChevronDown, Sparkles, X } from 'lucide-react';

interface LevelSelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
  fullModal?: boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ isOpen: controlledIsOpen, onClose, fullModal }) => {
  const { educationLevel, setEducationLevel } = useApp();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggle = () => {
    if (onClose && controlledIsOpen !== undefined) {
      onClose();
    } else {
      setInternalIsOpen(prev => !prev);
    }
  };

  const currentLevelObj = EDUCATION_LEVELS.find(l => l.id === educationLevel) || EDUCATION_LEVELS[3];

  return (
    <div className="relative inline-block text-left" id="level-selector-wrapper">
      <button
        id="level-selector-btn"
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs transition-all cursor-pointer"
        title="Change Learner Target Level"
      >
        <span className="text-sm leading-none">{currentLevelObj.emoji}</span>
        <span className="truncate max-w-[130px] sm:max-w-[180px]">{currentLevelObj.label}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs" onClick={toggle} />
          <div
            id="level-selector-modal"
            className="fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 max-w-md sm:w-[420px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 sm:p-5 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select Learner Level</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    AI adapts vocabulary, depth, formulas, and real-world analogies.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggle}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {EDUCATION_LEVELS.map(level => {
                const isSelected = educationLevel === level.id;
                return (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => {
                      setEducationLevel(level.id);
                      if (onClose) onClose();
                      else setInternalIsOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 dark:border-indigo-500 shadow-xs ring-1 ring-indigo-500/30'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl mt-0.5 select-none">{level.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-900 dark:text-white'}`}>
                          {level.label}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300">
                          {level.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {level.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
