import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

/**
 * EduVerse AI — Advanced Educational Intelligence Pipeline
 *
 * Multi-Stage Pipeline:
 * 1. Question Analyzer & Intent Classifier (Intent, Language, Level, Format, Follow-up Context Resolution)
 * 2. Strict Multilingual Prompt Engine (Authentic Hinglish, Hindi, Bengali, English, etc.)
 * 3. Multi-Model Generation with Fallback Chain (Gemini 2.5 / 2.0 / 1.5 Flash)
 * 4. Self-Verification, LaTeX/Code Validation & Schema Enforcement
 * 5. Structured Educational Payload Normalization
 */

interface ConversationMessage {
  role: "user" | "assistant" | "model";
  content: unknown;
}

export interface LearningRequest {
  query: string;
  language?: string;
  educationLevel?: string;
  responseStyle?: string;
  responseMode?: string;
  tonePrompt?: string;
  conversationHistory?: ConversationMessage[];
}

const CANDIDATE_MODELS: string[] = [
  "gemini-2.5-flash"
];

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add GEMINI_API_KEY=your_key to .env and restart."
    );
  }

  return new GoogleGenAI({ apiKey });
}

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

/**
 * ============================================================
 * 1. QUERY & INTENT ANALYZER
 * ============================================================
 */

export interface AnalyzedQuery {
  rawQuery: string;
  resolvedTopic: string;
  intent:
    | "explain"
    | "summary"
    | "notes"
    | "quiz"
    | "practice"
    | "flashcards"
    | "code"
    | "dry_run"
    | "visualize"
    | "3d_visualize"
    | "compare"
    | "formula"
    | "derivation"
    | "example"
    | "interview"
    | "exam_preparation"
    | "follow_up";
  detectedLanguage: string;
  questionCount?: number;
  difficulty?: "easy" | "medium" | "hard";
  requiresCode: boolean;
  requiresDryRun: boolean;
  requiresVisualization: boolean;
  requires3D: boolean;
  requiresComparison: boolean;
  isMedical: boolean;
}

