import { EducationLevelConfig, SupportedLanguage, ResponseStyle, ResponseMode } from '../types';

export const EDUCATION_LEVELS: EducationLevelConfig[] = [
  {
    id: 'primary',
    label: 'Primary / Nursery',
    emoji: '👶',
    tag: 'Ages 4-10',
    description: 'Playful metaphors, story-like explanations, simple words, no complex formulas.',
    tonePrompt: 'Explain like you are teaching a curious 8-year-old child. Use colorful metaphors, fun cartoonish analogies, enthusiastic tone, simple words, and zero confusing academic jargon.'
  },
  {
    id: 'middle_school',
    label: 'Middle School',
    emoji: '📘',
    tag: 'Classes 6–8',
    description: 'Foundational concepts, everyday life examples, clear definitions, intro to scientific terms.',
    tonePrompt: 'Explain for a middle school student (Classes 6-8). Build solid conceptual understanding with relatable everyday examples, clear structured steps, and accessible science/math terminology.'
  },
  {
    id: 'high_school',
    label: 'High School',
    emoji: '🎓',
    tag: 'Classes 9–12',
    description: 'Board exam alignment, formal definitions, formulas, derivations, diagrams, and exam scoring tips.',
    tonePrompt: 'Explain for high school learners (Classes 9-12 / CBSE / ICSE / State Boards / AP). Include rigorous definitions, key formulas, conceptual derivations, neat diagrams, exam tips, and common scoring pitfalls.'
  },
  {
    id: 'college_engineering',
    label: 'College / Engineering',
    emoji: '💻',
    tag: 'B.Tech / CS / STEM',
    description: 'System architecture, algorithms, rigorous proofs, industry context, trade-offs, and optimization.',
    tonePrompt: 'Explain for undergraduate engineering and computer science students. Focus on underlying architectures, algorithms, data structures, hardware/OS interactions, complexity analysis (Big-O), design trade-offs, and real-world system implementations.'
  },
  {
    id: 'medical',
    label: 'Medical & Healthcare',
    emoji: '🩺',
    tag: 'MBBS / Nursing / Bio',
    description: 'Anatomy, physiological pathways, clinical relevance, biochemical mechanisms, and pathology.',
    tonePrompt: 'Explain for medical and life-sciences students (MBBS/Bio/Nursing). Focus on anatomical structures, physiological pathways, biochemical steps, clinical significance, etiology, and histological details while clarifying this is educational material.'
  },
  {
    id: 'commerce',
    label: 'Commerce & Finance',
    emoji: '📊',
    tag: 'CA / MBA / Economics',
    description: 'Financial models, balance sheet impacts, market mechanics, case studies, and taxation logic.',
    tonePrompt: 'Explain for commerce, business, accounting, and MBA students. Use balance sheet analogies, debit/credit flow, cash flow implications, economic market dynamics, and corporate real-world case studies.'
  },
  {
    id: 'law',
    label: 'Law & Governance',
    emoji: '⚖️',
    tag: 'LLB / Legal / Civics',
    description: 'Statutory interpretations, constitutional principles, case law precedents, and legal reasoning.',
    tonePrompt: 'Explain for law students (LLB/Civics/Judiciary). Use legal doctrines, statutory interpretations, fundamental constitutional principles, case precedents, and structured IRAC legal reasoning.'
  },
  {
    id: 'professional',
    label: 'Working Professional',
    emoji: '💼',
    tag: 'Industry & Career',
    description: 'Executive summaries, ROI, production best practices, architecture blueprints, interview readiness.',
    tonePrompt: 'Explain for working tech/business professionals. Emphasize production reliability, architectural trade-offs, scalability, cost-benefit analysis, executive takeaways, and staff-level interview expectations.'
  },
  {
    id: 'advanced',
    label: 'Research & Advanced',
    emoji: '🧠',
    tag: 'Masters / PhD / Deep',
    description: 'State-of-the-art research, mathematical rigor, theoretical nuances, and edge frontiers.',
    tonePrompt: 'Explain with academic research rigor. Provide mathematical formulations, theoretical nuances, references to foundational papers, and cutting-edge state of the art.'
  }
];

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  region: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'English', name: 'English', nativeName: 'English', region: 'Global' },
  { code: 'Hinglish', name: 'Hinglish', nativeName: 'Hindi + English', region: 'India (Conversational)' },
  { code: 'Hindi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India' },
  { code: 'Bengali', name: 'Bengali', nativeName: 'বাংলা', region: 'India / Bangladesh' },
  { code: 'Tamil', name: 'Tamil', nativeName: 'தமிழ்', region: 'India / Global' },
  { code: 'Telugu', name: 'Telugu', nativeName: 'తెలుగు', region: 'India' },
  { code: 'Marathi', name: 'Marathi', nativeName: 'मराठी', region: 'India' },
  { code: 'Gujarati', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'India' },
  { code: 'Kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'India' },
  { code: 'Malayalam', name: 'Malayalam', nativeName: 'മലയാളം', region: 'India' },
  { code: 'Punjabi', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'India' },
  { code: 'Urdu', name: 'Urdu', nativeName: 'اردو', region: 'India / Global' },
  { code: 'Spanish', name: 'Spanish', nativeName: 'Español', region: 'Global' },
  { code: 'French', name: 'French', nativeName: 'Français', region: 'Global' },
  { code: 'German', name: 'German', nativeName: 'Deutsch', region: 'Global' }
];

