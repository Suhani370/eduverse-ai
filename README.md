# 🎓 EduVerse AI — Production AI Educational Learning Platform

<div align="center">
  <h3>Intelligent • Structured • Visual • Multilingual Interactive Learning</h3>
  <p>An enterprise-grade educational web platform transforming any complex academic concept into an intuitive, structured, visual, and exam-ready learning experience.</p>
</div>

---

## 🌟 Key Features

1. **🧠 Structured AI Educational Answers:**
   - Modular breakdown: Core Definition, Intuitive Explanation, Real-World Analogies, Mathematical Formulations with KaTeX LaTeX, Key Takeaways, Common Misconceptions, and Exam Scoring Tactics.
2. **🌐 12+ Language & Hinglish Support:**
   - Learn seamlessly in English, Hindi, Hinglish, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu, and more.
3. **📊 Adaptive Education Levels:**
   - Dynamically adapts tone, depth, and mathematical rigor for *Primary*, *Middle School*, *High School*, *College & Engineering*, *Medical*, *Commerce*, *Law*, *Professional*, and *Advanced Research*.
4. **⚡ Interactive Visual Engine & 3D Learning:**
   - Domain-specific animated scenes (Photosynthesis, Binary Search, TCP 3-Way Handshake, DNA Transcription, Heart Blood Flow, Sorting Algorithms, Linked Lists) and interactive spatial 3D models.
5. **💻 Code Lab & Algorithm Sandbox:**
   - Isolated Node.js VM sandbox for live JavaScript/TypeScript execution.
   - Transparent AI Code Analysis & Simulation for C++, Python, Java, and SQL with line-by-line breakdown and complexity analysis.
6. **📝 High-Yield Notes Studio:**
   - Instant conversion of any concept into exam-ready structured study notes with markdown export, tags, bookmarking, and printing.
7. **🎯 Diagnostic Quiz Arena:**
   - AI-generated conceptual assessments with immediate explanations, hints, timers, score analytics, and weak-topic remediation.
8. **📄 Document & Syllabus Intelligence:**
   - Upload text, markdown, or course notes (up to 10MB) for instant chapter summaries, key concept extraction, and exam questions.
9. **💬 Contextual Follow-ups & Multi-Turn Memory:**
   - Ask continuous follow-up questions within the learning thread without repeating context.
10. **🌓 Modern Responsive Dark/Light UI:**
    - High-performance UI built with Tailwind CSS, KaTeX, Lucide Icons, and accessible controls down to 320px mobile viewports.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, React Markdown, KaTeX (`rehype-katex`, `remark-math`), Motion, Canvas Confetti
- **Backend:** Node.js, Express, `vm` (Isolated Code Sandbox), `esbuild`, `tsx`
- **AI Engine:** Official Google GenAI SDK (`@google/genai`) with resilient multi-model fallback (`gemini-2.5-flash` / `gemini-2.0-flash` / `gemini-1.5-flash`)
- **Security:** Strict server-side API key handling, zero secret leakage, request payload sanitization.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+ installed on your system.
- A Google Gemini API Key (Get one free at [Google AI Studio](https://aistudio.google.com/)).

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd eduverse-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Deployment

### Build the Application
```bash
npm run build
```
This builds both the Vite frontend bundle (`dist/`) and the standalone production Express server (`dist/server.cjs`).

### Run Production Server Locally
```bash
npm run start
```

### Deploy to Railway / Render / Cloud Run
1. Connect your GitHub repository to Railway or Render.
2. Configure the build command:
   ```bash
   npm run build
   ```
3. Configure the start command:
   ```bash
   npm run start
   ```
4. Set the environment variable in the dashboard:
   - `GEMINI_API_KEY` = your Google Gemini API key
   - `PORT` = automatically set by Railway/Render
   - `NODE_ENV` = `production`

---

## 🛡️ Security & Privacy

- **Server-Side AI Integration:** The `GEMINI_API_KEY` is strictly accessed on the Node.js server. It is **never** bundled or transmitted to the client browser.
- **Safe Sandboxing:** Arbitrary user code is executed inside Node's isolated `vm` context with strict timeouts (2000ms) and restricted globals.
- **Environment Isolation:** Local `.env` files are ignored via `.gitignore` to prevent secret leaks.

---

## 📡 API Endpoints

- `GET /api/health`: System health status and Gemini configuration check.
- `POST /api/learn`: Core structured educational response generator.
- `POST /api/notes`: High-yield study notes generator.
- `POST /api/quiz`: Diagnostic assessment question generator.
- `POST /api/run-code`: Secure code runner and simulator.
- `POST /api/document-insights`: Educational document and syllabus analyzer.
