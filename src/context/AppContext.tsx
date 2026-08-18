import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  EducationLevel,
  SupportedLanguage,
  ResponseStyle,
  ResponseMode,
  StructuredEducationalResponse,
  StudyNote,
  UserStats,
  QuizResult,
  QuizQuestion
} from '../types';

import { DEMO_RESPONSES } from '../data/demoTopics';

import {
  fetchEducationalResponse,
  generateStudyNotesApi,
  generateQuizApi
} from '../services/api';

import { EDUCATION_LEVELS } from '../data/constants';

export type ViewType =
  | 'landing'
  | 'dashboard'
  | 'learn'
  | 'notes'
  | 'quiz'
  | 'code'
  | 'document'
  | 'saved'
  | 'settings';

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;

  educationLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;

  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;

  responseStyle: ResponseStyle;
  setResponseStyle: (style: ResponseStyle) => void;

  responseMode: ResponseMode;
  setResponseMode: (mode: ResponseMode) => void;

  activeQuery: string;
  setActiveQuery: (q: string) => void;

  activeResponse: StructuredEducationalResponse | null;
  setActiveResponse: (
    resp: StructuredEducationalResponse | null
  ) => void;

  isLoading: boolean;
  error: string | null;

  handleAskQuestion: (
    queryText: string,
    overrideMode?: ResponseMode
  ) => Promise<void>;

  savedNotes: StudyNote[];
  saveNote: (note: StudyNote) => void;
  deleteNote: (id: string) => void;
  bookmarkNote: (id: string) => void;
  generateNotesForActiveTopic: () => Promise<void>;

  activeQuiz: {
    topic: string;
    questions: QuizQuestion[];
  } | null;

  setActiveQuiz: (
    quiz: {
      topic: string;
      questions: QuizQuestion[];
    } | null
  ) => void;

  quizHistory: QuizResult[];

  recordQuizResult: (result: QuizResult) => void;

  startQuizForTopic: (topic: string) => Promise<void>;

  isDarkMode: boolean;
  toggleDarkMode: () => void;

  stats: UserStats;

  recentSearches: string[];

  clearHistory: () => void;
}

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

const STORAGE_KEY_NOTES = 'eduverse_saved_notes_v1';
const STORAGE_KEY_STATS = 'eduverse_user_stats_v1';
const STORAGE_KEY_HISTORY = 'eduverse_recent_searches_v1';
const STORAGE_KEY_THEME = 'eduverse_dark_mode_v1';
const STORAGE_KEY_LANG = 'eduverse_language_v1';
const STORAGE_KEY_LEVEL = 'eduverse_level_v1';