export const RESPONSE_STYLES: { id: ResponseStyle; label: string; description: string; icon: string }[] = [
  { id: 'simple', label: 'Simple Language', description: 'Crystal clear, everyday vocabulary', icon: 'Sparkles' },
  { id: 'normal', label: 'Balanced', description: 'Standard educational clarity', icon: 'BookOpen' },
  { id: 'technical', label: 'Technical & In-Depth', description: 'Precise terminology and technical depth', icon: 'Cpu' },
  { id: 'exam_oriented', label: 'Exam-Oriented', description: 'Key points, definitions & scoring tips', icon: 'Target' }
];

export const RESPONSE_MODES: { id: ResponseMode; label: string; description: string; icon: string }[] = [
  { id: 'comprehensive', label: 'Full Learning Experience', description: 'Analogy + Deep Dive + Visual + Notes + Quiz', icon: 'GraduationCap' },
  { id: 'quick', label: 'Quick Summary', description: 'Fast 2-minute crystal clear explanation', icon: 'Zap' },
  { id: 'notes', label: 'Study Notes & Cheat Sheet', description: 'Structured notes ready for revision & exams', icon: 'FileText' },
  { id: 'quiz', label: 'Interactive Quiz', description: 'Self-assessment with instant feedback', icon: 'HelpCircle' },
  { id: 'code', label: 'Code Lab & Algorithm', description: 'Code breakdown, complexity, and live sandbox', icon: 'Code' },
  { id: 'visual', label: 'Visual Diagram & Flowchart', description: 'Interactive visual architecture and process maps', icon: 'Network' },
  { id: 'compare', label: 'Deep Comparison', description: 'Side-by-side breakdown with comparison matrix', icon: 'Columns' }
];

export const SUGGESTED_PROMPTS = [
  'Explain photosynthesis with a visual flow',
  'TCP vs UDP with real-world courier analogy',
  'C++ code for Binary Search with line-by-line breakdown',
  'Explain Nephron structure and filtration mechanism',
  'Explain Newton’s 3 laws with everyday examples',
  'What is the difference between RAM and ROM?',
  'Explain Database Normalization (1NF to 3NF)',
  'Explain how JavaScript Promises and Async/Await work'
];

export const FEATURE_TAGS = [
  { title: 'Multi-Level Explanations', desc: 'Adapts dynamically from 8-year-old child to PhD researcher.' },
  { title: 'Visual Learning Engine', desc: 'Interactive SVG flowcharts, process timelines, and system maps.' },
  { title: '12+ Native Languages', desc: 'True native multilingual generation including Hinglish, Hindi, Tamil & more.' },
  { title: 'Code Lab Sandbox', desc: 'Syntax highlighting, line-by-line breakdowns, and complexity bounds.' },
  { title: 'Exam-Ready Study Notes', desc: 'Instant cheat sheets, formulas, key points, and PDF export.' },
  { title: 'Smart Self-Quiz Arena', desc: 'Adaptive MCQs, instant diagnostics, and weak-topic recommendations.' }
];
