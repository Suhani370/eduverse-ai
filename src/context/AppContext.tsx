import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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
  QuizQuestion,
} from '../types';

import { DEMO_RESPONSES } from '../data/demoTopics';

import {
  fetchEducationalResponse,
  generateStudyNotesApi,
  generateQuizApi,
} from '../services/api';

import { EDUCATION_LEVELS } from '../data/constants';

/* =========================================================
   TYPES
========================================================= */

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

interface ActiveQuiz {
  topic: string;
  questions: QuizQuestion[];
}

interface AppContextType {
  /* Navigation */
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;

  /* Learning preferences */
  educationLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;

  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;

  responseStyle: ResponseStyle;
  setResponseStyle: (style: ResponseStyle) => void;

  responseMode: ResponseMode;
  setResponseMode: (mode: ResponseMode) => void;

  /* Active learning session */
  activeQuery: string;
  setActiveQuery: (query: string) => void;

  activeResponse: StructuredEducationalResponse | null;
  setActiveResponse: (
    response: StructuredEducationalResponse | null
  ) => void;

  isLoading: boolean;
  error: string | null;

  handleAskQuestion: (
    queryText: string,
    overrideMode?: ResponseMode
  ) => Promise<void>;

  /* Notes */
  savedNotes: StudyNote[];
  saveNote: (note: StudyNote) => void;
  deleteNote: (id: string) => void;
  bookmarkNote: (id: string) => void;
  generateNotesForActiveTopic: () => Promise<void>;

  /* Quiz */
  activeQuiz: ActiveQuiz | null;
  setActiveQuiz: (quiz: ActiveQuiz | null) => void;

  quizHistory: QuizResult[];
  recordQuizResult: (result: QuizResult) => void;
  startQuizForTopic: (topic: string) => Promise<void>;

  /* Theme */
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  /* Statistics */
  stats: UserStats;

  /* History */
  recentSearches: string[];
  clearHistory: () => void;
}

/* =========================================================
   CONTEXT
========================================================= */

const AppContext = createContext<AppContextType | undefined>(
  undefined
);

/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
  NOTES: 'eduverse_saved_notes_v2',
  STATS: 'eduverse_user_stats_v2',
  HISTORY: 'eduverse_recent_searches_v2',
  THEME: 'eduverse_dark_mode_v2',
  LANGUAGE: 'eduverse_language_v2',
  LEVEL: 'eduverse_level_v2',
  QUIZ_HISTORY: 'eduverse_quiz_history_v2',
} as const;

/* =========================================================
   DEFAULT VALUES
========================================================= */

const DEFAULT_STATS: UserStats = {
  topicsLearnedCount: 0,
  quizzesTakenCount: 0,
  averageQuizScore: 0,
  studyStreakDays: 0,
  savedNotesCount: 0,
};

const DEFAULT_SEARCHES = [
  'Explain photosynthesis with a visual flow',
  'TCP vs UDP with real-world courier analogy',
  'C++ code for Binary Search with line-by-line breakdown',
  'Explain Nephron structure and filtration mechanism',
];

/* =========================================================
   SAFE STORAGE HELPERS
========================================================= */

const readStorage = <T,>(
  key: string,
  fallback: T
): T => {
  try {
    if (typeof window === 'undefined') {
      return fallback;
    }

    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(
      `[EduVerse] Failed to read localStorage key: ${key}`,
      error
    );

    return fallback;
  }
};

const writeStorage = (
  key: string,
  value: unknown
): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.warn(
      `[EduVerse] Failed to write localStorage key: ${key}`,
      error
    );
  }
};

const removeStorage = (
  key: string
): void => {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.removeItem(key);
  } catch (error) {
    console.warn(
      `[EduVerse] Failed to remove localStorage key: ${key}`,
      error
    );
  }
};

/* =========================================================
   ERROR NORMALIZER
========================================================= */

const getErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  ) {
    const message = (
      error as { message?: unknown }
    ).message;

    if (typeof message === 'string') {
      return message;
    }
  }

  return fallback;
};

