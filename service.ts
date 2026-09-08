import { GoogleGenAI } from "@google/genai";

/**
 * EduVerse AI — Production Learning Service
 *
 * Responsibilities:
 * - Send the student's exact request to Gemini.
 * - Preserve follow-up context.
 * - Force topic-specific educational content.
 * - Generate structured visualization data for VisualizationEngine.
 * - Generate code/comparison modules only when relevant.
 * - Never silently replace a failed AI answer with a fake generic answer.
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
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add GEMINI_API_KEY=your_key to .env and restart npm run dev."
    );
  }

  return new GoogleGenAI({ apiKey });
}

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
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

function parseJson(text: string): any {
  const cleaned = stripMarkdownJson(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error(
      "EduVerse AI received an invalid structured response from Gemini. Please try the question again."
    );
  }
}

/**
 * Gemini structured-output schema.
 *
 * This intentionally mirrors src/types/index.ts so the frontend receives
 * predictable data instead of a generic Input → Process → Output object.
 */
const LEARNING_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "quickAnswer",
    "simpleExplanation",
    "realWorldAnalogy",
    "detailedExplanation",
    "visualization",
    "keyPoints",
    "commonMistakes",
    "quickRevisionCards",
    "practiceQuestions",
    "examTips",
    "interviewQuestions",
    "medicalDisclaimer",
  ],
  properties: {
    quickAnswer: {
      type: "string",
      description:
        "A direct, correct answer to the student's exact question in 2-5 sentences.",
    },

    simpleExplanation: {
      type: "string",
      description:
        "A beginner-friendly explanation of the actual requested concept.",
    },

    realWorldAnalogy: {
      type: "object",
      additionalProperties: false,
      required: ["analogy", "explanation", "targetContext"],
      properties: {
        analogy: { type: "string" },
        explanation: { type: "string" },
        targetContext: { type: "string" },
      },
    },

    detailedExplanation: {
      type: "string",
      description:
        "Accurate, topic-specific deep explanation with headings, steps, examples and important technical details.",
    },

    visualization: {
      type: "object",
      additionalProperties: false,
      required: ["type", "title", "description", "nodes", "edges", "steps"],
      properties: {
        type: {
          type: "string",
          enum: [
            "flowchart",
            "process",
            "comparison",
            "hierarchy",
            "timeline",
            "cycle",
            "architecture",
          ],
        },
        title: { type: "string" },
        description: { type: "string" },

        nodes: {
          type: "array",
          minItems: 3,
          maxItems: 10,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["id", "label", "sublabel", "icon", "color", "details"],
            properties: {
              id: { type: "string" },
              label: { type: "string" },
              sublabel: { type: "string" },
              icon: { type: "string" },
              color: { type: "string" },
              details: { type: "string" },
            },
          },
        },

        edges: {
          type: "array",
          minItems: 2,
          maxItems: 12,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["from", "to", "label", "animated"],
            properties: {
              from: { type: "string" },
              to: { type: "string" },
              label: { type: "string" },
              animated: { type: "boolean" },
            },
          },
        },

        steps: {
          type: "array",
          minItems: 3,
          maxItems: 10,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["stepNumber", "title", "description", "analogy"],
            properties: {
              stepNumber: { type: "integer" },
              title: { type: "string" },
              description: { type: "string" },
              analogy: { type: "string" },
            },
          },
        },
      },
    },

    codeBlock: {
      anyOf: [
        { type: "null" },
        {
          type: "object",
          additionalProperties: false,
          required: [
            "language",
            "code",
            "summary",
            "lineByLine",
            "timeComplexity",
            "spaceComplexity",
            "edgeCases",
            "commonMistakes",
          ],
          properties: {
            language: { type: "string" },
            code: { type: "string" },
            algorithmName: { type: "string" },
            summary: { type: "string" },
            lineByLine: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["lineRange", "explanation"],
                properties: {
                  lineRange: { type: "string" },
                  explanation: { type: "string" },
                },
              },
            },
            timeComplexity: { type: "string" },
            spaceComplexity: { type: "string" },
            inputExample: { type: "string" },
            outputExample: { type: "string" },
            edgeCases: {
              type: "array",
              items: { type: "string" },
            },
            commonMistakes: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      ],
    },

    comparison: {
      anyOf: [
        { type: "null" },
        {
          type: "object",
          additionalProperties: false,
          required: [
            "itemA",
            "itemB",
            "analogy",
            "summary",
            "table",
            "whenToUseA",
            "whenToUseB",
            "realWorldExample",
          ],
          properties: {
            itemA: { type: "string" },
            itemB: { type: "string" },
            analogy: { type: "string" },
            summary: { type: "string" },
            table: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: [
                  "feature",
                  "itemAValue",
                  "itemBValue",
                  "whyItMatters",
                ],
                properties: {
                  feature: { type: "string" },
                  itemAValue: { type: "string" },
                  itemBValue: { type: "string" },
                  whyItMatters: { type: "string" },
                },
              },
            },
            whenToUseA: {
              type: "array",
              items: { type: "string" },
            },
            whenToUseB: {
              type: "array",
              items: { type: "string" },
            },
            realWorldExample: { type: "string" },
          },
        },
      ],
    },

    keyPoints: {
      type: "array",
      minItems: 3,
      maxItems: 10,
      items: { type: "string" },
    },

    commonMistakes: {
      type: "array",
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["mistake", "correction"],
        properties: {
          mistake: { type: "string" },
          correction: { type: "string" },
        },
      },
    },

    quickRevisionCards: {
      type: "array",
      minItems: 2,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["front", "back"],
        properties: {
          front: { type: "string" },
          back: { type: "string" },
        },
      },
    },

    practiceQuestions: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: { type: "string" },
    },

    examTips: {
      type: "array",
      maxItems: 8,
      items: { type: "string" },
    },

    interviewQuestions: {
      type: "array",
      maxItems: 8,
      items: { type: "string" },
    },

    medicalDisclaimer: {
      type: "boolean",
    },
  },
} as any;

