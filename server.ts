import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import vm from "vm";
import { GoogleGenAI } from "@google/genai";

import { generateLearningResponse } from "./service.ts";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const CANDIDATE_MODELS = [
  "gemini-2.5-flash"
];

/**
 * =========================================================
 * GEMINI CLIENT
 * =========================================================
 */

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in the environment."
    );
  }

  return new GoogleGenAI({
    apiKey,
  });
}

function stripMarkdownJson(text: string): string {
  const trimmed = text.trim();

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

async function generateGeminiJson(options: {
  systemInstruction: string;
  prompt: string;
  temperature?: number;
}): Promise<any> {
  const ai = getGeminiClient();
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.prompt,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: "application/json",
          temperature: options.temperature ?? 0.2,
        },
      });

      const raw = response.text || "{}";
      const cleaned = stripMarkdownJson(raw);
      return JSON.parse(cleaned);
    } catch (err: any) {
      lastError = err;
      console.warn(`[EduVerse Server] Model ${model} generation failed, trying next...`);
    }
  }

  throw new Error(
    `AI generation failed across candidate models: ${lastError?.message || lastError}`
  );
}

/**
 * =========================================================
 * START SERVER
 * =========================================================
 */

async function startServer() {
  const app = express();

  // Basic request body limits
  app.use(express.json({ limit: "25mb" }));

  // Request logger
  app.use((req, _res, next) => {
    if (req.path.startsWith("/api")) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    }
    next();
  });

  /**
   * =========================================================
   * HEALTH CHECK
   * =========================================================
   */

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "EduVerse AI Platform",
      timestamp: new Date().toISOString(),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  /**
   * =========================================================
   * 1. MAIN EDUCATIONAL AI ENDPOINT
   * =========================================================
   */

  app.post("/api/learn", async (req, res) => {
    try {
      const {
        query,
        language = "English",
        educationLevel = "college_engineering",
        responseStyle = "normal",
        responseMode = "comprehensive",
        tonePrompt = "",
        conversationHistory = [],
      } = req.body;

      if (!query || typeof query !== "string" || !query.trim()) {
        return res.status(400).json({
          error: "Query is required and cannot be empty.",
        });
      }

      console.log("========================================");
      console.log("EduVerse AI Request");
      console.log("Question:", query);
      console.log("Language:", language);
      console.log("Education:", educationLevel);
      console.log("Style:", responseStyle);
      console.log("========================================");

      const aiResponse = await generateLearningResponse({
        query: query.trim(),
        language,
        educationLevel,
        responseStyle,
        responseMode,
        tonePrompt,
        conversationHistory,
      });

      const enrichedResponse = {
        id:
          "resp-" +
          Date.now() +
          "-" +
          Math.random().toString(36).substring(2, 7),
        query: query.trim(),
        timestamp: new Date().toISOString(),
        language,
        educationLevel,
        responseStyle,
        ...aiResponse,
      };

      return res.json(enrichedResponse);
    } catch (error: any) {
      console.error("Error in /api/learn:", error);

      return res.status(500).json({
        error:
          error?.message ||
          "An error occurred while generating educational response.",
      });
    }
  });

  /**
   * =========================================================
   * 2. STUDY NOTES GENERATOR
   * =========================================================
   */

  app.post("/api/notes", async (req, res) => {
    try {
      const {
        topic,
        educationLevel = "high_school",
        language = "English",
        customFocus = "",
      } = req.body;

      if (!topic || typeof topic !== "string" || !topic.trim()) {
        return res.status(400).json({
          error: "Topic is required.",
        });
      }

      const systemInstruction = `
You are a Master Academic Professor and Curriculum Specialist.

Create structured, comprehensive, exam-ready study notes for:
Topic: ${topic.trim()}
Education Level: ${educationLevel}
Language: ${language}
Special Focus: ${customFocus || "None"}

Return ONLY valid JSON matching this structure:
{
  "topic": "Clean topic name",
  "subject": "Associated academic subject",
  "summary": "Executive overview",
  "contentMarkdown": "Full comprehensive structured notes with headings, formulas, and bullet points",
  "keyPoints": ["point 1", "point 2", "point 3", "point 4"],
  "formulasOrEquations": ["formula 1", "formula 2"],
  "examTips": ["tip 1", "tip 2"],
  "tags": ["tag1", "tag2"]
}

Make every section specifically about the requested topic. Do not generate generic educational filler.
`;

      const parsed = await generateGeminiJson({
        systemInstruction,
        prompt: `Generate high-yield study notes for: "${topic.trim()}" at ${educationLevel} level in ${language}. Focus: ${customFocus || "None"}`,
        temperature: 0.2,
      });

      return res.json({
        id: "note-" + Date.now(),
        topic: parsed.topic || topic.trim(),
        subject: parsed.subject || "General Studies",
        educationLevel,
        language,
        createdAt: new Date().toISOString(),
        tags: Array.isArray(parsed.tags) ? parsed.tags : [topic.trim()],
        contentMarkdown: parsed.contentMarkdown || "",
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        formulasOrEquations: Array.isArray(parsed.formulasOrEquations)
          ? parsed.formulasOrEquations
          : [],
        examTips: Array.isArray(parsed.examTips) ? parsed.examTips : [],
        summary: parsed.summary || "",
      });
    } catch (error: any) {
      console.error("Error in /api/notes:", error);

      return res.status(500).json({
        error: error?.message || "Failed to generate study notes.",
      });
    }
  });

  /**
   * =========================================================
   * 3. QUIZ GENERATOR
   * =========================================================
   */

  app.post("/api/quiz", async (req, res) => {
    try {
      const {
        topic,
        educationLevel = "college_engineering",
        language = "English",
        questionCount = 5,
        difficulty = "medium",
      } = req.body;

      if (!topic || typeof topic !== "string" || !topic.trim()) {
        return res.status(400).json({
          error: "Topic is required.",
        });
      }

      const systemInstruction = `
You are an expert Educational Assessment Designer.

Generate ${questionCount} high-quality diagnostic quiz questions for:
Topic: ${topic.trim()}
Education Level: ${educationLevel}
Language: ${language}
Difficulty: ${difficulty}

Include a mixture of conceptual MCQs, application questions, real-world scenarios, and misconception checks.

Return ONLY valid JSON:
{
  "topic": "${topic.trim()}",
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "type": "mcq",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation why this answer is correct",
      "hint": "Subtle conceptual hint",
      "difficulty": "medium",
      "topicTag": "Key concept area"
    }
  ]
}
`;

      const parsed = await generateGeminiJson({
        systemInstruction,
        prompt: `Create a ${questionCount}-question quiz on "${topic.trim()}" for ${educationLevel} in ${language}. Difficulty: ${difficulty}.`,
        temperature: 0.3,
      });

      return res.json({
        topic: parsed.topic || topic.trim(),
        questions: Array.isArray(parsed.questions) ? parsed.questions : [],
      });
    } catch (error: any) {
      console.error("Error in /api/quiz:", error);

      return res.status(500).json({
        error: error?.message || "Failed to generate quiz.",
      });
    }
  });

  /**
   * =========================================================
   * 4. CODE RUNNER & SIMULATOR
   * =========================================================
   */

  app.post("/api/run-code", async (req, res) => {
    try {
      const { code, language = "javascript", input = "" } = req.body;

      if (!code || typeof code !== "string" || !code.trim()) {
        return res.status(400).json({
          error: "Code is required.",
        });
      }

      const normalizedLang = language.toLowerCase().trim();

      /**
       * JavaScript / TypeScript: Isolated Node.js VM Sandbox
       */
      if (normalizedLang === "javascript" || normalizedLang === "typescript") {
        const logs: string[] = [];

        const sandbox = {
          console: {
            log: (...args: any[]) =>
              logs.push(
                args
                  .map((a) =>
                    typeof a === "object"
                      ? JSON.stringify(a, null, 2)
                      : String(a)
                  )
                  .join(" ")
              ),
            error: (...args: any[]) =>
              logs.push(
                "[ERROR] " +
                  args
                    .map((a) =>
                      typeof a === "object"
                        ? JSON.stringify(a, null, 2)
                        : String(a)
                    )
                    .join(" ")
              ),
            warn: (...args: any[]) =>
              logs.push(
                "[WARN] " +
                  args
                    .map((a) =>
                      typeof a === "object"
                        ? JSON.stringify(a, null, 2)
                        : String(a)
                    )
                    .join(" ")
              ),
            info: (...args: any[]) =>
              logs.push(
                "[INFO] " +
                  args
                    .map((a) =>
                      typeof a === "object"
                        ? JSON.stringify(a, null, 2)
                        : String(a)
                    )
                    .join(" ")
              ),
          },
          Math,
          Date,
          JSON,
          parseInt,
          parseFloat,
          String,
          Number,
          Boolean,
          Array,
          Object,
          Set,
          Map,
          RegExp,
        };

        const context = vm.createContext(sandbox);
        const script = new vm.Script(code);
        const startTime = Date.now();

        script.runInContext(context, {
          timeout: 2000,
        });

        const executionTimeMs = Date.now() - startTime;

        return res.json({
          success: true,
          output:
            logs.join("\n") ||
            "(Code executed successfully with no console output)",
          executionTimeMs,
          sandboxType: "Isolated Node.js VM Sandbox",
        });
      }

      /**
       * C++ / Java / Python / SQL: AI Code Analysis & Simulated Execution Preview
       */
      const systemInstruction = `
You are a precise Compiler and Code Execution Simulator for ${normalizedLang}.

Simulate the exact terminal stdout produced when compiling and running this code:
\`\`\`${normalizedLang}
${code}
\`\`\`
User input: "${input}"

Return ONLY valid JSON:
{
  "output": "Exact stdout string produced by this code",
  "hasCompilationError": false,
  "compilationNotes": "Warnings, time/space complexity, or execution notes"
}
`;

      const parsed = await generateGeminiJson({
        systemInstruction,
        prompt: `Simulate code execution for ${normalizedLang} code.`,
        temperature: 0.1,
      });

      return res.json({
        success: !parsed.hasCompilationError,
        output: parsed.output || "Execution completed.",
        compilationNotes: parsed.compilationNotes,
        executionTimeMs: Math.floor(Math.random() * 30) + 15,
        sandboxType: "AI Code Analysis / Execution Preview",
      });
    } catch (error: any) {
      console.error("Error in /api/run-code:", error);

      return res.json({
        success: false,
        output: `Runtime / Execution Error: ${
          error?.message || "Execution failed"
        }`,
        executionTimeMs: 0,
        sandboxType: "Execution Error",
      });
    }
  });

  /**
   * =========================================================
   * 5. DOCUMENT / PDF INSIGHTS
   * =========================================================
   */

  app.post("/api/document-insights", async (req, res) => {
    try {
      const {
        text,
        fileName,
        action = "explain",
        language = "English",
        educationLevel = "college_engineering",
      } = req.body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({
          error: "Document text content is required.",
        });
      }

      const systemInstruction = `
You are the EduVerse AI Document Specialist.

Analyze the provided educational document:
Document: ${fileName || "Uploaded Document"}
Action: ${action}
Target Language: ${language}
Education Level: ${educationLevel}

Return ONLY valid JSON:
{
  "documentSummary": "Clear executive summary of document",
  "mainConcepts": [
    {
      "concept": "Concept name",
      "description": "Concept explanation"
    }
  ],
  "structuredNotes": "Structured Markdown notes extracted from the document",
  "keyTakeaways": ["Key takeaway 1", "Key takeaway 2"],
  "potentialExamQuestions": ["Question 1", "Question 2"],
  "glossary": [
    {
      "term": "Term",
      "definition": "Definition"
    }
  ]
}

All information must be strictly based on the uploaded document.
`;

      const parsed = await generateGeminiJson({
        systemInstruction,
        prompt: `Analyze this document content (${fileName || "Uploaded Document"}):\n\n${text.substring(0, 20000)}`,
        temperature: 0.2,
      });

      return res.json(parsed);
    } catch (error: any) {
      console.error("Error in /api/document-insights:", error);

      return res.status(500).json({
        error: error?.message || "Failed to process document.",
      });
    }
  });

  /**
   * =========================================================
   * VITE DEV SERVER OR PRODUCTION STATIC SERVING
   * =========================================================
   */

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  /**
   * =========================================================
   * BIND & LISTEN
   * =========================================================
   */

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduVerse AI server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal error during EduVerse server start:", err);
  process.exit(1);
});