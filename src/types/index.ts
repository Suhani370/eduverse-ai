export type EducationLevel =
  | 'primary'
  | 'middle_school'
  | 'high_school'
  | 'college_engineering'
  | 'medical'
  | 'commerce'
  | 'law'
  | 'professional'
  | 'advanced'
  | 'custom';

export interface EducationLevelConfig {
  id: EducationLevel;
  label: string;
  emoji: string;
  tag: string;
  description: string;
  tonePrompt: string;
}

export type SupportedLanguage =
  | 'English'
  | 'Hindi'
  | 'Hinglish'
  | 'Bengali'
  | 'Tamil'
  | 'Telugu'
  | 'Marathi'
  | 'Gujarati'
  | 'Kannada'
  | 'Malayalam'
  | 'Punjabi'
  | 'Urdu'
  | 'Spanish'
  | 'French'
  | 'German';

export type ResponseStyle = 'simple' | 'normal' | 'technical' | 'exam_oriented';

export type ResponseMode =
  | 'comprehensive'
  | 'quick'
  | 'notes'
  | 'quiz'
  | 'code'
  | 'visual'
  | 'compare';

export interface VisualNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  color?: string;
  details?: string;
}

export interface VisualEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface VisualizationData {
  type: 'flowchart' | 'process' | 'comparison' | 'hierarchy' | 'timeline' | 'cycle' | 'architecture';
  title: string;
  description?: string;
  steps?: {
    stepNumber: number;
    title: string;
    description: string;
    analogy?: string;
  }[];
  nodes?: VisualNode[];
  edges?: VisualEdge[];
  comparisonColumns?: {
    headerA: string;
    headerB: string;
    rows: {
      parameter: string;
      valueA: string;
      valueB: string;
    }[];
  };
}

export interface CodeExplanationBlock {
  language: string;
  code: string;
  algorithmName?: string;
  summary: string;
  lineByLine: {
    lineRange: string;
    explanation: string;
  }[];
  timeComplexity: string;
  spaceComplexity: string;
  inputExample?: string;
  outputExample?: string;
  edgeCases: string[];
  commonMistakes: string[];
}

export interface ComparisonBlock {
  itemA: string;
  itemB: string;
  analogy: string;
  summary: string;
  table: {
    feature: string;
    itemAValue: string;
    itemBValue: string;
    whyItMatters: string;
  }[];
  whenToUseA: string[];
  whenToUseB: string[];
  realWorldExample: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'true_false' | 'short_answer' | 'code_output';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topicTag?: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  userAnswers: Record<string, string | number>;
  weakTopics: string[];
  revisionRecommendations: string[];
  completedAt: string;
}

export interface StructuredEducationalResponse {
  id: string;
  query: string;
  timestamp: string;
  language: SupportedLanguage;
  educationLevel: EducationLevel;
  responseStyle: ResponseStyle;
  
  // Structured Sections
  quickAnswer: string;
  simpleExplanation: string;
  realWorldAnalogy: {
    analogy: string;
    explanation: string;
    targetContext: string;
  };
  detailedExplanation: string;
  
  // Optional Deep Modules
  visualization?: VisualizationData;
  codeBlock?: CodeExplanationBlock;
  comparison?: ComparisonBlock;
  
  keyPoints: string[];
  commonMistakes: {
    mistake: string;
    correction: string;
  }[];
  quickRevisionCards: {
    front: string;
    back: string;
  }[];
  practiceQuestions: string[];
  
  examTips?: string[];
  interviewQuestions?: string[];
  medicalDisclaimer?: boolean;
  citations?: {
    title: string;
    uri: string;
  }[];
}

export interface StudyNote {
  id: string;
  topic: string;
  subject?: string;
  educationLevel: EducationLevel;
  language: SupportedLanguage;
  createdAt: string;
  tags: string[];
  contentMarkdown: string;
  keyPoints: string[];
  formulasOrEquations?: string[];
  examTips: string[];
  summary: string;
  isBookmarked?: boolean;
}

export interface DocumentInfo {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  pageCount?: number;
  extractedText: string;
  uploadedAt: string;
  summary?: string;
}

export interface UserStats {
  topicsLearnedCount: number;
  quizzesTakenCount: number;
  averageQuizScore: number;
  studyStreakDays: number;
  savedNotesCount: number;
}