function isProgrammingQuestion(query: string, mode: string): boolean {
  const text = `${query} ${mode}`.toLowerCase();

  return [
    "code",
    "program",
    "algorithm",
    "dsa",
    "leetcode",
    "debug",
    "javascript",
    "typescript",
    "python",
    "java",
    "c++",
    "cpp",
    "kotlin",
    "sql",
    "database",
    "function",
    "class",
    "recursion",
    "binary search",
    "linked list",
    "tree",
    "graph",
  ].some((term) => text.includes(term));
}

function isComparisonQuestion(query: string, mode: string): boolean {
  const text = `${query} ${mode}`.toLowerCase();

  return (
    /\b(vs|versus|difference|compare|comparison|distinguish)\b/.test(text) ||
    mode === "compare"
  );
}

function isMedicalQuestion(query: string, educationLevel: string): boolean {
  const text = `${query} ${educationLevel}`.toLowerCase();

  return [
    "symptom",
    "disease",
    "medicine",
    "medication",
    "drug",
    "diagnosis",
    "treatment",
    "doctor",
    "hospital",
    "pain",
    "fever",
    "infection",
    "blood pressure",
    "diabetes",
    "medical",
    "health",
  ].some((term) => text.includes(term));
}

function chooseVisualizationType(query: string): string {
  const text = query.toLowerCase();

  if (
    /\b(vs|versus|compare|comparison|difference|tcp.*udp|http.*https)\b/.test(
      text
    )
  ) {
    return "comparison";
  }

  if (
    /\b(tree|hierarchy|dom|organization|inheritance)\b/.test(text)
  ) {
    return "hierarchy";
  }

  if (
    /\b(lifecycle|life cycle|history|timeline|generation|evolution)\b/.test(
      text
    )
  ) {
    return "timeline";
  }

  if (/\b(cycle|circular|krebs|water cycle|carbon cycle)\b/.test(text)) {
    return "cycle";
  }

  if (
    /\b(architecture|system design|network architecture|database architecture)\b/.test(
      text
    )
  ) {
    return "architecture";
  }

  if (
    /\b(process|steps|workflow|procedure|mechanism|how does)\b/.test(text)
  ) {
    return "process";
  }

  return "flowchart";
}