/**
 * =========================================================
 * APP PROVIDER
 * =========================================================
 */

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  /**
   * =======================================================
   * BASIC APP STATE
   * =======================================================
   */

  const [currentView, setCurrentView] =
    useState<ViewType>('landing');

  /**
   * =======================================================
   * EDUCATION LEVEL
   * =======================================================
   */

  const [educationLevel, setEducationLevelState] =
    useState<EducationLevel>(() => {
      try {
        return (
          (localStorage.getItem(
            STORAGE_KEY_LEVEL
          ) as EducationLevel) ||
          'college_engineering'
        );
      } catch {
        return 'college_engineering';
      }
    });

  /**
   * =======================================================
   * LANGUAGE
   * =======================================================
   */

  const [language, setLanguageState] =
    useState<SupportedLanguage>(() => {
      try {
        return (
          (localStorage.getItem(
            STORAGE_KEY_LANG
          ) as SupportedLanguage) ||
          'English'
        );
      } catch {
        return 'English';
      }
    });

  /**
   * =======================================================
   * RESPONSE SETTINGS
   * =======================================================
   */

  const [responseStyle, setResponseStyle] =
    useState<ResponseStyle>('normal');

  const [responseMode, setResponseMode] =
    useState<ResponseMode>('comprehensive');

  /**
   * =======================================================
   * ACTIVE LEARNING RESPONSE
   * =======================================================
   */

  const [activeQuery, setActiveQuery] = useState<string>(
    'Explain photosynthesis with a visual flow'
  );

  const [activeResponse, setActiveResponse] =
    useState<StructuredEducationalResponse | null>(() => {
      return DEMO_RESPONSES['photosynthesis'];
    });

  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * =======================================================
   * SAVED NOTES
   * =======================================================
   */

  const [savedNotes, setSavedNotes] =
    useState<StudyNote[]>(() => {
      try {
        const stored =
          localStorage.getItem(STORAGE_KEY_NOTES);

        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    });

  /**
   * =======================================================
   * QUIZ
   * =======================================================
   */

  const [activeQuiz, setActiveQuiz] =
    useState<{
      topic: string;
      questions: QuizQuestion[];
    } | null>(null);

  const [quizHistory, setQuizHistory] =
    useState<QuizResult[]>([]);

  /**
   * =======================================================
   * USER STATS
   * =======================================================
   */

  const [stats, setStats] =
    useState<UserStats>(() => {
      try {
        const stored =
          localStorage.getItem(STORAGE_KEY_STATS);

        return stored
          ? JSON.parse(stored)
          : {
              topicsLearnedCount: 4,
              quizzesTakenCount: 2,
              averageQuizScore: 92,
              studyStreakDays: 5,
              savedNotesCount: 0
            };
      } catch {
        return {
          topicsLearnedCount: 4,
          quizzesTakenCount: 2,
          averageQuizScore: 92,
          studyStreakDays: 5,
          savedNotesCount: 0
        };
      }
    });

  /**
   * =======================================================
   * RECENT SEARCHES
   * =======================================================
   */

  const [recentSearches, setRecentSearches] =
    useState<string[]>(() => {
      try {
        const stored =
          localStorage.getItem(STORAGE_KEY_HISTORY);

        return stored
          ? JSON.parse(stored)
          : [
              'Explain photosynthesis with a visual flow',
              'TCP vs UDP with real-world courier analogy',
              'C++ code for Binary Search with line-by-line breakdown',
              'Explain Nephron structure and filtration mechanism'
            ];
      } catch {
        return [];
      }
    });

  /**
   * =======================================================
   * DARK MODE
   * =======================================================
   */

  const [isDarkMode, setIsDarkMode] =
    useState<boolean>(() => {
      try {
        const stored =
          localStorage.getItem(STORAGE_KEY_THEME);

        if (stored !== null) {
          return stored === 'true';
        }

        return window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
      } catch {
        return false;
      }
    });

  /**
   * =======================================================
   * DARK MODE EFFECT
   * =======================================================
   */

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem(
      STORAGE_KEY_THEME,
      String(isDarkMode)
    );
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  /**
   * =======================================================
   * EDUCATION LEVEL SETTER
   * =======================================================
   */

  const setEducationLevel = (
    level: EducationLevel
  ) => {
    setEducationLevelState(level);

    localStorage.setItem(
      STORAGE_KEY_LEVEL,
      level
    );
  };

  /**
   * =======================================================
   * LANGUAGE SETTER
   * =======================================================
   *
   * This is the value that gets sent to the backend.
   */

  const setLanguage = (
    lang: SupportedLanguage
  ) => {
    setLanguageState(lang);

    localStorage.setItem(
      STORAGE_KEY_LANG,
      lang
    );

    console.log(
      '[EduVerse] Language changed to:',
      lang
    );
  };

  /**
   * =======================================================
   * SAVE NOTE
   * =======================================================
   */

  const saveNote = (note: StudyNote) => {
    setSavedNotes(prev => {
      const filtered =
        prev.filter(n => n.id !== note.id);

      const updated = [
        note,
        ...filtered
      ];

      localStorage.setItem(
        STORAGE_KEY_NOTES,
        JSON.stringify(updated)
      );

      return updated;
    });

    setStats(prev => {
      const alreadyExists =
        savedNotes.some(
          n => n.id === note.id
        );

      const upd = {
        ...prev,

        savedNotesCount:
          alreadyExists
            ? prev.savedNotesCount
            : prev.savedNotesCount + 1
      };

      localStorage.setItem(
        STORAGE_KEY_STATS,
        JSON.stringify(upd)
      );

      return upd;
    });
  };

  /**
   * =======================================================
   * DELETE NOTE
   * =======================================================
   */

  const deleteNote = (id: string) => {
    setSavedNotes(prev => {
      const updated =
        prev.filter(n => n.id !== id);

      localStorage.setItem(
        STORAGE_KEY_NOTES,
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  /**
   * =======================================================
   * BOOKMARK NOTE
   * =======================================================
   */

  const bookmarkNote = (id: string) => {
    setSavedNotes(prev => {
      const updated =
        prev.map(note =>
          note.id === id
            ? {
                ...note,
                isBookmarked:
                  !note.isBookmarked
              }
            : note
        );

      localStorage.setItem(
        STORAGE_KEY_NOTES,
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  /**
   * =======================================================
   * MAIN ASK QUESTION HANDLER
   * =======================================================
   */

  const handleAskQuestion = async (
    queryText: string,
    overrideMode?: ResponseMode
  ) => {
    const cleanQuery =
      queryText.trim();

    if (!cleanQuery) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setActiveQuery(cleanQuery);

    const mode =
      overrideMode || responseMode;

    /**
     * ===============================================
     * SEARCH HISTORY
     * ===============================================
     */

    setRecentSearches(prev => {
      const filtered =
        prev.filter(
          q =>
            q.toLowerCase() !==
            cleanQuery.toLowerCase()
        );

      const updated = [
        cleanQuery,
        ...filtered
      ].slice(0, 10);

      localStorage.setItem(
        STORAGE_KEY_HISTORY,
        JSON.stringify(updated)
      );

      return updated;
    });

    const levelConfig =
      EDUCATION_LEVELS.find(
        level =>
          level.id === educationLevel
      );

    console.log(
      '========================================'
    );

    console.log(
      '[EduVerse] Sending educational request'
    );

    console.log(
      'Question:',
      cleanQuery
    );

    console.log(
      'Language:',
      language
    );

    console.log(
      'Education:',
      educationLevel
    );

    console.log(
      'Style:',
      responseStyle
    );

    console.log(
      'Mode:',
      mode
    );

    console.log(
      '========================================'
    );

    try {
      /**
       * =============================================
       * NOTES MODE
       * =============================================
       */

      if (mode === 'notes') {
        setCurrentView('notes');

        const note =
          await generateStudyNotesApi(
            cleanQuery,
            educationLevel,
            language
          );

        saveNote(note);

        return;
      }

      /**
       * =============================================
       * QUIZ MODE
       * =============================================
       */

      if (mode === 'quiz') {
        setCurrentView('quiz');

        await startQuizForTopic(
          cleanQuery
        );

        return;
      }

      /**
       * =============================================
       * NORMAL LEARNING MODE
       * =============================================
       */

      const response =
        await fetchEducationalResponse({
          query: cleanQuery,

          language,

          educationLevel,

          responseStyle,

          responseMode: mode,

          tonePrompt:
            levelConfig?.tonePrompt
        });

      /**
       * =============================================
       * RESPONSE VALIDATION
       * =============================================
       */

      if (!response) {
        throw new Error(
          'The AI returned an empty response.'
        );
      }

      console.log(
        '[EduVerse] AI response received:',
        response
      );

      /**
       * =============================================
       * SAVE RESPONSE
       * =============================================
       */

      setActiveResponse(response);

      setCurrentView('learn');

      /**
       * =============================================
       * UPDATE STATS
       * =============================================
       */

      setStats(prev => {
        const updated = {
          ...prev,

          topicsLearnedCount:
            prev.topicsLearnedCount + 1
        };

        localStorage.setItem(
          STORAGE_KEY_STATS,
          JSON.stringify(updated)
        );

        return updated;
      });

    } catch (err: any) {
      console.error(
        '[EduVerse] Error fetching question response:',
        err
      );

      setError(
        err?.message ||
        'Unable to generate response. Please try again.'
      );

    } finally {
      setIsLoading(false);
    }
  };

  /**
   * =======================================================
   * GENERATE NOTES FOR ACTIVE TOPIC
   * =======================================================
   */

  const generateNotesForActiveTopic =
    async () => {
      if (!activeResponse) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const note =
          await generateStudyNotesApi(
            activeResponse.query,
            educationLevel,
            language
          );

        saveNote(note);

        setCurrentView('notes');

      } catch (err) {
        console.error(
          '[EduVerse] Failed to generate notes:',
          err
        );

        setError(
          'Failed to generate study notes.'
        );

      } finally {
        setIsLoading(false);
      }
    };

  /**
   * =======================================================
   * START QUIZ
   * =======================================================
   */

  const startQuizForTopic =
    async (topic: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const quiz =
          await generateQuizApi(
            topic,
            educationLevel,
            language,
            5
          );

        setActiveQuiz(quiz);

        setCurrentView('quiz');

      } catch (err) {
        console.error(
          '[EduVerse] Failed to load quiz:',
          err
        );

        setError(
          'Failed to load quiz. Please try again.'
        );

      } finally {
        setIsLoading(false);
      }
    };

  /**
   * =======================================================
   * RECORD QUIZ RESULT
   * =======================================================
   */

  const recordQuizResult = (
    result: QuizResult
  ) => {
    setQuizHistory(prev => [
      result,
      ...prev
    ]);

    setStats(prev => {
      const newCount =
        prev.quizzesTakenCount + 1;

      const newAverage =
        Math.round(
          (
            prev.averageQuizScore *
              prev.quizzesTakenCount +
            result.percentage
          ) / newCount
        );

      const updated = {
        ...prev,

        quizzesTakenCount:
          newCount,

        averageQuizScore:
          newAverage,

        studyStreakDays:
          prev.studyStreakDays + 1
      };

      localStorage.setItem(
        STORAGE_KEY_STATS,
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  /**
   * =======================================================
   * CLEAR SEARCH HISTORY
   * =======================================================
   */

  const clearHistory = () => {
    setRecentSearches([]);

    localStorage.removeItem(
      STORAGE_KEY_HISTORY
    );
  };

  /**
   * =======================================================
   * CONTEXT PROVIDER
   * =======================================================
   */

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,

        educationLevel,
        setEducationLevel,

        language,
        setLanguage,

        responseStyle,
        setResponseStyle,

        responseMode,
        setResponseMode,

        activeQuery,
        setActiveQuery,

        activeResponse,
        setActiveResponse,

        isLoading,
        error,

        handleAskQuestion,

        savedNotes,
        saveNote,
        deleteNote,
        bookmarkNote,

        generateNotesForActiveTopic,

        activeQuiz,
        setActiveQuiz,

        quizHistory,
        recordQuizResult,

        startQuizForTopic,

        isDarkMode,
        toggleDarkMode,

        stats,

        recentSearches,
        clearHistory
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * =========================================================
 * USE APP HOOK
 * =========================================================
 */

export const useApp = () => {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};