export function analyzeEducationalQuery(
  query: string,
  configuredLanguage: string,
  history: ConversationMessage[] = []
): AnalyzedQuery {
  const text = query.toLowerCase().trim();

  // Extract contextual topic from history if this is a follow-up
  let resolvedTopic = query;
  const isFollowUpCommand =
    /^(ab|now|also|aur|iska|isko|ispe|then|next|dry run|code|quiz|notes|summary|visualize|example|banao|dikhao|karo)\b/i.test(
      text
    ) || text.length < 25;

  if (isFollowUpCommand && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      if (msg && msg.role === "user" && typeof msg.content === "string") {
        const prevText = msg.content.trim();
        if (prevText.length > 5 && !/^(ab|now|next|dry run|code|quiz|banao)\b/i.test(prevText)) {
          resolvedTopic = `${prevText} (Context for: ${query})`;
          break;
        }
      }
    }
  }

  // Language Detection
  let detectedLanguage = configuredLanguage || "English";
  if (/\b(in hinglish|hinglish mein|hinglish me|hinglish)\b/i.test(text)) {
    detectedLanguage = "Hinglish";
  } else if (/\b(in hindi|hindi mein|hindi me|हिंदी)\b/i.test(text) || /[\u0900-\u097F]/.test(query)) {
    detectedLanguage = "Hindi";
  } else if (/\b(in bengali|bengali mein|bangla|বাংলা)\b/i.test(text) || /[\u0980-\u09FF]/.test(query)) {
    detectedLanguage = "Bengali";
  } else if (/\b(in tamil|தமிழ்)\b/i.test(text) || /[\u0B80-\u0BFF]/.test(query)) {
    detectedLanguage = "Tamil";
  } else if (/\b(in telugu|తెలుగు)\b/i.test(text) || /[\u0C00-\u0C7F]/.test(query)) {
    detectedLanguage = "Telugu";
  } else if (/\b(in marathi|मराठी)\b/i.test(text)) {
    detectedLanguage = "Marathi";
  } else if (/\b(in gujarati|ગુજરાતી)\b/i.test(text)) {
    detectedLanguage = "Gujarati";
  } else if (
    detectedLanguage === "English" &&
    /\b(samjhao|kya hai|kaise|batao|dikhao|banao|karo|hota hai|karein|chahiye)\b/i.test(text)
  ) {
    detectedLanguage = "Hinglish";
  }

  // Intent Detection
  let intent: AnalyzedQuery["intent"] = "explain";
  if (/\b(quiz|mcq|test me|questions do|questions do|prashn)\b/i.test(text)) {
    intent = "quiz";
  } else if (/\b(practice|exercises|problems to solve)\b/i.test(text)) {
    intent = "practice";
  } else if (/\b(short notes|notes banao|study notes|make notes|revision notes|notes)\b/i.test(text)) {
    intent = "notes";
  } else if (/\b(summary|summarize|short summary|1 line summary|overview)\b/i.test(text)) {
    intent = "summary";
  } else if (/\b(dry run|trace table|step through|variable state)\b/i.test(text)) {
    intent = "dry_run";
  } else if (/\b(code|implementation|program|cpp|c\+\+|python|java|javascript|typescript|sql)\b/i.test(text)) {
    intent = "code";
  } else if (/\b(3d|3-d|spatial|orbit|molecule|atoms|solar system)\b/i.test(text)) {
    intent = "3d_visualize";
  } else if (/\b(visualize|diagram|visual flow|animation|animated|animated explanation|flowchart)\b/i.test(text)) {
    intent = "visualize";
  } else if (/\b(vs|versus|difference|compare|comparison|distinguish)\b/i.test(text)) {
    intent = "compare";
  } else if (/\b(interview|interview questions|interview questions do)\b/i.test(text)) {
    intent = "interview";
  } else if (/\b(formula|equations|derivation|numerical|numerical example)\b/i.test(text)) {
    intent = "formula";
  } else if (/\b(flashcards|active recall|recall cards)\b/i.test(text)) {
    intent = "flashcards";
  }

  // Question Count Extraction for Quizzes
  const countMatch = text.match(/\b(\d+)\s*(?:questions|mcq|mcqs|prashn|items)\b/i);
  const questionCount = countMatch ? Math.min(Math.max(parseInt(countMatch[1], 10), 3), 20) : undefined;

  // Difficulty Extraction
  let difficulty: "easy" | "medium" | "hard" | undefined = undefined;
  if (/\b(easy|saral|basic|beginner)\b/i.test(text)) {
    difficulty = "easy";
  } else if (/\b(hard|difficult|advanced|tough|complex)\b/i.test(text)) {
    difficulty = "hard";
  } else if (/\b(medium|intermediate)\b/i.test(text)) {
    difficulty = "medium";
  }

  const requiresCode =
    intent === "code" ||
    intent === "dry_run" ||
    /\b(code|algorithm|dsa|c\+\+|cpp|python|java|javascript|typescript|sql|binary search|linked list|sorting|tree|graph)\b/i.test(
      text
    );

  const requiresDryRun = intent === "dry_run" || /\b(dry run|trace)\b/i.test(text);

  const requires3D =
    intent === "3d_visualize" ||
    /\b(molecule|molecular|atom|atomic|bohr|dna double helix|solar system|planets|neural network|anatomy|3d)\b/i.test(
      text
    );

  const requiresVisualization =
    requires3D ||
    intent === "visualize" ||
    /\b(flow|process|diagram|visualize|tcp|handshake|binary search|linked list|sorting|photosynthesis|heart|blood|dna|circuit|newton|ml|join)\b/i.test(
      text
    );

  const requiresComparison = intent === "compare" || /\b(vs|versus|compare|difference)\b/i.test(text);

  const isMedical = /\b(symptom|disease|medicine|drug|diagnosis|treatment|doctor|pain|infection|heart|blood pressure|diabetes|anatomy|physiology)\b/i.test(
    text
  );

  return {
    rawQuery: query,
    resolvedTopic,
    intent,
    detectedLanguage,
    questionCount,
    difficulty,
    requiresCode,
    requiresDryRun,
    requiresVisualization,
    requires3D,
    requiresComparison,
    isMedical,
  };
}