/* =========================================================
   PROVIDER
========================================================= */

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  /* =======================================================
     NAVIGATION
  ======================================================= */

  const [currentView, setCurrentView] =
    useState<ViewType>('landing');

  /* =======================================================
     EDUCATION LEVEL
  ======================================================= */

  const [educationLevel, setEducationLevelState] =
    useState<EducationLevel>(() =>
      readStorage<EducationLevel>(
        STORAGE_KEYS.LEVEL,
        'college_engineering'
      )
    );

  /* =======================================================
     LANGUAGE
  ======================================================= */

  const [language, setLanguageState] =
    useState<SupportedLanguage>(() =>
      readStorage<SupportedLanguage>(
        STORAGE_KEYS.LANGUAGE,
        'English'
      )
    );

  /* =======================================================
     RESPONSE PREFERENCES
  ======================================================= */

  const [responseStyle, setResponseStyle] =
    useState<ResponseStyle>('normal');

  const [responseMode, setResponseMode] =
    useState<ResponseMode>('comprehensive');

  /* =======================================================
     ACTIVE LEARNING SESSION
  ======================================================= */

  const [activeQuery, setActiveQuery] =
    useState<string>(
      'Explain photosynthesis with a visual flow'
    );

  const [activeResponse, setActiveResponse] =
    useState<StructuredEducationalResponse | null>(
      () =>
        DEMO_RESPONSES['photosynthesis'] ??
        null
    );

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     NOTES
  ======================================================= */

  const [savedNotes, setSavedNotes] =
    useState<StudyNote[]>(() =>
      readStorage<StudyNote[]>(
        STORAGE_KEYS.NOTES,
        []
      )
    );

  /* =======================================================
     QUIZ
  ======================================================= */

  const [activeQuiz, setActiveQuiz] =
    useState<ActiveQuiz | null>(null);

  const [quizHistory, setQuizHistory] =
    useState<QuizResult[]>(() =>
      readStorage<QuizResult[]>(
        STORAGE_KEYS.QUIZ_HISTORY,
        []
      )
    );

  /* =======================================================
     USER STATS
  ======================================================= */

  const [stats, setStats] =
    useState<UserStats>(() =>
      readStorage<UserStats>(
        STORAGE_KEYS.STATS,
        DEFAULT_STATS
      )
    );

  /* =======================================================
     SEARCH HISTORY
  ======================================================= */

  const [recentSearches, setRecentSearches] =
    useState<string[]>(() =>
      readStorage<string[]>(
        STORAGE_KEYS.HISTORY,
        DEFAULT_SEARCHES
      )
    );

  /* =======================================================
     THEME
  ======================================================= */

  const [isDarkMode, setIsDarkMode] =
    useState<boolean>(() => {
      try {
        if (typeof window === 'undefined') {
          return false;
        }

        const stored =
          localStorage.getItem(
            STORAGE_KEYS.THEME
          );

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

  /* =======================================================
     THEME EFFECT
  ======================================================= */

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle(
      'dark',
      isDarkMode
    );

    try {
      localStorage.setItem(
        STORAGE_KEYS.THEME,
        String(isDarkMode)
      );
    } catch {
      // Ignore storage failures.
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(
      previous => !previous
    );
  }, []);

  /* =======================================================
     EDUCATION LEVEL
  ======================================================= */

  const setEducationLevel =
    useCallback(
      (level: EducationLevel) => {
        setEducationLevelState(level);

        try {
          localStorage.setItem(
            STORAGE_KEYS.LEVEL,
            level
          );
        } catch {
          // Ignore storage failures.
        }
      },
      []
    );

  /* =======================================================
     LANGUAGE
  ======================================================= */

  const setLanguage =
    useCallback(
      (lang: SupportedLanguage) => {
        setLanguageState(lang);

        try {
          localStorage.setItem(
            STORAGE_KEYS.LANGUAGE,
            lang
          );
        } catch {
          // Ignore storage failures.
        }
      },
      []
    );

  /* =======================================================
     SAVE NOTE
  ======================================================= */

  const saveNote = useCallback(
    (note: StudyNote) => {
      setSavedNotes(previous => {
        const exists = previous.some(
          item => item.id === note.id
        );

        const updated = [
          note,
          ...previous.filter(
            item => item.id !== note.id
          ),
        ];

        writeStorage(
          STORAGE_KEYS.NOTES,
          updated
        );

        if (!exists) {
          setStats(previousStats => {
            const updatedStats = {
              ...previousStats,
              savedNotesCount:
                previousStats.savedNotesCount + 1,
            };

            writeStorage(
              STORAGE_KEYS.STATS,
              updatedStats
            );

            return updatedStats;
          });
        }

        return updated;
      });
    },
    []
  );

  /* =======================================================
     DELETE NOTE
  ======================================================= */

  const deleteNote = useCallback(
    (id: string) => {
      setSavedNotes(previous => {
        const existed = previous.some(
          note => note.id === id
        );

        const updated =
          previous.filter(
            note => note.id !== id
          );

        writeStorage(
          STORAGE_KEYS.NOTES,
          updated
        );

        if (existed) {
          setStats(previousStats => {
            const updatedStats = {
              ...previousStats,
              savedNotesCount:
                Math.max(
                  0,
                  previousStats.savedNotesCount - 1
                ),
            };

            writeStorage(
              STORAGE_KEYS.STATS,
              updatedStats
            );

            return updatedStats;
          });
        }

        return updated;
      });
    },
    []
  );

  /* =======================================================
     BOOKMARK NOTE
  ======================================================= */

  const bookmarkNote = useCallback(
    (id: string) => {
      setSavedNotes(previous => {
        const updated =
          previous.map(note =>
            note.id === id
              ? {
                  ...note,
                  isBookmarked:
                    !note.isBookmarked,
                }
              : note
          );

        writeStorage(
          STORAGE_KEYS.NOTES,
          updated
        );

        return updated;
      });
    },
    []
  );

  /* =======================================================
     SEARCH HISTORY
  ======================================================= */

  const addToSearchHistory =
    useCallback(
      (query: string) => {
        setRecentSearches(previous => {
          const normalized =
            query.toLowerCase();

          const filtered =
            previous.filter(
              item =>
                item.toLowerCase() !==
                normalized
            );

          const updated = [
            query,
            ...filtered,
          ].slice(0, 10);

          writeStorage(
            STORAGE_KEYS.HISTORY,
            updated
          );

          return updated;
        });
      },
      []
    );

  /* =======================================================
     MAIN AI QUESTION HANDLER
  ======================================================= */

  const handleAskQuestion =
    useCallback(
      async (
        queryText: string,
        overrideMode?: ResponseMode
      ) => {
        const cleanQuery =
          queryText.trim();

        if (!cleanQuery || isLoading) {
          return;
        }

        setIsLoading(true);
        setError(null);
        setActiveQuery(cleanQuery);

        const mode =
          overrideMode ?? responseMode;

        addToSearchHistory(
          cleanQuery
        );

        const levelConfig =
          EDUCATION_LEVELS.find(
            level =>
              level.id ===
              educationLevel
          );

        try {
          /* -----------------------------------------------
             NOTES MODE
          ------------------------------------------------ */

          if (mode === 'notes') {
            setCurrentView('notes');

            const note =
              await generateStudyNotesApi(
                cleanQuery,
                educationLevel,
                language
              );

            if (!note) {
              throw new Error(
                'Unable to generate study notes.'
              );
            }

            saveNote(note);

            return;
          }

          /* -----------------------------------------------
             QUIZ MODE
          ------------------------------------------------ */

          if (mode === 'quiz') {
            await startQuizForTopic(
              cleanQuery
            );

            return;
          }

          /* -----------------------------------------------
             NORMAL LEARNING MODE
          ------------------------------------------------ */

          const response =
            await fetchEducationalResponse({
              query: cleanQuery,
              language,
              educationLevel,
              responseStyle,
              responseMode: mode,
              tonePrompt:
                levelConfig?.tonePrompt,
            });

          if (!response) {
            throw new Error(
              'The AI returned an empty response.'
            );
          }

          setActiveResponse(
            response
          );

          setCurrentView(
            'learn'
          );

          setStats(previous => {
            const updated = {
              ...previous,
              topicsLearnedCount:
                previous.topicsLearnedCount +
                1,
            };

            writeStorage(
              STORAGE_KEYS.STATS,
              updated
            );

            return updated;
          });
        } catch (err) {
          console.error(
            '[EduVerse] AI request failed:',
            err
          );

          setError(
            getErrorMessage(
              err,
              'Unable to generate the learning response. Please try again.'
            )
          );
        } finally {
          setIsLoading(false);
        }
      },
      [
        isLoading,
        responseMode,
        educationLevel,
        language,
        responseStyle,
        addToSearchHistory,
        saveNote,
      ]
    );

  /* =======================================================
     GENERATE NOTES FOR ACTIVE TOPIC
  ======================================================= */

  const generateNotesForActiveTopic =
    useCallback(async () => {
      if (!activeResponse) {
        setError(
          'No active topic is available.'
        );
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

        if (!note) {
          throw new Error(
            'No study note was generated.'
          );
        }

        saveNote(note);

        setCurrentView(
          'notes'
        );
      } catch (err) {
        console.error(
          '[EduVerse] Notes generation failed:',
          err
        );

        setError(
          getErrorMessage(
            err,
            'Failed to generate study notes.'
          )
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      activeResponse,
      educationLevel,
      language,
      saveNote,
    ]);

  /* =======================================================
     START QUIZ
  ======================================================= */

  const startQuizForTopic =
    useCallback(
      async (topic: string) => {
        const cleanTopic =
          topic.trim();

        if (!cleanTopic) {
          return;
        }

        setIsLoading(true);
        setError(null);

        try {
          const quiz =
            await generateQuizApi(
              cleanTopic,
              educationLevel,
              language,
              5
            );

          if (
            !quiz ||
            !Array.isArray(
              quiz.questions
            ) ||
            quiz.questions.length === 0
          ) {
            throw new Error(
              'The AI did not return valid quiz questions.'
            );
          }

          setActiveQuiz({
            topic:
              quiz.topic ||
              cleanTopic,
            questions:
              quiz.questions,
          });

          setCurrentView(
            'quiz'
          );
        } catch (err) {
          console.error(
            '[EduVerse] Quiz generation failed:',
            err
          );

          setError(
            getErrorMessage(
              err,
              'Failed to generate quiz. Please try again.'
            )
          );
        } finally {
          setIsLoading(false);
        }
      },
      [
        educationLevel,
        language,
      ]
    );

  /* =======================================================
     RECORD QUIZ RESULT
  ======================================================= */

  const recordQuizResult =
    useCallback(
      (result: QuizResult) => {
        setQuizHistory(previous => {
          const updated = [
            result,
            ...previous,
          ].slice(0, 50);

          writeStorage(
            STORAGE_KEYS.QUIZ_HISTORY,
            updated
          );

          return updated;
        });

        setStats(previous => {
          const previousCount =
            previous.quizzesTakenCount;

          const newCount =
            previousCount + 1;

          const newAverage =
            Math.round(
              (
                previous.averageQuizScore *
                  previousCount +
                result.percentage
              ) / newCount
            );

          const updated = {
            ...previous,
            quizzesTakenCount:
              newCount,
            averageQuizScore:
              newAverage,
            studyStreakDays:
              Math.max(
                previous.studyStreakDays,
                1
              ),
          };

          writeStorage(
            STORAGE_KEYS.STATS,
            updated
          );

          return updated;
        });
      },
      []
    );

  /* =======================================================
     CLEAR SEARCH HISTORY
  ======================================================= */

  const clearHistory =
    useCallback(() => {
      setRecentSearches([]);

      removeStorage(
        STORAGE_KEYS.HISTORY
      );
    }, []);

  /* =======================================================
     MEMOIZED CONTEXT VALUE
  ======================================================= */

  const contextValue =
    useMemo<AppContextType>(
      () => ({
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
        clearHistory,
      }),
      [
        currentView,
        educationLevel,
        language,
        responseStyle,
        responseMode,
        activeQuery,
        activeResponse,
        isLoading,
        error,
        handleAskQuestion,
        savedNotes,
        saveNote,
        deleteNote,
        bookmarkNote,
        generateNotesForActiveTopic,
        activeQuiz,
        quizHistory,
        recordQuizResult,
        startQuizForTopic,
        isDarkMode,
        toggleDarkMode,
        stats,
        recentSearches,
        clearHistory,
      ]
    );

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <AppContext.Provider
      value={contextValue}
    >
      {children}
    </AppContext.Provider>
  );
};

/* =========================================================
   USE APP HOOK
========================================================= */

export const useApp = (): AppContextType => {
  const context =
    useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used inside an AppProvider.'
    );
  }

  return context;
};