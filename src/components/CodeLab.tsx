import React, { useState } from 'react';
import { CodeExplanationBlock } from '../types';
import { runCodeApi } from '../services/api';
import {
  Code2,
  Play,
  Copy,
  Check,
  Terminal,
  Clock,
  HardDrive,
  AlertTriangle,
  Lightbulb,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CodeLabProps {
  data: CodeExplanationBlock;
}

export const CodeLab: React.FC<CodeLabProps> = ({ data }) => {
  const [code, setCode] = useState(data.code);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [executionStats, setExecutionStats] = useState<{ time: number; type: string } | null>(null);
  const [showLineByLine, setShowLineByLine] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setTerminalOutput(null);
    try {
      const res = await runCodeApi(code, data.language.toLowerCase());
      setTerminalOutput(res.output);
      setExecutionStats({
        time: res.executionTimeMs,
        type: res.sandboxType || 'Sandbox'
      });
    } catch (err: any) {
      setTerminalOutput(`Error executing code: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden my-4" id="code-learning-lab">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {data.algorithmName || 'Code Implementation'}
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                {data.language.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{data.summary}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-sm shadow-emerald-500/30 transition-all cursor-pointer"
          >
            {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Complexity Badges */}
      <div className="flex items-center gap-4 px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Time:</span>
          <span className="font-mono font-bold text-amber-300">{data.timeComplexity}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Space:</span>
          <span className="font-mono font-bold text-cyan-300">{data.spaceComplexity}</span>
        </div>
      </div>

      {/* Code Editor & Display Area */}
      <div className="relative">
        <pre className="p-5 text-xs sm:text-sm font-mono overflow-x-auto text-cyan-200 bg-slate-950 leading-relaxed max-h-[380px] scrollbar-thin">
          <code>{code}</code>
        </pre>
      </div>

      {/* Live Terminal Output Console */}
      {terminalOutput !== null && (
        <div className="border-t border-slate-800 bg-black/90 p-4 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800/80 mb-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-slate-200">Terminal Stdout</span>
              {executionStats && (
                <span className="text-[10px] text-slate-500">
                  ({executionStats.type} • {executionStats.time}ms)
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setTerminalOutput(null)}
              className="text-[10px] hover:text-slate-200 text-slate-400"
            >
              Clear
            </button>
          </div>
          <pre className="text-emerald-400 whitespace-pre-wrap">{terminalOutput}</pre>
        </div>
      )}

      {/* Line-by-Line Breakdown Accordion */}
      {data.lineByLine && data.lineByLine.length > 0 && (
        <div className="border-t border-slate-800 bg-slate-900/90 p-4">
          <button
            type="button"
            onClick={() => setShowLineByLine(prev => !prev)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Line-by-Line Code Breakdown & Logic</span>
            </div>
            {showLineByLine ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showLineByLine && (
            <div className="mt-3 space-y-2">
              {data.lineByLine.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="font-mono font-bold text-cyan-400 shrink-0 px-1.5 py-0.5 rounded bg-slate-800">
                    {item.lineRange}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{item.explanation}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edge Cases & Common Pitfalls */}
      {(data.edgeCases?.length || data.commonMistakes?.length) ? (
        <div className="border-t border-slate-800 bg-slate-950/60 p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {data.edgeCases && data.edgeCases.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-cyan-400 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Critical Edge Cases</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {data.edgeCases.map((ec, i) => (
                  <li key={i}>{ec}</li>
                ))}
              </ul>
            </div>
          )}

          {data.commonMistakes && data.commonMistakes.length > 0 && (
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="font-bold text-rose-400 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Common Coding Pitfalls</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                {data.commonMistakes.map((cm, i) => (
                  <li key={i}>{cm}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
