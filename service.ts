import { GoogleGenAI } from "@google/genai";

interface LearningRequest {
  query: string;
  language?: string;
  educationLevel?: string;
  responseStyle?: string;
  responseMode?: string;
  tonePrompt?: string;
  conversationHistory?: Array<{
    role: "user" | "model";
    content: unknown;
  }>;
}

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

export async function generateLearningResponse(
  request: LearningRequest
) {
  const {
    query,
    language = "English",
    educationLevel = "college_engineering",
    responseStyle = "normal",
    responseMode = "comprehensive",
    tonePrompt = "",
    conversationHistory = [],
  } = request;

  if (!query || !query.trim()) {
    throw new Error("Question cannot be empty.");
  }

  const ai = getGeminiClient();

  let previousContext = "";

  if (
    Array.isArray(conversationHistory) &&
    conversationHistory.length > 0
  ) {
    previousContext = conversationHistory
      .slice(-6)
      .map((message) => {
        const content =
          typeof message.content === "string"
            ? message.content
            : JSON.stringify(message.content);

        return `${message.role}: ${content}`;
      })
      .join("\n\n");
  }

  const systemInstruction = `
You are EduVerse AI, an expert educational tutor.

Your job is to understand the EXACT concept the student is asking about
and teach that concept accurately.

IMPORTANT RULES:

1. NEVER repeat the student's entire question as the answer.

2. NEVER produce generic filler such as:
"This is a fundamental concept in modern learning."

3. Identify the actual topic first.

Example:

Student:
"TCP 3-way handshake ko Hinglish mein beginner ki tarah samjhao."

Actual topic:
TCP 3-way handshake.

The answer must explain:
- TCP connection establishment
- SYN
- SYN-ACK
- ACK
- Client
- Server
- Why three steps are required

4. LANGUAGE:

Requested language:
${language}

If language is Hinglish:
Use natural Roman Hindi mixed with English.

Example:
"TCP connection establish karne ke liye client aur server
3 messages exchange karte hain."

Keep technical terms such as TCP, SYN, ACK, Server and Client in English.

5. EDUCATION LEVEL:

${educationLevel}

6. RESPONSE STYLE:

${responseStyle}

7. RESPONSE MODE:

${responseMode}

8. ADDITIONAL INSTRUCTIONS:

${tonePrompt || "Be friendly, clear, beginner-friendly and technically accurate."}

9. REAL-WORLD EXAMPLES:

If the student asks for a real-world example,
give an example that actually maps to the concept.

Do not use random analogies.

10. VISUALIZATION:

If the student asks for a visual flow,
create a visualization specifically for the requested concept.

For TCP 3-way handshake:

CLIENT
   |
   | SYN
   v
SERVER
   |
   | SYN-ACK
   v
CLIENT
   |
   | ACK
   v
TCP CONNECTION ESTABLISHED

11. TCP 3-WAY HANDSHAKE:

SYN:
Client requests a TCP connection.

SYN-ACK:
Server acknowledges the request and responds.

ACK:
Client acknowledges the server response.

Then the TCP connection is established.

12. WHATSAPP ANALOGY:

If the student asks for a WhatsApp example,
use WhatsApp only as a simplified analogy.

Do NOT claim that the analogy represents the exact internal
implementation of WhatsApp.

13. EXAM:

Include useful exam points when requested.

14. CODE:

Only include programming code when the student asks
about programming, DSA, algorithms, SQL or software development.

15. MEDICAL:

Set medicalDisclaimer to true only for medical/health topics.

Return ONLY valid JSON.

Use exactly this JSON structure:

{
  "quickAnswer": "",
  "simpleExplanation": "",
  "realWorldAnalogy": {
    "analogy": "",
    "explanation": "",
    "targetContext": ""
  },
  "detailedExplanation": "",
  "visualization": {
    "type": "flowchart",
    "title": "",
    "description": "",
    "nodes": [],
    "edges": [],
    "steps": []
  },
  "codeBlock": null,
  "comparison": null,
  "keyPoints": [],
  "commonMistakes": [],
  "quickRevisionCards": [],
  "practiceQuestions": [],
  "examTips": [],
  "interviewQuestions": [],
  "medicalDisclaimer": false
}

IMPORTANT:

Every field must contain information specifically related
to the student's actual question.

Do NOT repeat the question.

Do NOT use generic educational templates.
`;

  const userPrompt = `
STUDENT QUESTION:

${query}

TARGET LANGUAGE:
${language}

EDUCATION LEVEL:
${educationLevel}

RESPONSE STYLE:
${responseStyle}

RESPONSE MODE:
${responseMode}

Answer the actual concept requested by the student.

Do not repeat the question.

Return only valid JSON.
`;

  /*
   * IMPORTANT:
   * We intentionally do NOT use responseSchema here.
   *
   * The JSON structure is described inside the prompt.
   * This avoids the current SDK schema/request error.
   */

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",

    contents: userPrompt,

    config: {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  let parsed: any;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    const match = rawText.match(
      /```json\s*([\s\S]*?)\s*```/i
    );

    if (match) {
      parsed = JSON.parse(match[1]);
    } else {
      console.error(
        "Invalid Gemini JSON:",
        rawText
      );

      throw new Error(
        "Gemini returned invalid JSON."
      );
    }
  }

  return {
    quickAnswer:
      parsed.quickAnswer || "",

    simpleExplanation:
      parsed.simpleExplanation || "",

    realWorldAnalogy:
      parsed.realWorldAnalogy || {
        analogy: "",
        explanation: "",
        targetContext: "",
      },

    detailedExplanation:
      parsed.detailedExplanation || "",

    visualization:
      parsed.visualization || {
        type: "flowchart",
        title: "",
        description: "",
        nodes: [],
        edges: [],
        steps: [],
      },

    ...(parsed.codeBlock
      ? {
          codeBlock: parsed.codeBlock,
        }
      : {}),

    ...(parsed.comparison
      ? {
          comparison: parsed.comparison,
        }
      : {}),

    keyPoints:
      Array.isArray(parsed.keyPoints)
        ? parsed.keyPoints
        : [],

    commonMistakes:
      Array.isArray(parsed.commonMistakes)
        ? parsed.commonMistakes
        : [],

    quickRevisionCards:
      Array.isArray(parsed.quickRevisionCards)
        ? parsed.quickRevisionCards
        : [],

    practiceQuestions:
      Array.isArray(parsed.practiceQuestions)
        ? parsed.practiceQuestions
        : [],

    examTips:
      Array.isArray(parsed.examTips)
        ? parsed.examTips
        : [],

    interviewQuestions:
      Array.isArray(parsed.interviewQuestions)
        ? parsed.interviewQuestions
        : [],

    medicalDisclaimer:
      Boolean(parsed.medicalDisclaimer),
  };
}