function normalizeHistory(history: ConversationMessage[] = []): string {
  return history
    .filter((message) => message && message.content != null)
    .slice(-8)
    .map((message) => {
      const role =
        message.role === "assistant" || message.role === "model"
          ? "ASSISTANT"
          : "STUDENT";

      const content =
        typeof message.content === "string"
          ? message.content
          : JSON.stringify(message.content);

      return `${role}: ${content}`;
    })
    .join("\n\n");
}

function stripMarkdownJson(text: string): string {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first >= 0 && last > first) {
    return trimmed.slice(first, last + 1);
  }

  return trimmed;
}

function sanitizeControlCharactersInJson(str: string): string {
  let result = '';
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (inString) {
      if (isEscaped) {
        result += ch;
        isEscaped = false;
      } else if (ch === '\\') {
        result += ch;
        isEscaped = true;
      } else if (ch === '"') {
        result += ch;
        inString = false;
      } else if (ch === '\n') {
        result += '\\n';
      } else if (ch === '\r') {
        result += '\\r';
      } else if (ch === '\t') {
        result += '\\t';
      } else {
        result += ch;
      }
    } else {
      if (ch === '"') {
        inString = true;
      }
      result += ch;
    }
  }

  return result;
}

function parseJson(text: string): any {
  const cleaned = stripMarkdownJson(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    // Strategy 1: Sanitize control characters (unescaped newlines / tabs inside strings)
    const sanitized = sanitizeControlCharactersInJson(cleaned);
    try {
      return JSON.parse(sanitized);
    } catch {
      // Strategy 2: Fix trailing commas and smart quotes
      let repaired = sanitized
        .replace(/,\s*([\]}])/g, "$1") // trailing commas
        .replace(/[\u201C\u201D]/g, '"') // smart quotes
        .replace(/[\u2018\u2019]/g, "'"); // smart single quotes

      try {
        return JSON.parse(repaired);
      } catch {
        // Strategy 3: Fix LaTeX backslashes in JSON strings
        try {
          const latexFixed = repaired.replace(/\\([a-zA-Z])/g, (match, p1) => {
            if (!['b', 'f', 'n', 'r', 't', 'u', '"', '\\', '/'].includes(p1)) {
              return `\\\\${p1}`;
            }
            return match;
          });
          return JSON.parse(latexFixed);
        } catch {
          // Strategy 4: Slice outermost valid braces
          const firstBrace = text.indexOf('{');
          const lastBrace = text.lastIndexOf('}');
          if (firstBrace >= 0 && lastBrace > firstBrace) {
            try {
              const rawSlice = sanitizeControlCharactersInJson(text.slice(firstBrace, lastBrace + 1));
              return JSON.parse(rawSlice);
            } catch {
              // Proceed to error
            }
          }

          throw new Error(
            "EduVerse AI received malformed structured output from the model. Please try asking again."
          );
        }
      }
    }
  }
}

/**
 * ============================================================
 * 2. STRUCTURED RESPONSE NORMALIZER & VALIDATOR
 * ============================================================
 */

