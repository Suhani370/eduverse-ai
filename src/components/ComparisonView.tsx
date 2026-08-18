import React from 'react';
import { ComparisonBlock } from '../types';
import { Columns, Sparkles, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';

interface ComparisonViewProps {
  data: ComparisonBlock;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ data }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-4" id="comparison-view">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Columns className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {data.itemA} vs {data.itemB}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{data.summary}</p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          Comparative Analysis
        </span>
      </div>

      {/* Real-World Analogy Banner */}
      {data.analogy && (
        <div className="px-5 py-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <span className="font-bold">Analogy: </span>
            <span>{data.analogy}</span>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="p-4 sm:p-5 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Dimension / Parameter</th>
              <th className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">{data.itemA}</th>
              <th className="py-2.5 px-3 text-cyan-600 dark:text-cyan-400">{data.itemB}</th>
              <th className="py-2.5 px-3 text-slate-500">Why It Matters</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {data.table.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  {row.feature}
                </td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-l-lg">
                  {row.itemAValue}
                </td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300 bg-cyan-50/30 dark:bg-cyan-950/20 rounded-r-lg">
                  {row.itemBValue}
                </td>
                <td className="py-3 px-3 text-slate-500 dark:text-slate-400 text-[11px]">
                  {row.whyItMatters}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* When to Choose Which Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 text-xs">
        <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
          <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>When to use {data.itemA}:</span>
          </div>
          <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
            {data.whenToUseA.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/50">
          <div className="font-bold text-cyan-900 dark:text-cyan-300 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>When to use {data.itemB}:</span>
          </div>
          <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 text-[11px]">
            {data.whenToUseB.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-cyan-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
