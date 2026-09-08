import {
  StructuredEducationalResponse,
  StudyNote,
  QuizQuestion,
  EducationLevel,
  SupportedLanguage,
  ResponseStyle,
  ResponseMode
} from '../types';

export interface LearnApiParams {
  query: string;
  language: SupportedLanguage;
  educationLevel: EducationLevel;
  responseStyle: ResponseStyle;
  responseMode?: ResponseMode;
  tonePrompt?: string;
  conversationHistory?: {
    role: 'user' | 'assistant';
    content: string;
  }[];
}

/**
 * ============================================================
 * 1. EDUCATIONAL LEARNING API
 * ============================================================
 */
export async function fetchEducationalResponse(
  params: LearnApiParams
): Promise<StructuredEducationalResponse> {
  const query = params.query.trim();

  if (!query) {
    throw new Error('Please enter a question before asking EduVerse AI.');
  }

  try {
    const response = await fetch('/api/learn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        query,
        language: params.language,
        educationLevel: params.educationLevel,
        responseStyle: params.responseStyle,
        responseMode: params.responseMode ?? 'comprehensive',
        tonePrompt: params.tonePrompt ?? '',
        conversationHistory: params.conversationHistory ?? [],
      })
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const serverMessage =
        payload && typeof payload.error === 'string'
          ? payload.error
          : `Server responded with status ${response.status}`;

      throw new Error(serverMessage);
    }

    if (!payload || typeof payload !== 'object') {
      throw new Error(
        'EduVerse AI returned an empty or invalid learning response.'
      );
    }

    const result = payload as StructuredEducationalResponse;

    if (
      typeof result.quickAnswer !== 'string' ||
      typeof result.simpleExplanation !== 'string' ||
      typeof result.detailedExplanation !== 'string'
    ) {
      throw new Error(
        'EduVerse AI returned an incomplete educational response. Please try asking again.'
      );
    }

    return {
      ...result,
      id:
        typeof result.id === 'string' && result.id
          ? result.id
          : `resp-${Date.now()}`,
      query,
      timestamp:
        typeof result.timestamp === 'string'
          ? result.timestamp
          : new Date().toISOString(),
      language: params.language,
      educationLevel: params.educationLevel,
      responseStyle: params.responseStyle,
      keyPoints: Array.isArray(result.keyPoints) ? result.keyPoints : [],
      commonMistakes: Array.isArray(result.commonMistakes)
        ? result.commonMistakes
        : [],
      quickRevisionCards: Array.isArray(result.quickRevisionCards)
        ? result.quickRevisionCards
        : [],
      practiceQuestions: Array.isArray(result.practiceQuestions)
        ? result.practiceQuestions
        : [],
      examTips: Array.isArray(result.examTips) ? result.examTips : [],
      interviewQuestions: Array.isArray(result.interviewQuestions)
        ? result.interviewQuestions
        : []
    };
  } catch (error) {
    console.error('[EduVerse AI] Learning request failed:', error);
    throw error instanceof Error
      ? error
      : new Error(
          'Unable to generate educational explanation. Please check your connection and try again.'
        );
  }
}

/**
 * ============================================================
 * 2. STUDY NOTES API
 * ============================================================
 */
export async function generateStudyNotesApi(
  topic: string,
  educationLevel: EducationLevel,
  language: SupportedLanguage,
  customFocus?: string
): Promise<StudyNote> {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic: topic.trim(),
      educationLevel,
      language,
      customFocus
    })
  });

  if (!res.ok) {
    const errorPayload = await res.json().catch(() => null);
    throw new Error(
      errorPayload?.error || `Failed to generate study notes (Status ${res.status})`
    );
  }

  return await res.json();
}

/**
 * ============================================================
 * 3. QUIZ API
 * ============================================================
 */
export async function generateQuizApi(
  topic: string,
  educationLevel: EducationLevel,
  language: SupportedLanguage,
  questionCount: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<{
  topic: string;
  questions: QuizQuestion[];
}> {
  const res = await fetch('/api/quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic: topic.trim(),
      educationLevel,
      language,
      questionCount,
      difficulty
    })
  });

  if (!res.ok) {
    const errorPayload = await res.json().catch(() => null);
    throw new Error(
      errorPayload?.error || `Failed to generate quiz (Status ${res.status})`
    );
  }

  return await res.json();
}

/**
 * ============================================================
 * 4. CODE EXECUTION & ANALYSIS API
 * ============================================================
 */
export async function runCodeApi(
  code: string,
  language: string,
  input: string = ''
): Promise<{
  success: boolean;
  output: string;
  executionTimeMs: number;
  sandboxType?: string;
}> {
  try {
    const res = await fetch('/api/run-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code,
        language,
        input
      })
    });

    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      output: `Connection error running code: ${err.message}`,
      executionTimeMs: 0,
      sandboxType: 'Connection Error'
    };
  }
}

/**
 * ============================================================
 * 5. DOCUMENT INTELLIGENCE API
 * ============================================================
 */
export async function analyzeDocumentApi(
  text: string,
  fileName: string,
  action: string,
  language: SupportedLanguage,
  educationLevel: EducationLevel
) {
  const res = await fetch('/api/document-insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      fileName,
      action,
      language,
      educationLevel
    })
  });

  if (!res.ok) {
    const errorPayload = await res.json().catch(() => null);
    throw new Error(
      errorPayload?.error || `Failed to analyze document (Status ${res.status})`
    );
  }

  return await res.json();
}