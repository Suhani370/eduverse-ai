import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LANGUAGES, RESPONSE_STYLES } from '../data/constants';
import { SupportedLanguage, ResponseStyle } from '../types';
import { Globe, Check, Sparkles, SlidersHorizontal, X } from 'lucide-react';

interface LanguageSelectorProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isOpen: controlledIsOpen, onClose }) => {
  const { language, setLanguage, responseStyle, setResponseStyle } = useApp();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggle = () => {
    if (onClose && controlledIsOpen !== undefined) {
      onClose();
    } else {
      setInternalIsOpen(prev => !prev);
    }
  };

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" id="language-selector-wrapper">
      <button
        id="language-selector-btn"
        type="button"
        onClick={toggle}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs transition-all cursor-pointer"
        title="Change Learning Language & Style"
      >
        <Globe className="w-3.5 h-3.5 text-indigo-500" />
        <span>{currentLangObj.name}</span>
        <span className="text-[10px] text-slate-400 font-normal">({currentLangObj.nativeName})</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs" onClick={toggle} />
          <div
            id="language-selector-dropdown"
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Language & Style</h3>
              </div>
              <button
                type="button"
                onClick={toggle}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explanation Style Selector */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Explanation Tone / Style
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {RESPONSE_STYLES.map(style => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setResponseStyle(style.id)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      responseStyle === style.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{style.label}</span>
                    {responseStyle === style.id && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Select Native Language (12+ Supported)
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                {LANGUAGES.map(lang => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        if (onClose) onClose();
                        else setInternalIsOpen(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold">{lang.name}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {lang.nativeName}
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500 text-center">
              Responses are authentically generated in native scripts & vocabulary.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
