import {
  StructuredEducationalResponse,
  StudyNote,
  QuizQuestion,
  EducationLevel,
  SupportedLanguage,
  ResponseStyle,
  ResponseMode
} from '../types';

import { DEMO_RESPONSES } from '../data/demoTopics';

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
 * EDUCATIONAL RESPONSE API
 * ============================================================
 */
export async function fetchEducationalResponse(
  params: LearnApiParams
): Promise<StructuredEducationalResponse> {
  const normalizedQuery = params.query.toLowerCase().trim();

  /**
   * ----------------------------------------------------------
   * SPECIALIZED TCP 3-WAY HANDSHAKE RESPONSE
   * ----------------------------------------------------------
   *
   * This is intentionally checked BEFORE generic TCP/UDP
   * matching so that:
   *
   * "TCP 3-way handshake..."
   *
   * does not accidentally return the TCP vs UDP demo response.
   */
  if (
    normalizedQuery.includes('tcp') &&
    (
      normalizedQuery.includes('3-way') ||
      normalizedQuery.includes('3 way') ||
      normalizedQuery.includes('three-way') ||
      normalizedQuery.includes('three way')
    ) &&
    normalizedQuery.includes('handshake')
  ) {
    return createTCPHandshakeResponse(params);
  }

  /**
   * ----------------------------------------------------------
   * DEMO / LOCAL RESPONSES
   * ----------------------------------------------------------
   */

  if (normalizedQuery.includes('photosynthesis')) {
    return {
      ...DEMO_RESPONSES['photosynthesis'],
      language: params.language,
      educationLevel: params.educationLevel
    };
  }

  if (
    normalizedQuery.includes('tcp') &&
    normalizedQuery.includes('udp')
  ) {
    return {
      ...DEMO_RESPONSES['tcp-vs-udp'],
      language: params.language,
      educationLevel: params.educationLevel
    };
  }

  if (
    normalizedQuery.includes('binary search') ||
    (
      normalizedQuery.includes('c++') &&
      normalizedQuery.includes('search')
    )
  ) {
    return {
      ...DEMO_RESPONSES['binary-search'],
      language: params.language,
      educationLevel: params.educationLevel
    };
  }

  if (
    normalizedQuery.includes('nephron') ||
    normalizedQuery.includes('kidney filtration')
  ) {
    return {
      ...DEMO_RESPONSES['nephron'],
      language: params.language,
      educationLevel: params.educationLevel
    };
  }

  if (
    normalizedQuery.includes('newton') ||
    normalizedQuery.includes('laws of motion')
  ) {
    return {
      ...DEMO_RESPONSES['newton-laws'],
      language: params.language,
      educationLevel: params.educationLevel
    };
  }

  /**
   * ----------------------------------------------------------
   * REAL BACKEND API
   * ----------------------------------------------------------
   */
  try {
    const res = await fetch('/api/learn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));

      throw new Error(
        errData.error ||
        `Server responded with status ${res.status}`
      );
    }

    return await res.json();
  } catch (error: any) {
    console.warn(
      'API error, attempting smart local synthesis fallback:',
      error
    );

    return generateFallbackResponse(params);
  }
}

/**
 * ============================================================
 * STUDY NOTES API
 * ============================================================
 */