function normalizeResponse(parsed: any, request: LearningRequest) {
  const visualization = parsed?.visualization || {};

  const nodes = Array.isArray(visualization.nodes)
    ? visualization.nodes
        .filter(
          (node: any) =>
            node &&
            typeof node.id === "string" &&
            typeof node.label === "string"
        )
        .slice(0, 10)
        .map((node: any, index: number) => ({
          id: node.id,
          label: node.label,
          sublabel: safeString(node.sublabel, "Concept stage"),
          icon: safeString(node.icon, index % 2 ? "Cpu" : "Lightbulb"),
          color: safeString(
            node.color,
            ["#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ec4899"][
              index % 5
            ]
          ),
          details: safeString(node.details, node.sublabel || node.label),
        }))
    : [];

  const steps = Array.isArray(visualization.steps)
    ? visualization.steps
        .filter((step: any) => step)
        .slice(0, 10)
        .map((step: any, index: number) => ({
          stepNumber:
            typeof step.stepNumber === "number" ? step.stepNumber : index + 1,
          title: safeString(step.title, `Step ${index + 1}`),
          description: safeString(
            step.description,
            "Understand this stage of the requested concept."
          ),
          analogy: safeString(step.analogy, ""),
        }))
    : [];

  const edges = Array.isArray(visualization.edges)
    ? visualization.edges
        .filter(
          (edge: any) =>
            edge &&
            typeof edge.from === "string" &&
            typeof edge.to === "string"
        )
        .slice(0, 12)
        .map((edge: any) => ({
          from: edge.from,
          to: edge.to,
          label: safeString(edge.label, ""),
          animated: Boolean(edge.animated),
        }))
    : [];

  return {
    quickAnswer: safeString(parsed?.quickAnswer),
    simpleExplanation: safeString(parsed?.simpleExplanation),
    realWorldAnalogy: {
      analogy: safeString(parsed?.realWorldAnalogy?.analogy),
      explanation: safeString(parsed?.realWorldAnalogy?.explanation),
      targetContext: safeString(parsed?.realWorldAnalogy?.targetContext),
    },
    detailedExplanation: safeString(parsed?.detailedExplanation),

    visualization: {
      type:
        visualization.type ||
        chooseVisualizationType(request.query),
      title: safeString(
        visualization.title,
        `${request.query.trim()} — Interactive Visual Explanation`
      ),
      description: safeString(
        visualization.description,
        `Step-by-step visual explanation of ${request.query.trim()}.`
      ),
      nodes,
      edges,
      steps,
    },

    ...(parsed?.codeBlock ? { codeBlock: parsed.codeBlock } : {}),
    ...(parsed?.comparison ? { comparison: parsed.comparison } : {}),

    keyPoints: Array.isArray(parsed?.keyPoints)
      ? parsed.keyPoints.filter((item: any) => typeof item === "string")
      : [],

    commonMistakes: Array.isArray(parsed?.commonMistakes)
      ? parsed.commonMistakes
          .filter((item: any) => item && typeof item === "object")
          .map((item: any) => ({
            mistake: safeString(item.mistake),
            correction: safeString(item.correction),
          }))
      : [],

    quickRevisionCards: Array.isArray(parsed?.quickRevisionCards)
      ? parsed.quickRevisionCards
          .filter((item: any) => item && typeof item === "object")
          .map((item: any) => ({
            front: safeString(item.front),
            back: safeString(item.back),
          }))
      : [],

    practiceQuestions: Array.isArray(parsed?.practiceQuestions)
      ? parsed.practiceQuestions.filter(
          (item: any) => typeof item === "string"
        )
      : [],

    examTips: Array.isArray(parsed?.examTips)
      ? parsed.examTips.filter((item: any) => typeof item === "string")
      : [],

    interviewQuestions: Array.isArray(parsed?.interviewQuestions)
      ? parsed.interviewQuestions.filter(
          (item: any) => typeof item === "string"
        )
      : [],

    medicalDisclaimer: Boolean(parsed?.medicalDisclaimer),
  };
}