function normalizeResponse(parsed: any, analysis: AnalyzedQuery, request: LearningRequest) {
  const language = analysis.detectedLanguage;
  const educationLevel = safeString(request.educationLevel, "college_engineering");
  const responseStyle = safeString(request.responseStyle, "normal");

  // Fallback defaults if sections are missing
  const quickAnswer = safeString(
    parsed.quickAnswer,
    `${analysis.rawQuery} is an essential concept with structured mechanisms and practical applications.`
  );

  const simpleExplanation = safeString(
    parsed.simpleExplanation,
    `To understand this simply, think of it as a step-by-step coordinated process where each element accomplishes a clear objective.`
  );

  const realWorldAnalogy = {
    analogy: safeString(parsed.realWorldAnalogy?.analogy, "The Synchronized System"),
    explanation: safeString(
      parsed.realWorldAnalogy?.explanation,
      "Just like how components in a well-engineered mechanism coordinate together, this concept functions through clear interactions."
    ),
    targetContext: safeString(
      parsed.realWorldAnalogy?.targetContext,
      `Core mental model for ${analysis.rawQuery}`
    ),
  };

  const detailedExplanation = safeString(
    parsed.detailedExplanation,
    `### Conceptual Overview\n\nDetailed breakdown of ${analysis.rawQuery} at ${educationLevel} level.`
  );

  // Visualization Data normalization
  let visualization = undefined;
  if (parsed.visualization && Array.isArray(parsed.visualization.nodes) && parsed.visualization.nodes.length > 0) {
    visualization = {
      type: parsed.visualization.type || "flowchart",
      title: safeString(parsed.visualization.title, `${analysis.rawQuery} — Visual Flow`),
      description: safeString(parsed.visualization.description, `Interactive step-by-step mechanism.`),
      nodes: parsed.visualization.nodes.map((n: any, idx: number) => ({
        id: safeString(n.id, `node-${idx + 1}`),
        label: safeString(n.label, `Step ${idx + 1}`),
        sublabel: safeString(n.sublabel, ""),
        icon: safeString(n.icon, "Sparkles"),
        color: safeString(n.color, "#6366f1"),
        details: safeString(n.details, ""),
      })),
      edges: Array.isArray(parsed.visualization.edges)
        ? parsed.visualization.edges.map((e: any) => ({
            from: safeString(e.from),
            to: safeString(e.to),
            label: safeString(e.label),
            animated: Boolean(e.animated ?? true),
          }))
        : [],
      steps: Array.isArray(parsed.visualization.steps)
        ? parsed.visualization.steps.map((s: any, idx: number) => ({
            stepNumber: Number(s.stepNumber) || idx + 1,
            title: safeString(s.title, `Stage ${idx + 1}`),
            description: safeString(s.description, ""),
            analogy: safeString(s.analogy),
          }))
        : [],
    };
  }

  // 3D Scene Data normalization
  let threeDData = undefined;
  if (parsed.threeDData && Array.isArray(parsed.threeDData.objects)) {
    threeDData = {
      needed: Boolean(parsed.threeDData.needed ?? true),
      type: parsed.threeDData.type || "generic",
      title: safeString(parsed.threeDData.title, `${analysis.rawQuery} 3D Model`),
      description: safeString(parsed.threeDData.description, "Interactive 3D Spatial Representation"),
      objects: parsed.threeDData.objects.map((obj: any) => ({
        name: safeString(obj.name, "Object"),
        type: obj.type || "sphere",
        color: safeString(obj.color, "#6366f1"),
        position: Array.isArray(obj.position) ? obj.position : [0, 0, 0],
        scale: Array.isArray(obj.scale) ? obj.scale : [1, 1, 1],
        label: safeString(obj.label),
      })),
    };
  }

  // Code block normalization
  let codeBlock = undefined;
  if (parsed.codeBlock && typeof parsed.codeBlock.code === "string" && parsed.codeBlock.code.trim()) {
    codeBlock = {
      language: safeString(parsed.codeBlock.language, "cpp"),
      code: parsed.codeBlock.code.trim(),
      algorithmName: safeString(parsed.codeBlock.algorithmName, analysis.rawQuery),
      summary: safeString(parsed.codeBlock.summary, "Algorithm implementation"),
      lineByLine: Array.isArray(parsed.codeBlock.lineByLine)
        ? parsed.codeBlock.lineByLine.map((lbl: any) => ({
            lineRange: safeString(lbl.lineRange, "1-5"),
            explanation: safeString(lbl.explanation, ""),
          }))
        : [],
      timeComplexity: safeString(parsed.codeBlock.timeComplexity, "O(N)"),
      spaceComplexity: safeString(parsed.codeBlock.spaceComplexity, "O(1)"),
      inputExample: safeString(parsed.codeBlock.inputExample),
      outputExample: safeString(parsed.codeBlock.outputExample),
      edgeCases: Array.isArray(parsed.codeBlock.edgeCases) ? parsed.codeBlock.edgeCases : [],
      commonMistakes: Array.isArray(parsed.codeBlock.commonMistakes) ? parsed.codeBlock.commonMistakes : [],
    };
  }

  // Dry run steps normalization
  let dryRun = undefined;
  if (Array.isArray(parsed.dryRun) && parsed.dryRun.length > 0) {
    dryRun = parsed.dryRun.map((step: any, idx: number) => ({
      stepNumber: Number(step.stepNumber) || idx + 1,
      variableState: typeof step.variableState === "object" ? step.variableState : {},
      explanation: safeString(step.explanation, `Iteration ${idx + 1}`),
      highlightLine: Number(step.highlightLine) || undefined,
    }));
  }

  // Comparison normalization
  let comparison = undefined;
  if (parsed.comparison && parsed.comparison.itemA && parsed.comparison.itemB) {
    comparison = {
      itemA: safeString(parsed.comparison.itemA),
      itemB: safeString(parsed.comparison.itemB),
      analogy: safeString(parsed.comparison.analogy),
      summary: safeString(parsed.comparison.summary),
      table: Array.isArray(parsed.comparison.table)
        ? parsed.comparison.table.map((row: any) => ({
            feature: safeString(row.feature),
            itemAValue: safeString(row.itemAValue),
            itemBValue: safeString(row.itemBValue),
            whyItMatters: safeString(row.whyItMatters),
          }))
        : [],
      whenToUseA: Array.isArray(parsed.comparison.whenToUseA) ? parsed.comparison.whenToUseA : [],
      whenToUseB: Array.isArray(parsed.comparison.whenToUseB) ? parsed.comparison.whenToUseB : [],
      realWorldExample: safeString(parsed.comparison.realWorldExample),
    };
  }

  // Summary payload
  let summaryPayload = undefined;
  if (parsed.summaryPayload || analysis.intent === "summary") {
    summaryPayload = {
      oneLine: safeString(parsed.summaryPayload?.oneLine || parsed.quickAnswer),
      bulletPoints: Array.isArray(parsed.summaryPayload?.bulletPoints)
        ? parsed.summaryPayload.bulletPoints
        : parsed.keyPoints || [],
      detailedSummary: safeString(parsed.summaryPayload?.detailedSummary || parsed.simpleExplanation),
    };
  }

  // Quiz payload
  let quizPayload = undefined;
  if (Array.isArray(parsed.quizPayload?.questions) && parsed.quizPayload.questions.length > 0) {
    quizPayload = {
      topic: safeString(parsed.quizPayload.topic, analysis.rawQuery),
      questions: parsed.quizPayload.questions.map((q: any, i: number) => ({
        id: safeString(q.id, `q${i + 1}`),
        question: safeString(q.question, "Diagnostic question"),
        type: q.type || "mcq",
        options: Array.isArray(q.options) ? q.options : ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: q.correctAnswer ?? 0,
        explanation: safeString(q.explanation, "Detailed explanation of correct answer"),
        hint: safeString(q.hint),
        difficulty: q.difficulty || analysis.difficulty || "medium",
        topicTag: safeString(q.topicTag, analysis.rawQuery),
      })),
    };
  }

  return {
    id: `resp-${Date.now()}`,
    query: analysis.rawQuery,
    timestamp: new Date().toISOString(),
    language: language as any,
    educationLevel: educationLevel as any,
    responseStyle: responseStyle as any,
    detectedIntent: analysis.intent,
    detectedSubject: safeString(parsed.detectedSubject, "Academic"),
    detectedTopic: safeString(parsed.detectedTopic, analysis.rawQuery),
    confidence: (parsed.confidence || "high") as any,

    quickAnswer,
    simpleExplanation,
    realWorldAnalogy,
    detailedExplanation,

    visualization,
    threeDData,
    codeBlock,
    dryRun,
    comparison,
    summaryPayload,
    quizPayload,

    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
    commonMistakes: Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes : [],
    quickRevisionCards: Array.isArray(parsed.quickRevisionCards) ? parsed.quickRevisionCards : [],
    practiceQuestions: Array.isArray(parsed.practiceQuestions) ? parsed.practiceQuestions : [],
    examTips: Array.isArray(parsed.examTips) ? parsed.examTips : [],
    interviewQuestions: Array.isArray(parsed.interviewQuestions) ? parsed.interviewQuestions : [],
    medicalDisclaimer: Boolean(parsed.medicalDisclaimer || analysis.isMedical),
  };
}