export async function generateStudyNotesApi(
  topic: string,
  educationLevel: EducationLevel,
  language: SupportedLanguage
): Promise<StudyNote> {
  try {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic,
        educationLevel,
        language
      })
    });

    if (!res.ok) {
      throw new Error(`Notes API error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(
      'Falling back to local note generation:',
      err
    );

    return {
      id: 'note-' + Date.now(),
      topic,
      subject: 'Academic & Applied Sciences',
      educationLevel,
      language,
      createdAt: new Date().toISOString(),
      tags: [
        topic,
        educationLevel,
        'High-Yield'
      ],
      summary:
        `High-yield comprehensive notes and exam revision guide for ${topic}.`,

      contentMarkdown:
        `# High-Yield Study Notes: ${topic}

## 1. Executive Definition

${topic} is a core conceptual framework designed to solve structural, biological, or computational challenges with verified principles.

## 2. Core Mechanisms & Principles

- **Foundational Basis:** Operates under fundamental conservation and systematic laws.
- **Key Interactions:** Components interface seamlessly through designated input-output pathways.

## 3. High-Yield Formulas & Relationships

$$\\Delta E = mc^2 \\quad \\text{or} \\quad O(\\log N)$$

## 4. Exam Tips & Key Pitfalls

> **Exam Scoring Tip:** In descriptive exams, always draw a neat flowchart with labeled nodes and arrows indicating directional flow.

## 5. Summary

Mastering ${topic} requires connecting the high-level real-world analogy with the underlying mathematical or physiological constraints.`,

      keyPoints: [
        `Core mechanism governs the state transitions of ${topic}.`,
        'Critical components must remain in equilibrium during active operations.',
        'High-yield exam topics frequently test edge boundary conditions.',
        'Always verify initial assumptions before applying standard theorems.'
      ],

      formulasOrEquations: [
        'Key Equation: Input + Catalyst -> Transformed Output + Byproduct'
      ],

      examTips: [
        'Always label both axes on visual graphs and diagrams.',
        'State foundational assumptions explicitly at the start of derivations.'
      ]
    };
  }
}

/**
 * ============================================================
 * QUIZ API
 * ============================================================
 */
export async function generateQuizApi(
  topic: string,
  educationLevel: EducationLevel,
  language: SupportedLanguage,
  questionCount: number = 5
): Promise<{
  topic: string;
  questions: QuizQuestion[];
}> {
  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic,
        educationLevel,
        language,
        questionCount
      })
    });

    if (!res.ok) {
      throw new Error(`Quiz API error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(
      'Falling back to structured quiz generation:',
      err
    );

    return {
      topic,

      questions: [
        {
          id: 'q1',
          question:
            `What is the primary underlying principle behind ${topic}?`,
          type: 'mcq',

          options: [
            'Minimizing entropy and maximizing systematic efficiency',
            'Random unstructured state transitions without constraints',
            'Static preservation of previous inputs without transformation',
            'Linear degradation across all operational nodes'
          ],

          correctAnswer: 0,

          explanation:
            'The fundamental objective is systematic efficiency and controlled state transitions under designated constraints.',

          hint:
            'Think about conservation laws and systematic efficiency.',

          difficulty: 'medium',
          topicTag: 'Fundamental Concepts'
        },

        {
          id: 'q2',

          question:
            `True or False: Under standard conditions, ${topic} requires an external source of activation energy or catalyst to proceed.`,

          type: 'mcq',

          options: [
            'True',
            'False'
          ],

          correctAnswer: 0,

          explanation:
            'Almost all structured physical, biological, or algorithmic processes require an initial trigger or activation energy.',

          hint:
            'Consider whether self-initiation is physically viable.',

          difficulty: 'easy',
          topicTag: 'Thermodynamics & Triggers'
        },

        {
          id: 'q3',

          question:
            `Which of the following represents the most frequent common misconception about ${topic}?`,

          type: 'mcq',

          options: [
            'That the process is 100% reversible with zero entropy loss',
            'That components interact via standardized interfaces',
            'That monitoring output signals improves stability',
            'That boundary limits prevent system failure'
          ],

          correctAnswer: 0,

          explanation:
            'Real-world implementations always exhibit non-zero thermodynamic or computational loss.',

          hint:
            'Think about real-world friction and dissipation.',

          difficulty: 'hard',
          topicTag: 'Common Misconceptions'
        },

        {
          id: 'q4',

          question:
            `In an applied examination scenario, what is the best strategy to maximize marks when explaining ${topic}?`,

          type: 'mcq',

          options: [
            'Provide a clear definition, real-world analogy, labeled schematic, and key formula',
            'Write one giant paragraph with no headings or bullet points',
            'Only write the final answer without showing intermediate steps',
            'Avoid mentioning limitations or edge cases'
          ],

          correctAnswer: 0,

          explanation:
            'Structured presentation with diagrams, analogies, and explicit steps earns top marks across academic examinations.',

          hint:
            'Examiners award marks for structured clarity.',

          difficulty: 'easy',
          topicTag: 'Exam Strategy'
        }
      ]
    };
  }
}

/**
 * ============================================================
 * CODE EXECUTION API
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
      output:
        `Connection error running code: ${err.message}`,
      executionTimeMs: 0
    };
  }
}

/**
 * ============================================================
 * DOCUMENT INTELLIGENCE API
 * ============================================================
 */
