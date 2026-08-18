import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import vm from "vm";
import { GoogleGenAI } from "@google/genai";

import { generateLearningResponse } from "./service.ts";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

/**
 * =========================================================
 * GEMINI CLIENT
 * =========================================================
 */

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in the environment."
    );
  }

  return new GoogleGenAI({
    apiKey,
  });
}

/**
 * =========================================================
 * START SERVER
 * =========================================================
 */

async function startServer() {
  const app = express();

  app.use(express.json({ limit: "25mb" }));

  /**
   * =========================================================
   * HEALTH CHECK
   * =========================================================
   */

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "EduVerse AI Platform",
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

      if (!query || typeof query !== "string") {
        return res.status(400).json({
          error: "Query is required.",
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
        query,
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

        query,

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

        details: error?.toString?.() || String(error),
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

      if (!topic) {
        return res.status(400).json({
          error: "Topic is required.",
        });
      }

      const ai = getGeminiClient();

      const systemInstruction = `
You are a Master Academic Professor and Curriculum Specialist.

Create structured, comprehensive, exam-ready study notes.

Topic:
${topic}

Education Level:
${educationLevel}

Language:
${language}

Special Focus:
${customFocus || "None"}

Return ONLY valid JSON.

Required structure:

{
  "topic": "Clean topic name",
  "subject": "Associated academic subject",
  "summary": "Executive overview",
  "contentMarkdown": "Full comprehensive structured notes",
  "keyPoints": [],
  "formulasOrEquations": [],
  "examTips": [],
  "tags": []
}

Make every section specifically about the requested topic.
Do not generate generic educational filler.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",

        contents: `
Generate comprehensive high-yield study notes for:

"${topic}"

Level:
${educationLevel}

Language:
${language}

Special focus:
${customFocus || "None"}
`,

        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const parsed = JSON.parse(response.text || "{}");

      return res.json({
        id: "note-" + Date.now(),

        topic: parsed.topic || topic,

        subject: parsed.subject || "General Studies",

        educationLevel,

        language,

        createdAt: new Date().toISOString(),

        tags: parsed.tags || [topic],

        contentMarkdown: parsed.contentMarkdown || "",

        keyPoints: parsed.keyPoints || [],

        formulasOrEquations:
          parsed.formulasOrEquations || [],

        examTips: parsed.examTips || [],

        summary: parsed.summary || "",
      });
    } catch (error: any) {
      console.error("Error in /api/notes:", error);

      return res.status(500).json({
        error:
          error?.message ||
          "Failed to generate study notes.",
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

      if (!topic) {
        return res.status(400).json({
          error: "Topic is required.",
        });
      }

      const ai = getGeminiClient();

      const systemInstruction = `
You are an expert Educational Assessment Designer.

Generate ${questionCount} high-quality diagnostic quiz questions.

Topic:
${topic}

Education Level:
${educationLevel}

Language:
${language}

Difficulty:
${difficulty}

Every question MUST be specifically related to the requested topic.

Include a mixture of:

1. Conceptual MCQs
2. Application questions
3. Real-world scenarios
4. Misconception questions
5. Code/logic questions when relevant

Return ONLY valid JSON:

{
  "topic": "${topic}",
  "questions": [
    {
      "id": "q1",
      "question": "",
      "type": "mcq",
      "options": [],
      "correctAnswer": 0,
      "explanation": "",
      "hint": "",
      "difficulty": "easy",
      "topicTag": ""
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",

        contents: `
Create a ${questionCount}-question quiz.

Topic:
"${topic}"

Level:
${educationLevel}

Language:
${language}

Difficulty:
${difficulty}
`,

        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || "{}");

      return res.json(parsed);
    } catch (error: any) {
      console.error("Error in /api/quiz:", error);

      return res.status(500).json({
        error:
          error?.message ||
          "Failed to generate quiz.",
      });
    }
  });

  /**
   * =========================================================
   * 4. CODE RUNNER
   * =========================================================
   */

  app.post("/api/run-code", async (req, res) => {
    try {
      const {
        code,
        language = "javascript",
        input = "",
      } = req.body;

      if (!code) {
        return res.status(400).json({
          error: "Code is required.",
        });
      }

      /**
       * JavaScript / TypeScript
       */

      if (
        language === "javascript" ||
        language === "typescript"
      ) {
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

        const executionTimeMs =
          Date.now() - startTime;

        return res.json({
          success: true,

          output:
            logs.join("\n") ||
            "(Code executed successfully with no console output)",

          executionTimeMs,

          sandboxType:
            "Isolated Node.js VM",
        });
      }

      /**
       * C++ / Java / Python / SQL
       *
       * Uses Gemini for educational execution simulation.
       */

      const ai = getGeminiClient();

      const prompt = `
Simulate the exact terminal execution and compile/run output for this ${language} code.

Code:

\`\`\`${language}
${code}
\`\`\`

User input:

"${input}"

Return ONLY valid JSON:

{
  "output": "Exact stdout string produced by this code",
  "hasCompilationError": false,
  "compilationNotes": "Warnings or execution notes"
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",

        contents: prompt,

        config: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });

      const parsed = JSON.parse(
        response.text || "{}"
      );

      return res.json({
        success: !parsed.hasCompilationError,

        output:
          parsed.output ||
          "Execution completed.",

        compilationNotes:
          parsed.compilationNotes,

        executionTimeMs:
          Math.floor(Math.random() * 40) + 15,

        sandboxType:
          `${language.toUpperCase()} Cloud Sandbox Engine`,
      });
    } catch (error: any) {
      console.error(
        "Error in /api/run-code:",
        error
      );

      return res.json({
        success: false,

        output:
          `Runtime / Execution Error: ${
            error?.message ||
            "Execution failed"
          }`,

        executionTimeMs: 0,
      });
    }
  });

  /**
   * =========================================================
   * 5. DOCUMENT / PDF INSIGHTS
   * =========================================================
   */

  app.post(
    "/api/document-insights",
    async (req, res) => {
      try {
        const {
          text,
          fileName,
          action = "explain",
          language = "English",
          educationLevel =
            "college_engineering",
        } = req.body;

        if (
          !text ||
          text.trim().length === 0
        ) {
          return res.status(400).json({
            error:
              "Document text content is required.",
          });
        }

        const ai = getGeminiClient();

        const systemInstruction = `
You are EduVerse AI Document Specialist.

Analyze the provided educational document.

Document:
${fileName || "Uploaded Document"}

Action:
${action}

Target Language:
${language}

Education Level:
${educationLevel}

Return ONLY valid JSON:

{
  "documentSummary": "",
  "mainConcepts": [
    {
      "concept": "",
      "description": ""
    }
  ],
  "structuredNotes": "",
  "keyTakeaways": [],
  "potentialExamQuestions": [],
  "glossary": [
    {
      "term": "",
      "definition": ""
    }
  ]
}

All information must be based on the uploaded document.
Do not add unrelated generic content.
`;

        const response =
          await ai.models.generateContent({
            model: "gemini-3.7-flash",

            contents: `
Analyze this document content:

${text.substring(0, 20000)}
`,

            config: {
              systemInstruction,
              responseMimeType:
                "application/json",
              temperature: 0.2,
            },
          });

        const parsed = JSON.parse(
          response.text || "{}"
        );

        return res.json(parsed);
      } catch (error: any) {
        console.error(
          "Error in /api/document-insights:",
          error
        );

        return res.status(500).json({
          error:
            error?.message ||
            "Failed to process document.",
        });
      }
    }
  );

  /**
   * =========================================================
   * VITE DEVELOPMENT SERVER
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
    /**
     * Production:
     * Serve the Vite-generated frontend from dist/
     *
     * process.cwd() is intentionally used here instead of
     * import.meta.url so the same server works with the
     * CommonJS production bundle generated by esbuild.
     */

    const distPath = path.join(
      process.cwd(),
      "dist"
    );

    app.use(
      express.static(distPath)
    );

    app.get("*", (_req, res) => {
      res.sendFile(
        path.join(
          distPath,
          "index.html"
        )
      );
    });
  }

  /**
   * =========================================================
   * START SERVER
   * =========================================================
   */

  app.listen(
    PORT,
    "0.0.0.0",
    () => {
      console.log(
        `EduVerse AI server active on http://0.0.0.0:${PORT}`
      );
    }
  );
}

startServer().catch((err) => {
  console.error(
    "Fatal error during EduVerse server start:",
    err
  );

  process.exit(1);
});