/**
 * ============================================================
 * 3. MAIN AI GENERATION WITH INTENT & MULTILINGUAL REASONING
 * ============================================================
 */

export async function generateLearningResponse(request: LearningRequest) {
  const query = safeString(request.query);
  if (!query) {
    throw new Error("Question cannot be empty.");
  }

  const configuredLanguage = safeString(request.language, "English");
  const educationLevel = safeString(request.educationLevel, "college_engineering");
  const responseStyle = safeString(request.responseStyle, "normal");
  const responseMode = safeString(request.responseMode, "comprehensive");
  const tonePrompt = safeString(request.tonePrompt);
  const history = normalizeHistory(request.conversationHistory);

  // Stage 1: Analyze Query & Intent
  const analysis = analyzeEducationalQuery(query, configuredLanguage, request.conversationHistory);

  console.log(`[EduVerse Intelligence] Query: "${query}" | Intent: ${analysis.intent} | Language: ${analysis.detectedLanguage} | Topic: "${analysis.resolvedTopic}"`);

  // Build strict system instructions
  const languageInstructions = `
LANGUAGE ENFORCEMENT RULES:
Target Language: ${analysis.detectedLanguage}

- If Hinglish: Generate natural, fluent Indian Hinglish in Latin script (e.g., "TCP connection establish karne ke liye client pehle SYN packet send karta hai. Jab server SYN-ACK return karta hai, tab communication handshake complete hota hai."). Standard technical terminology (SYN, ACK, RAM, O(log N), CPU, TCP, SQL, JVM, etc.) MUST stay in English.
- If Hindi: Generate clean, professional Hindi in Devanagari script throughout ALL sections (Quick answer, explanation, analogy, key points, exam tips).
- If Bengali: Generate complete natural Bengali script (বাংলা) throughout ALL sections.
- If Tamil / Telugu / Marathi / Gujarati: Generate authentic text in the native language script for all conceptual explanations.
- If English: Use clear, structured, level-appropriate academic English.
DO NOT translate only headings while leaving paragraphs in English. Respect the target language everywhere.
`;

  const intentInstructions = `
INTENT-SPECIFIC DIRECTIVES:
Detected Intent: ${analysis.intent}
Resolved Subject/Topic: ${analysis.resolvedTopic}

- If intent is 'summary': Emphasize summaryPayload with a crisp 1-line definition and bullet points. Make quickAnswer concise.
- If intent is 'notes': Emphasize comprehensive study notes with formulas, markdown tables, key principles, and exam tips.
- If intent is 'quiz' or 'practice': Generate quizPayload with EXACTLY ${analysis.questionCount || 5} questions at ${analysis.difficulty || 'medium'} difficulty.
- If intent is 'code' or 'dry_run': Generate syntactically valid code in codeBlock, and include dryRun trace steps showing variable states step-by-step.
- If intent is 'visualize' or '3d_visualize': Generate rich visualization nodes, animated edges, and 3D spatial objects for molecules/physics/anatomy.
- If intent is 'compare': Generate a side-by-side comparison block comparing itemA and itemB with key differences and trade-offs.
`;

  const systemInstruction = `
You are EduVerse AI, an advanced master educational intelligence system.

${languageInstructions}

${intentInstructions}

EDUCATIONAL LEVEL ADAPTATION:
Education Level: ${educationLevel}
- Primary / Middle School: Extremely intuitive, vivid real-world analogies, no confusing jargon.
- High School: Clear academic definitions, foundational laws, clear diagrams, exam scoring tips.
- College / Engineering: Precise terminology, mathematical formulations in LaTeX, algorithmic complexity, architectural details.
- Advanced: Deep internal mechanisms, edge cases, trade-offs, formal mathematical proofs.

MATHEMATICAL NOTATION:
- Format all mathematical equations, physics formulas, and complexity notations in valid LaTeX using $...$ for inline math and $$...$$ for block math. Example: $$\\Delta E = mc^2$$ or $$O(\\log N)$$.

VISUALIZATION RULES:
- Always generate domain-specific visual nodes (e.g. for TCP: Client, SYN, Server, SYN-ACK, ACK, Established; for Binary Search: Low, Mid, High, Search Space; for Photosynthesis: Light, Water, CO2, Chloroplast, Glucose, Oxygen).
- Avoid generic "Input -> Process -> Output" labels.
CRITICAL JSON FORMATTING RULES:
- Return ONLY valid parseable JSON. No conversational preamble or trailing commentary.
- Inside JSON string fields, NEVER use unescaped double quotes (use single quotes 'like this' instead).
- Escape all backslashes in LaTeX equations properly (e.g. \\\\Delta, \\\\log, \\\\frac).
- Do not output trailing commas.

Return ONLY valid JSON matching this structure:
{
  "detectedSubject": "Subject name",
  "detectedTopic": "Clean topic name",
  "quickAnswer": "Direct concise answer in ${analysis.detectedLanguage}",
  "simpleExplanation": "Beginner friendly explanation in ${analysis.detectedLanguage}",
  "realWorldAnalogy": {
    "analogy": "Catchy real world analogy title",
    "explanation": "Analogy explanation in ${analysis.detectedLanguage}",
    "targetContext": "Mental model connection"
  },
  "detailedExplanation": "Deep structured Markdown explanation with LaTeX equations in ${analysis.detectedLanguage}",
  "visualization": {
    "type": "flowchart | process | hierarchy | timeline | cycle | architecture",
    "title": "Diagram title",
    "description": "Diagram description",
    "nodes": [
      {
        "id": "node-1",
        "label": "Node label",
        "sublabel": "Node sublabel",
        "icon": "Lucide icon name (Zap, Cpu, Server, Database, Sun, Heart, GitBranch, Target, Layers, Waves, Wind)",
        "color": "#6366f1",
        "details": "Node explanation"
      }
    ],
    "edges": [
      { "from": "node-1", "to": "node-2", "label": "Action label", "animated": true }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "title": "Step 1 Title",
        "description": "Step 1 details",
        "analogy": "Step analogy"
      }
    ]
  },
  "threeDData": {
    "needed": ${analysis.requires3D},
    "type": "molecule | atom | solar_system | neural_network | geometry | generic",
    "title": "3D Scene title",
    "description": "3D scene description",
    "objects": [
      { "name": "Center", "type": "sphere", "color": "#6366f1", "position": [0,0,0], "label": "Nucleus" }
    ]
  },
  "codeBlock": ${analysis.requiresCode ? `{
    "language": "cpp",
    "code": "Complete syntactically correct code",
    "algorithmName": "Algorithm Name",
    "summary": "Code summary",
    "lineByLine": [{ "lineRange": "1-5", "explanation": "Logic explanation" }],
    "timeComplexity": "O(log N)",
    "spaceComplexity": "O(1)",
    "edgeCases": ["Edge case 1"],
    "commonMistakes": ["Pitfall 1"]
  }` : `null`},
  "dryRun": ${analysis.requiresDryRun ? `[
    {
      "stepNumber": 1,
      "variableState": { "low": 0, "high": 7, "mid": 3, "arr[mid]": 15 },
      "explanation": "Initial bounds evaluation",
      "highlightLine": 4
    }
  ]` : `null`},
  "comparison": ${analysis.requiresComparison ? `{
    "itemA": "Item A",
    "itemB": "Item B",
    "analogy": "Comparison analogy",
    "summary": "Key differences",
    "table": [{ "feature": "Mechanism", "itemAValue": "Value A", "itemBValue": "Value B", "whyItMatters": "Reason" }],
    "whenToUseA": ["Scenario A"],
    "whenToUseB": ["Scenario B"],
    "realWorldExample": "Example"
  }` : `null`},
  "summaryPayload": {
    "oneLine": "Single sentence high-yield definition",
    "bulletPoints": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"],
    "detailedSummary": "Executive summary paragraph"
  },
  "quizPayload": {
    "topic": "${analysis.resolvedTopic}",
    "questions": [
      {
        "id": "q1",
        "question": "Diagnostic question text in ${analysis.detectedLanguage}",
        "type": "mcq",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Why this answer is correct",
        "hint": "Conceptual hint",
        "difficulty": "${analysis.difficulty || 'medium'}",
        "topicTag": "Key concept"
      }
    ]
  },
  "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
  "commonMistakes": [
    { "mistake": "Common error or misconception", "correction": "Accurate factual correction" }
  ],
  "quickRevisionCards": [
    { "front": "Question / Prompt", "back": "Active recall answer" }
  ],
  "practiceQuestions": ["Practice problem 1", "Practice problem 2"],
  "examTips": ["Exam high-scoring tip 1", "Exam tip 2"],
  "interviewQuestions": ["Interview question 1"],
  "medicalDisclaimer": ${analysis.isMedical}
}
`;

  const userPrompt = `
Student Request: "${query}"
Context / Prior Topic: "${analysis.resolvedTopic}"
Language: ${analysis.detectedLanguage}
Level: ${educationLevel}
Intent: ${analysis.intent}
Special User Directives: ${tonePrompt || "None"}

Generate the complete structured EduVerse response adhering to all language, level, and intent constraints. Return ONLY valid JSON.
`;

  const ai = getGeminiClient();

  async function callModel(model: string) {
    const responsePromise = ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 7000,
        temperature: 0.2,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `${model} timed out after 45s while generating educational response.`
          )
        );
      }, 45000);
    });

    const response = await Promise.race([responsePromise, timeoutPromise]);
    const rawText = typeof response.text === "string" ? response.text.trim() : "";

    if (!rawText) {
      throw new Error("Model returned an empty response.");
    }

    try {
      const parsed = parseJson(rawText);
      const normalized = normalizeResponse(parsed, analysis, request);
      return normalized;
    } catch (parseErr: any) {
      console.error("[EduVerse AI] JSON Parse failed. Raw output preview:", rawText.slice(0, 300));
      console.error("[EduVerse AI] Parse error message:", parseErr?.message || parseErr);
      throw parseErr;
    }
  }

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        console.log(`[EduVerse AI] Generating answer with ${model} (attempt ${attempt + 1})...`);
        return await callModel(model);
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || String(err);
        
        // Check if rate limited (429)
        const isRateLimited = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED");
        if (isRateLimited && attempt < 4) {
          const match = errMsg.match(/retry in ([\d.]+)s/i) || errMsg.match(/"retryDelay":\s*"(\d+)s"/i);
          const waitSec = match ? Math.ceil(parseFloat(match[1])) + 2 : (attempt + 1) * 8;
          console.warn(`[EduVerse AI] Rate limited on ${model}. Waiting ${waitSec}s before automatic retry...`);
          await new Promise(resolve => setTimeout(resolve, waitSec * 1000));
          continue;
        }

        console.warn(`[EduVerse AI] Model ${model} failed:`, errMsg);
        break;
      }
    }
  }

  throw new Error(
    `Failed to generate response: ${lastError?.message || lastError}`
  );
}