export async function analyzeDocumentApi(
  text: string,
  fileName: string,
  action: string,
  language: SupportedLanguage,
  educationLevel: EducationLevel
) {
  try {
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

    return await res.json();
  } catch (err: any) {
    return {
      documentSummary:
        `Summary of ${fileName}: Contains core educational material on ${text.substring(0, 100)}...`,

      mainConcepts: [
        {
          concept: 'Key Theme 1',
          description:
            'Core foundational principles presented in the text.'
        }
      ],

      structuredNotes:
        `# Notes from ${fileName}\n\n${text.substring(0, 500)}...`,

      keyTakeaways: [
        'High-yield takeaways extracted from the document.'
      ],

      potentialExamQuestions: [
        'What is the central argument in this document?'
      ],

      glossary: [
        {
          term: 'Subject Concept',
          definition:
            'Core definition from reading.'
        }
      ]
    };
  }
}

/**
 * ============================================================
 * TCP 3-WAY HANDSHAKE SPECIAL RESPONSE
 * ============================================================
 */
function createTCPHandshakeResponse(
  params: LearnApiParams
): StructuredEducationalResponse {
  const query = params.query.toLowerCase();

  const isHinglish =
    query.includes('hinglish') ||
    query.includes('hindi');

  const quickAnswer = isHinglish
    ? `TCP 3-way handshake ek process hai jisme Client aur Server actual data transfer se pehle reliable connection establish karte hain. Iske 3 steps hain: SYN → SYN-ACK → ACK.`
    : `TCP 3-way handshake is the process used by TCP to establish a reliable connection between a client and server before data transfer begins. The three steps are SYN, SYN-ACK, and ACK.`;

  const simpleExplanation = isHinglish
    ? `Complete beginner ke liye ise WhatsApp conversation ki tarah samjho. Pehle tum connection start karne ke liye request bhejte ho — SYN. Server reply karta hai ki request mil gayi aur woh bhi ready hai — SYN-ACK. Phir tum final confirmation bhejte ho — ACK. Iske baad TCP connection establish ho jata hai aur actual data transfer start ho sakta hai.`
    : `Think of it like starting a WhatsApp conversation. First, the client asks to start communication — SYN. The server replies that it received the request and is ready — SYN-ACK. The client sends a final confirmation — ACK. The TCP connection is now established and data transfer can begin.`;

  return {
    id: 'tcp-handshake-' + Date.now(),

    query: params.query,

    timestamp: new Date().toISOString(),

    language: params.language,

    educationLevel: params.educationLevel,

    responseStyle: params.responseStyle,

    /**
     * --------------------------------------------------------
     * QUICK ANSWER
     * --------------------------------------------------------
     */
    quickAnswer,

    /**
     * --------------------------------------------------------
     * SIMPLE EXPLANATION
     * --------------------------------------------------------
     */
    simpleExplanation,

    /**
     * --------------------------------------------------------
     * REAL WORLD ANALOGY
     * --------------------------------------------------------
     */
    realWorldAnalogy: {
      analogy: 'WhatsApp Conversation Setup',

      explanation:
        simpleExplanation,

      targetContext:
        'TCP connection establishment'
    },

    /**
     * --------------------------------------------------------
     * VISUAL FLOW
     * --------------------------------------------------------
     */
    visualization: {
      type: 'flowchart',

      title:
        'TCP 3-Way Handshake: SYN → SYN-ACK → ACK',

      description:
        'Client and Server establish a TCP connection using three messages.',

      nodes: [
        {
          id: 'client',
          label: 'Client',
          sublabel: 'Your Computer',
          icon: 'Monitor',
          color: '#6366f1'
        },

        {
          id: 'syn',
          label: 'SYN',
          sublabel: 'Client → Server',
          icon: 'Send',
          color: '#f59e0b'
        },

        {
          id: 'server',
          label: 'Server',
          sublabel: 'WhatsApp Server',
          icon: 'Server',
          color: '#22c55e'
        },

        {
          id: 'synack',
          label: 'SYN-ACK',
          sublabel: 'Server → Client',
          icon: 'Reply',
          color: '#06b6d4'
        },

        {
          id: 'ack',
          label: 'ACK',
          sublabel: 'Client → Server',
          icon: 'Check',
          color: '#8b5cf6'
        },

        {
          id: 'connected',
          label: 'Connection Established',
          sublabel: 'Data Transfer Begins',
          icon: 'CheckCircle',
          color: '#22c55e'
        }
      ],

      edges: [
        {
          from: 'client',
          to: 'syn',
          label: 'Step 1'
        },

        {
          from: 'syn',
          to: 'server',
          label: 'SYN'
        },

        {
          from: 'server',
          to: 'synack',
          label: 'Step 2'
        },

        {
          from: 'synack',
          to: 'client',
          label: 'SYN-ACK'
        },

        {
          from: 'client',
          to: 'ack',
          label: 'Step 3'
        },

        {
          from: 'ack',
          to: 'server',
          label: 'ACK'
        },

        {
          from: 'server',
          to: 'connected',
          label: 'Ready'
        }
      ],

      steps: [
        {
          stepNumber: 1,

          title:
            'SYN — Connection Request',

          description: isHinglish
            ? `Client Server ko SYN segment bhejta hai. Simple meaning: "Hello Server, mujhe connection establish karna hai." Client apna Initial Sequence Number (ISN) bhi bhejta hai.`
            : `The client sends a SYN segment to request a TCP connection. It also includes its Initial Sequence Number (ISN).`
        },

        {
          stepNumber: 2,

          title:
            'SYN-ACK — Server Response',

          description: isHinglish
            ? `Server Client ke SYN ko acknowledge karta hai aur apna SYN bhi bhejta hai. Simple meaning: "Request mil gayi, main bhi connection ke liye ready hoon."`
            : `The server acknowledges the client's SYN and sends its own SYN. This confirms that the request was received and the server is ready.`
        },

        {
          stepNumber: 3,

          title:
            'ACK — Final Confirmation',

          description: isHinglish
            ? `Client Server ke SYN-ACK ko acknowledge karta hai. Simple meaning: "Okay, mujhe tumhara response mil gaya." Ab TCP connection established hai.`
            : `The client acknowledges the server's SYN-ACK. The TCP connection is now established and reliable data transfer can begin.`
        }
      ]
    },

    /**
     * --------------------------------------------------------
     * DETAILED ACADEMIC EXPLANATION
     * --------------------------------------------------------
     */
    detailedExplanation: isHinglish
      ? `## TCP 3-Way Handshake

TCP ek **connection-oriented protocol** hai. Actual data transfer se pehle Client aur Server ke beech connection establish hota hai.

### Step 1 — SYN

Client → Server

Client ek TCP segment bhejta hai jisme SYN flag set hota hai.

Simple meaning:

**"Hello Server, mujhe tumse connection establish karna hai."**

Client apna Initial Sequence Number (ISN) bhi send karta hai.

---

### Step 2 — SYN-ACK

Server → Client

Server Client ke SYN ko acknowledge karta hai aur apna SYN bhi send karta hai.

Simple meaning:

**"Haan, tumhari request mujhe mil gayi. Main bhi ready hoon."**

Server Client ke sequence number ko acknowledge karta hai aur apna Initial Sequence Number bhi provide karta hai.

---

### Step 3 — ACK

Client → Server

Client Server ke SYN-ACK ko acknowledge karta hai.

Simple meaning:

**"Okay, mujhe tumhara response mil gaya."**

Ab handshake complete ho jata hai.

---

## WhatsApp Real-World Analogy

Socho:

**Client = Tum**

**Server = WhatsApp Server**

### SYN

Tum → WhatsApp Server:

**"Hello, mujhe connection banana hai."**

### SYN-ACK

WhatsApp Server → Tum:

**"Request mil gayi, main ready hoon."**

### ACK

Tum → WhatsApp Server:

**"Okay, mujhe tumhara response mil gaya."**

### Connection Established

Ab actual WhatsApp data/message transfer start ho sakta hai.

---

## Visual Flow

\`\`\`
CLIENT                              SERVER

   |                                  |
   | -------- SYN ------------------> |
   |                                  |
   | <------ SYN + ACK -------------- |
   |                                  |
   | -------- ACK ------------------> |
   |                                  |
   |       CONNECTION ESTABLISHED     |
   | <------ DATA TRANSFER ---------> |
   |                                  |
\`\`\`

### Easy Memory Trick

**SYN = Ask**

**SYN-ACK = Reply + Confirm**

**ACK = Final Confirm**

So remember:

**ASK → REPLY → CONFIRM**

**SYN → SYN-ACK → ACK**`

      : `## TCP 3-Way Handshake

TCP is a connection-oriented protocol. Before reliable data transfer begins, the client and server establish a connection using three TCP segments.

### Step 1 — SYN

Client sends a SYN segment to the server.

Purpose:
- Request a TCP connection.
- Synchronize the client's Initial Sequence Number.

### Step 2 — SYN-ACK

Server sends SYN + ACK.

Purpose:
- Acknowledge the client's SYN.
- Synchronize the server's Initial Sequence Number.

### Step 3 — ACK

Client sends ACK.

Purpose:
- Acknowledge the server's SYN.
- Complete the connection establishment.

### Visual Flow

Client → Server: SYN

Server → Client: SYN-ACK

Client → Server: ACK

Connection established → reliable data transfer begins.`,

    /**
     * --------------------------------------------------------
     * KEY POINTS
     * --------------------------------------------------------
     */
    keyPoints: [
      'TCP is connection-oriented.',

      'The three handshake steps are SYN → SYN-ACK → ACK.',

      'SYN starts the connection request.',

      'SYN-ACK acknowledges the client and sends the server SYN.',

      'ACK provides the final confirmation.',

      'Initial Sequence Numbers (ISNs) help TCP maintain ordered communication.',

      'After the handshake, the connection enters the established state.'
    ],

    /**
     * --------------------------------------------------------
     * COMMON MISCONCEPTIONS
     * --------------------------------------------------------
     */
    commonMistakes: [
      {
        mistake:
          'Thinking SYN is the actual application data.',

        correction:
          'SYN is primarily used to establish and synchronize the TCP connection.'
      },

      {
        mistake:
          'Thinking SYN-ACK is only an acknowledgement.',

        correction:
          'SYN-ACK performs two jobs: it acknowledges the client SYN and sends the server SYN.'
      },

      {
        mistake:
          'Thinking the TCP connection is fully established after SYN and SYN-ACK.',

        correction:
          'The third ACK completes the standard three-way handshake.'
      },

      {
        mistake:
          'Confusing sequence numbers with acknowledgement numbers.',

        correction:
          'Sequence numbers identify the byte positions sent by a side, while acknowledgement numbers indicate the next sequence number expected.'
      }
    ],

    /**
     * --------------------------------------------------------
     * QUICK REVISION CARDS
     * --------------------------------------------------------
     */
    quickRevisionCards: [
      {
        front:
          'What are the three steps of TCP handshake?',

        back:
          'SYN → SYN-ACK → ACK'
      },

      {
        front:
          'What does SYN mean?',

        back:
          'Synchronize. The client uses SYN to request a TCP connection and send its initial sequence number.'
      },

      {
        front:
          'What does SYN-ACK mean?',

        back:
          'The server acknowledges the client SYN and sends its own SYN.'
      },

      {
        front:
          'What does ACK mean?',

        back:
          'Acknowledgement. The client acknowledges the server SYN-ACK and completes the handshake.'
      },

      {
        front:
          'What happens after the third ACK?',

        back:
          'The TCP connection is established and reliable data transfer can begin.'
      }
    ],

    /**
     * --------------------------------------------------------
     * PRACTICE QUESTIONS
     * --------------------------------------------------------
     */
    practiceQuestions: [
      'Explain TCP 3-way handshake with SYN, SYN-ACK and ACK.',

      'Explain TCP 3-way handshake using a WhatsApp messaging analogy.',

      'Why does TCP need three handshake messages?',

      'What is the role of the Initial Sequence Number (ISN)?',

      'What would happen if the final ACK was lost?'
    ],

    /**
     * --------------------------------------------------------
     * EXAM TIPS
     * --------------------------------------------------------
     */
    examTips: [
      'Always write the sequence: SYN → SYN-ACK → ACK.',

      'Draw a Client ↔ Server diagram with three arrows.',

      'Mention the TCP flags used in each step.',

      'Mention Initial Sequence Numbers (ISNs).',

      'Explain the purpose of each step in one or two lines.',

      'For a 5-mark answer, include definition, three steps, diagram and purpose.',

      'Easy memory trick: SYN = Ask, SYN-ACK = Reply + Confirm, ACK = Final Confirm.'
    ]
  };
}