function assertUsefulResponse(result: any, query: string) {
  const requiredText = [
    result.quickAnswer,
    result.simpleExplanation,
    result.detailedExplanation,
    result.realWorldAnalogy?.explanation,
  ];

  if (
    requiredText.some(
      (value) => typeof value !== "string" || value.trim().length < 20
    )
  ) {
    throw new Error(
      `Gemini returned an incomplete answer for "${query}". Please try again.`
    );
  }

  if (
    !result.visualization ||
    !Array.isArray(result.visualization.nodes) ||
    result.visualization.nodes.length < 3
  ) {
    throw new Error(
      `Gemini returned an incomplete visualization for "${query}". Please try again.`
    );
  }
}

export async function generateLearningResponse(
  request: LearningRequest
) {
  const query = safeString(request.query);

  if (!query) {
    throw new Error("Question cannot be empty.");
  }

  const language = safeString(request.language, "English");
  const educationLevel = safeString(
    request.educationLevel,
    "college_engineering"
  );
  const responseStyle = safeString(request.responseStyle, "normal");
  const responseMode = safeString(request.responseMode, "comprehensive");
  const tonePrompt = safeString(
    request.tonePrompt,
    "Be friendly, clear, beginner-friendly and technically accurate."
  );

  const history = normalizeHistory(request.conversationHistory);
  const programming = isProgrammingQuestion(query, responseMode);
  const comparison = isComparisonQuestion(query, responseMode);
  const medical = isMedicalQuestion(query, educationLevel);
  const visualType = chooseVisualizationType(query);

  const systemInstruction = `
You are EduVerse AI, a production-grade academic tutor.

PRIMARY GOAL
Understand the student's EXACT request and teach the exact concept they asked about.
The answer must be useful even if the student is a complete beginner.

ABSOLUTE RULES
1. Never return a generic "Input → Process → Output" explanation.
2. Never invent a different topic.
3. Never repeat the student's question as filler.
4. Every example, step, node and visual element must be about the requested concept.
5. Prefer factual accuracy over sounding impressive.
6. If the question contains multiple requirements, satisfy ALL of them.
7. If the student asks for Hinglish, use natural Roman Hindi + English technical terms.
8. If the student asks for a practical/real-world example, provide a genuinely relevant example.
9. If the student asks for step-by-step, provide actual steps of the concept.
10. If the student asks for comparison, compare the requested items directly.
11. If the student asks for code/DSA/SQL/programming, include technically correct code when useful.
12. Do not fabricate citations, statistics, URLs, research papers or current facts.
13. If information is uncertain, say so rather than making it up.
14. For medical/health questions, set medicalDisclaimer=true and avoid pretending to diagnose the student.
15. The visual must teach the same concept as the written answer.

LANGUAGE
${language}

EDUCATION LEVEL
${educationLevel}

RESPONSE STYLE
${responseStyle}

RESPONSE MODE
${responseMode}

ADDITIONAL USER INSTRUCTION
${tonePrompt}

VISUALIZATION REQUIREMENT
Create a concept-specific interactive visual plan.
Preferred visual type:
${visualType}

Create 3-10 meaningful nodes.
Do NOT call nodes merely "Input", "Process", "Output" unless those are genuinely the terminology of the requested concept.
Use real domain terminology.
Each node needs:
- a meaningful label
- a short sublabel
- a suitable Lucide icon name such as Sun, Database, Server, Cpu, Heart, Layers, GitBranch, Target, Zap, Check, Lightbulb, Wind, Waves
- a color
- details explaining the actual concept

Edges must connect real conceptual relationships.
Steps must describe the real mechanism in order.

SPECIAL VISUAL BEHAVIOUR
- For binary search: visualize the sorted array, left/right bounds, middle element, comparison and eliminated half.
- For TCP handshake: visualize Client, SYN, Server, SYN-ACK, ACK and connection establishment.
- For photosynthesis: visualize sunlight, CO2, water, chloroplast, glucose and oxygen.
- For DNA: visualize the double helix, base pairing and nucleotide structure.
- For heart/blood circulation: visualize chambers, lungs/body and oxygenated/deoxygenated blood.
- For algorithms: visualize the actual algorithm state transitions.
- For mathematics: visualize variables, equations, transformations or geometric relationships.
- For physics: visualize the actual physical quantities, forces, fields or motion.
- For chemistry: visualize atoms, bonds, molecules or reaction stages.
- For operating systems/networks/databases: visualize the actual system components and data flow.

3D / ANIMATION INTENT
If the student asks for "3D", "animation", "video", "visualize", "show me", or similar:
- Make the visualization highly animation-friendly.
- Describe what changes at each step.
- Use concrete objects and transitions rather than generic boxes.
- The current EduVerse frontend can animate the visual scene; do not claim that a real MP4/video was generated unless a video-generation service is actually connected.

CONVERSATION
Treat the latest user message as the current instruction.
Use the previous messages only to resolve references such as "this", "that", "continue", "explain step 2", etc.
Do not blindly copy old answers.

PREVIOUS CONVERSATION
${history || "(No previous conversation.)"}

PROGRAMMING
${programming
  ? "This is programming-related. Include correct code/logic where appropriate and explain complexity if relevant."
  : "Do not add unnecessary programming code."}

COMPARISON
${comparison
  ? "This is a comparison request. Make the comparison explicit and topic-specific."
  : "Do not invent a comparison module unless the question requires it."}

MEDICAL
${medical
  ? "This is potentially health-related. Be cautious, educational and include the medical disclaimer."
  : "This is not being treated as a medical question."}

RETURN ONLY JSON matching the supplied response schema.
`;

  const userPrompt = `
Return ONLY valid JSON.

Student request:
${query}

Create a concise but complete EduVerse learning response for this exact request.
Include:
1. correct direct answer
2. beginner explanation
3. real-world example
4. detailed topic-specific explanation
5. concept-specific interactive visualization with meaningful nodes, edges and steps
6. key points, mistakes, revision cards, practice questions and exam tips
7. code/comparison only when genuinely relevant

Do not use a generic Input -> Process -> Output template.
`;

  const ai = getGeminiClient();

  async function callModel(model: string) {
    const requestPromise = ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 6000,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `${model} timed out after 45 seconds while generating the learning response.`
          )
        );
      }, 45000);
    });

    const response = await Promise.race([requestPromise, timeoutPromise]);

    const rawText =
      typeof response.text === "string" ? response.text.trim() : "";

    if (!rawText) {
      throw new Error("Gemini returned an empty response.");
    }

    const parsed = parseJson(rawText);
    const normalized = normalizeResponse(parsed, {
      ...request,
      language,
      educationLevel,
      responseStyle,
      responseMode,
      tonePrompt,
    });

    assertUsefulResponse(normalized, query);

    return normalized;
  }

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      console.log(`[EduVerse AI] Generating learning response with ${model}...`);
      return await callModel(model);
    } catch (err: any) {
      lastError = err;
      console.error(
        `[EduVerse AI] Model ${model} failed:`,
        err?.message || err
      );
    }
  }

  const failureDetails =
    lastError?.message || "All candidate Gemini models failed.";

  throw new Error(
    `EduVerse AI could not generate an educational response: ${failureDetails}. Please check your API key and connection.`
  );
}