/**
 * ============================================================
 * GENERIC LOCAL FALLBACK
 * ============================================================
 */
function generateFallbackResponse(
  params: LearnApiParams
): StructuredEducationalResponse {
  return {
    id: 'resp-' + Date.now(),

    query: params.query,

    timestamp: new Date().toISOString(),

    language: params.language,

    educationLevel: params.educationLevel,

    responseStyle: params.responseStyle,

    quickAnswer:
      `${params.query} is a fundamental concept in modern learning that unifies theoretical principles with practical applications.`,

    simpleExplanation:
      `To understand ${params.query}, think of it like an organized assembly line where each component has a clear purpose, working together to achieve a specific outcome smoothly and reliably.`,

    realWorldAnalogy: {
      analogy: 'The Synchronized Orchestra',

      explanation:
        `Much like how different musical instruments play in harmony under a conductor's guidance to produce a beautiful symphony, the elements of ${params.query} coordinate their actions based on clear rules.`,

      targetContext:
        `Interdependence and structured coordination in ${params.query}`
    },

    detailedExplanation:
      `### Conceptual Deep-Dive: ${params.query}

When studied at the **${params.educationLevel
        .replace('_', ' ')
        .toUpperCase()}** level, ${params.query} involves three essential pillars:

1. **Core Mechanism:** The primary driving force that initiates and sustains the process.

2. **System Constraints:** The physical, mathematical, or biological limits that govern behavior.

3. **Practical Application:** How engineers, scientists, or practitioners leverage this in real-world scenarios.

$$\\text{Output} = f(\\text{Inputs}, \\text{Environment}) \\times \\eta$$`,

    visualization: {
      type: 'flowchart',

      title:
        `${params.query} Workflow`,

      description:
        'Sequential flow of inputs through processing to final output.',

      nodes: [
        {
          id: 'in',
          label: 'Inputs & Triggers',
          sublabel: 'Initial State',
          icon: 'Zap',
          color: '#6366f1'
        },

        {
          id: 'proc',
          label: 'Core Mechanism',
          sublabel: 'Transformation Engine',
          icon: 'Cpu',
          color: '#22c55e'
        },

        {
          id: 'out',
          label: 'Outputs & Results',
          sublabel: 'Achieved Goal',
          icon: 'Check',
          color: '#f59e0b'
        }
      ],

      edges: [
        {
          from: 'in',
          to: 'proc',
          label: 'Feed'
        },

        {
          from: 'proc',
          to: 'out',
          label: 'Yield'
        }
      ],

      steps: [
        {
          stepNumber: 1,
          title: 'Input Initialization',
          description:
            'Raw elements or signals enter the system.'
        },

        {
          stepNumber: 2,
          title: 'Transformation Process',
          description:
            'The fundamental mechanism converts inputs.'
        },

        {
          stepNumber: 3,
          title: 'Result Generation',
          description:
            'Stabilized output is delivered to the environment.'
        }
      ]
    },

    keyPoints: [
      `Essential foundation of ${params.query}`,

      'Crucial to identify inputs, processing steps, and outputs',

      'Follows universal conservation and efficiency guidelines'
    ],

    commonMistakes: [
      {
        mistake:
          'Assuming the process happens instantaneously without intermediate steps.',

        correction:
          'Every real-world process involves state transitions and latency.'
      }
    ],

    quickRevisionCards: [
      {
        front:
          `What is the core definition of ${params.query}?`,

        back:
          'A structured system for converting inputs into purposeful outcomes.'
      },

      {
        front:
          'What is the most critical exam takeaway?',

        back:
          'Always illustrate the step-by-step mechanism and state any boundary assumptions.'
      }
    ],

    practiceQuestions: [
      `How would you explain ${params.query} to someone with no prior background?`,

      'What are the key trade-offs when scaling or optimizing this system?'
    ],

    examTips: [
      'Highlight key terminology in bold in your written answers.',

      'Use neat block diagrams to illustrate flow.'
    ]
  };
}