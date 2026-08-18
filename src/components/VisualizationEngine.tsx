import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Cpu,
  Database,
  GitBranch,
  Heart,
  Layers,
  Lightbulb,
  Play,
  RotateCcw,
  Server,
  Sparkles,
  Square,
  Sun,
  Target,
  Waves,
  Wind,
  Zap,
} from 'lucide-react';

interface VisualizationNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  color?: string;
}

interface VisualizationEdge {
  from: string;
  to: string;
  label?: string;
}

interface VisualizationStep {
  stepNumber: number;
  title: string;
  description: string;
  analogy?: string;
}

interface VisualizationData {
  type?: string;
  title?: string;
  description?: string;
  nodes?: VisualizationNode[];
  edges?: VisualizationEdge[];
  steps?: VisualizationStep[];
}

interface VisualizationEngineProps {
  data: VisualizationData;
  queryTopic?: string;
}

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Cpu,
  Check,
  Database,
  Server,
  Target,
  Lightbulb,
  GitBranch,
  Layers,
  Sparkles,
  CircleDot,
  Sun,
  Wind,
  Waves,
  Heart,
};

const fallbackColors = [
  '#6366f1',
  '#06b6d4',
  '#22c55e',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
];

const getIcon = (icon?: string) => {
  if (!icon) return Sparkles;
  return iconMap[icon] || Sparkles;
};

const normalizeTopic = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim();

type VisualMode =
  | 'photosynthesis'
  | 'binary-search'
  | 'tcp'
  | 'dna'
  | 'heart'
  | 'generic';

const detectVisualMode = (
  queryTopic: string,
  data: VisualizationData,
): VisualMode => {
  const text = normalizeTopic(
    `${queryTopic} ${data.title || ''} ${data.description || ''}`,
  );

  if (
    text.includes('photosynthesis') ||
    text.includes('photosynthesis process')
  ) {
    return 'photosynthesis';
  }

  if (
    text.includes('binary search') ||
    text.includes('binary-search') ||
    text.includes('binarysearch')
  ) {
    return 'binary-search';
  }

  if (
    text.includes('tcp') ||
    text.includes('udp') ||
    text.includes('network handshake') ||
    text.includes('three way handshake')
  ) {
    return 'tcp';
  }

  if (
    text.includes('dna') ||
    text.includes('double helix') ||
    text.includes('genetics')
  ) {
    return 'dna';
  }

  if (
    text.includes('heart') ||
    text.includes('cardiac') ||
    text.includes('blood circulation')
  ) {
    return 'heart';
  }

  return 'generic';
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/* -------------------------------------------------------------------------- */
/*                         VISUAL SCENE COMPONENTS                            */
/* -------------------------------------------------------------------------- */

const PhotosynthesisScene: React.FC<{ step: number }> = ({ step }) => {
  const stage = clamp(step, 0, 3);

  return (
    <div className="relative min-h-[310px] overflow-hidden rounded-3xl border border-emerald-400/10 bg-gradient-to-br from-[#071a1b] via-[#071322] to-[#10142d] p-5">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 blur-3xl" />
      </div>

      {/* Sun */}
      <div
        className={`absolute right-8 top-7 transition-all duration-700 ${
          stage >= 1 ? 'scale-110 opacity-100' : 'scale-90 opacity-40'
        }`}
      >
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-yellow-300 shadow-[0_0_55px_rgba(250,204,21,.45)]">
          <Sun className="h-10 w-10 text-yellow-700" />
        </div>

        {stage >= 1 && (
          <>
            <span className="absolute left-1/2 top-20 h-28 w-1 origin-top -rotate-12 animate-pulse bg-gradient-to-b from-yellow-300/80 to-transparent" />
            <span className="absolute left-1/2 top-20 h-28 w-1 origin-top rotate-12 animate-pulse bg-gradient-to-b from-yellow-300/80 to-transparent" />
          </>
        )}
      </div>

      {/* CO2 */}
      <div
        className={`absolute left-8 top-12 transition-all duration-700 ${
          stage >= 1 ? 'translate-x-3 opacity-100' : 'opacity-50'
        }`}
      >
        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3">
          <div className="text-[9px] font-bold uppercase tracking-widest text-cyan-300">
            From air
          </div>
          <div className="mt-1 text-lg font-black text-white">CO₂</div>
        </div>
      </div>

      {/* Water */}
      <div
        className={`absolute bottom-12 left-7 transition-all duration-700 ${
          stage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-40'
        }`}
      >
        <div className="rounded-2xl border border-blue-400/30 bg-blue-400/10 px-4 py-3">
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-300">
            From roots
          </div>
          <div className="mt-1 flex items-center gap-2 text-lg font-black text-white">
            <Waves className="h-4 w-4 text-blue-400" />
            H₂O
          </div>
        </div>
      </div>

      {/* Plant */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <div className="relative h-48 w-48">
          {/* stem */}
          <div className="absolute bottom-0 left-1/2 h-36 w-2 -translate-x-1/2 rounded-full bg-emerald-500" />

          {/* leaves */}
          <div
            className={`absolute left-5 top-14 h-20 w-28 -rotate-12 rounded-[100%_0_100%_0] bg-gradient-to-br from-emerald-400 to-green-700 shadow-lg transition-all duration-700 ${
              stage >= 1 ? 'scale-100' : 'scale-75 opacity-50'
            }`}
          />

          <div
            className={`absolute right-5 top-24 h-20 w-28 rotate-12 rounded-[0_100%_0_100%] bg-gradient-to-br from-green-400 to-emerald-700 shadow-lg transition-all duration-700 ${
              stage >= 1 ? 'scale-100' : 'scale-75 opacity-50'
            }`}
          />

          {/* chloroplast */}
          {stage >= 2 && (
            <div className="absolute left-1/2 top-24 flex h-14 w-20 -translate-x-1/2 items-center justify-center rounded-xl border border-green-300/40 bg-green-400/10 text-[9px] font-black uppercase tracking-widest text-green-300 shadow-[0_0_25px_rgba(34,197,94,.25)]">
              Chloroplast
            </div>
          )}
        </div>
      </div>

      {/* Output */}
      <div
        className={`absolute bottom-9 right-6 transition-all duration-700 ${
          stage >= 3
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-4 scale-90 opacity-30'
        }`}
      >
        <div className="space-y-2">
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-center">
            <div className="text-[8px] uppercase tracking-widest text-amber-300">
              Food
            </div>
            <div className="text-sm font-black text-white">Glucose 🍬</div>
          </div>

          <div className="rounded-xl border border-sky-400/30 bg-sky-400/10 px-3 py-2 text-center">
            <div className="text-[8px] uppercase tracking-widest text-sky-300">
              Released
            </div>
            <div className="text-sm font-black text-white">O₂ 💨</div>
          </div>
        </div>
      </div>

      {/* Stage labels */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 backdrop-blur">
        {stage === 0 && 'Inputs'}
        {stage === 1 && 'Light + Raw Materials'}
        {stage === 2 && 'Chloroplast Processing'}
        {stage === 3 && 'Glucose + Oxygen'}
      </div>
    </div>
  );
};

const BinarySearchScene: React.FC<{ step: number }> = ({ step }) => {
  const values = [3, 8, 12, 17, 24, 31, 42, 56, 71];
  const target = 42;

  const ranges = [
    [0, 8],
    [5, 8],
    [6, 8],
    [6, 6],
  ];

  const [left, right] = ranges[clamp(step, 0, ranges.length - 1)];
  const middle = Math.floor((left + right) / 2);

  return (
    <div className="rounded-3xl border border-indigo-400/10 bg-gradient-to-br from-[#080d26] to-[#111936] p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-indigo-300">
            Binary Search
          </div>
          <div className="mt-1 text-sm font-bold text-white">
            Find target <span className="text-cyan-300">{target}</span>
          </div>
        </div>

        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-bold text-cyan-300">
          Sorted Array
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {values.map((value, index) => {
          const isMiddle = index === middle;
          const eliminated = index < left || index > right;
          const found = value === target && step >= 3;

          return (
            <div
              key={value}
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border text-sm font-black transition-all duration-700 ${
                found
                  ? 'scale-110 border-emerald-400 bg-emerald-400/20 text-emerald-300 shadow-[0_0_30px_rgba(34,197,94,.3)]'
                  : isMiddle
                  ? 'scale-110 border-indigo-400 bg-indigo-500/20 text-white shadow-[0_0_30px_rgba(99,102,241,.3)]'
                  : eliminated
                  ? 'border-white/5 bg-white/[0.02] text-slate-700'
                  : 'border-white/10 bg-white/5 text-slate-200'
              }`}
            >
              {value}

              {isMiddle && !found && (
                <span className="absolute -top-6 text-[8px] font-bold uppercase tracking-wider text-indigo-300">
                  middle
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-7 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-[8px] uppercase tracking-widest text-slate-500">
            Left
          </div>
          <div className="mt-1 text-sm font-black text-white">{left}</div>
        </div>

        <div className="rounded-xl bg-indigo-500/10 p-3">
          <div className="text-[8px] uppercase tracking-widest text-indigo-300">
            Middle
          </div>
          <div className="mt-1 text-sm font-black text-indigo-200">
            {middle}
          </div>
        </div>

        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-[8px] uppercase tracking-widest text-slate-500">
            Right
          </div>
          <div className="mt-1 text-sm font-black text-white">{right}</div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-slate-400">
        {step === 0 && 'Start with the complete search range.'}
        {step === 1 && '42 is greater than the middle value, so ignore the left half.'}
        {step === 2 && 'The search range becomes smaller.'}
        {step >= 3 && 'Target 42 found! Binary search reduces the work logarithmically.'}
      </div>
    </div>
  );
};

const TcpScene: React.FC<{ step: number }> = ({ step }) => {
  const stage = clamp(step, 0, 3);

  const messages = [
    'Client → Server: SYN',
    'Server → Client: SYN + ACK',
    'Client → Server: ACK',
    'Connection established',
  ];

  return (
    <div className="rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-[#061522] to-[#081329] p-5">
      <div className="mb-6 text-center">
        <div className="text-[9px] font-bold uppercase tracking-widest text-cyan-300">
          Network visualization
        </div>
        <div className="mt-1 text-sm font-bold text-white">
          TCP Three-Way Handshake
        </div>
      </div>

      <div className="relative mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-400/10">
              <Database className="h-7 w-7 text-indigo-300" />
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              CLIENT
            </span>
          </div>

          <div className="mx-4 flex-1">
            <div className="relative h-1 rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 transition-all duration-700"
                style={{
                  width: `${(stage / 3) * 100}%`,
                }}
              />
            </div>

            <div className="mt-4 text-center text-[10px] font-bold text-cyan-300">
              {messages[stage]}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10">
              <Server className="h-7 w-7 text-emerald-300" />
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              SERVER
            </span>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-3">
          {['SYN', 'SYN + ACK', 'ACK'].map((packet, index) => (
            <div
              key={packet}
              className={`rounded-xl border p-3 text-center transition-all duration-500 ${
                index < stage
                  ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                  : 'border-white/10 bg-white/5 text-slate-600'
              }`}
            >
              <div className="text-[8px] uppercase tracking-widest">
                Packet {index + 1}
              </div>
              <div className="mt-1 text-xs font-black">{packet}</div>
            </div>
          ))}
        </div>

        {stage === 3 && (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs font-bold text-emerald-300">
            <Check className="h-4 w-4" />
            Secure connection established
          </div>
        )}
      </div>
    </div>
  );
};

const DnaScene: React.FC<{ step: number }> = ({ step }) => {
  const pairs = 7;
  const progress = clamp(step, 0, 3);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-fuchsia-400/10 bg-gradient-to-br from-[#17071c] via-[#100c23] to-[#06172a] p-5">
      <div className="mb-4 text-center">
        <div className="text-[9px] font-bold uppercase tracking-widest text-fuchsia-300">
          Molecular visualization
        </div>
        <div className="mt-1 text-sm font-bold text-white">
          DNA Double Helix
        </div>
      </div>

      <div className="relative mx-auto h-[260px] max-w-[500px]">
        {Array.from({ length: pairs }).map((_, index) => {
          const y = 22 + index * 34;
          const phase = index * 0.85 + progress * 0.8;
          const left = 50 + Math.sin(phase) * 70;
          const right = 50 - Math.sin(phase) * 70;

          return (
            <div key={index}>
              <div
                className="absolute h-3 w-3 rounded-full bg-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,.6)] transition-all duration-700"
                style={{
                  left: `${left}%`,
                  top: y,
                  transform: 'translateX(-50%)',
                }}
              />

              <div
                className="absolute h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,.6)] transition-all duration-700"
                style={{
                  left: `${right}%`,
                  top: y,
                  transform: 'translateX(-50%)',
                }}
              />

              <div
                className="absolute h-[2px] bg-white/30 transition-all duration-700"
                style={{
                  left: `${Math.min(left, right)}%`,
                  top: y + 5,
                  width: `${Math.abs(left - right)}%`,
                }}
              />
            </div>
          );
        })}

        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 backdrop-blur">
          A • T • G • C base pairs
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-4 text-[9px] font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1.5 text-fuchsia-300">
          <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
          Strand A
        </span>

        <span className="flex items-center gap-1.5 text-cyan-300">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          Strand B
        </span>
      </div>
    </div>
  );
};

const HeartScene: React.FC<{ step: number }> = ({ step }) => {
  const stage = clamp(step, 0, 3);

  return (
    <div className="rounded-3xl border border-rose-400/10 bg-gradient-to-br from-[#210a17] to-[#0d1128] p-5">
      <div className="mb-5 text-center">
        <div className="text-[9px] font-bold uppercase tracking-widest text-rose-300">
          Biological visualization
        </div>
        <div className="mt-1 text-sm font-bold text-white">
          Blood Flow Through the Heart
        </div>
      </div>

      <div className="relative mx-auto h-[260px] max-w-[550px]">
        <div
          className={`absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[45%_55%_48%_52%] border-2 border-rose-400/30 bg-rose-500/10 shadow-[0_0_60px_rgba(244,63,94,.18)] transition-transform duration-500 ${
            stage % 2 === 1 ? 'scale-110' : 'scale-100'
          }`}
        >
          <Heart className="h-20 w-20 fill-rose-500/20 text-rose-400" />
        </div>

        <div
          className={`absolute left-4 top-12 rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-3 transition-all duration-700 ${
            stage >= 0 ? 'opacity-100' : 'opacity-30'
          }`}
        >
          <div className="text-[8px] uppercase tracking-widest text-blue-300">
            From body
          </div>
          <div className="mt-1 text-xs font-black text-white">
            Deoxygenated
          </div>
        </div>

        <div
          className={`absolute right-4 top-12 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 transition-all duration-700 ${
            stage >= 2 ? 'opacity-100' : 'opacity-30'
          }`}
        >
          <div className="text-[8px] uppercase tracking-widest text-red-300">
            To body
          </div>
          <div className="mt-1 text-xs font-black text-white">
            Oxygenated
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center">
          <div className="text-[8px] uppercase tracking-widest text-slate-500">
            Current stage
          </div>
          <div className="mt-1 text-xs font-black text-white">
            {stage === 0 && 'Receiving blood'}
            {stage === 1 && 'Pumping to lungs'}
            {stage === 2 && 'Receiving oxygenated blood'}
            {stage === 3 && 'Pumping to body'}
          </div>
        </div>
      </div>
    </div>
  );
};

const GenericScene: React.FC<{
  nodes: VisualizationNode[];
  activeStep: number;
  onSelect: (node: VisualizationNode) => void;
  selectedNode: VisualizationNode | null;
}> = ({ nodes, activeStep, onSelect, selectedNode }) => {
  return (
    <div className="overflow-x-auto rounded-3xl border border-indigo-400/10 bg-gradient-to-br from-[#070b22] to-[#10152e] p-5">
      <div className="flex min-w-[720px] items-center justify-center gap-3">
        {nodes.map((node, index) => {
          const Icon = getIcon(node.icon);
          const color =
            node.color || fallbackColors[index % fallbackColors.length];
          const active = index <= activeStep;
          const selected = selectedNode?.id === node.id;

          return (
            <React.Fragment key={node.id}>
              <button
                type="button"
                onClick={() => onSelect(node)}
                className={`group relative w-[190px] rounded-2xl border p-4 text-left transition-all duration-500 ${
                  selected
                    ? 'scale-105 border-indigo-400 bg-indigo-500/15'
                    : active
                    ? 'border-white/20 bg-white/[0.07]'
                    : 'border-white/10 bg-white/[0.03] opacity-60'
                }`}
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                  style={{ backgroundColor: color }}
                />

                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${color}22`,
                        color,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                      Step {index + 1}
                    </span>
                  </div>

                  <div className="text-sm font-black text-white">
                    {node.label}
                  </div>

                  <div className="mt-1 min-h-[32px] text-[10px] leading-5 text-slate-400">
                    {node.sublabel || 'Interactive concept stage'}
                  </div>

                  <div
                    className="mt-4 h-1 rounded-full transition-all duration-700"
                    style={{
                      width: active ? '100%' : '25%',
                      backgroundColor: active ? color : '#1e293b',
                    }}
                  />
                </div>
              </button>

              {index < nodes.length - 1 && (
                <div className="flex w-12 shrink-0 items-center justify-center">
                  <ArrowRight
                    className={`h-5 w-5 transition-colors duration-500 ${
                      activeStep > index
                        ? 'text-cyan-400'
                        : 'text-slate-700'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                           MAIN COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export const VisualizationEngine: React.FC<
  VisualizationEngineProps
> = ({ data, queryTopic = 'Concept' }) => {
  const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
  const edges = Array.isArray(data?.edges) ? data.edges : [];
  const steps = Array.isArray(data?.steps) ? data.steps : [];

  const safeNodes = useMemo(() => {
    if (nodes.length > 0) return nodes;

    return [
      {
        id: 'input',
        label: 'Input',
        sublabel: 'Starting point',
        icon: 'Zap',
        color: '#6366f1',
      },
      {
        id: 'process',
        label: 'Process',
        sublabel: 'Core mechanism',
        icon: 'Cpu',
        color: '#22c55e',
      },
      {
        id: 'output',
        label: 'Output',
        sublabel: 'Final result',
        icon: 'Check',
        color: '#f59e0b',
      },
    ];
  }, [nodes]);

  const safeSteps = useMemo(() => {
    if (steps.length > 0) return steps;

    return safeNodes.map((node, index) => ({
      stepNumber: index + 1,
      title: node.label,
      description:
        node.sublabel ||
        `This is step ${index + 1} of the ${queryTopic} process.`,
    }));
  }, [steps, safeNodes, queryTopic]);

  const visualMode = useMemo(
    () => detectVisualMode(queryTopic, data),
    [queryTopic, data],
  );

  const visualStepCount =
    visualMode === 'generic' ? safeSteps.length : 4;

  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] =
    useState<VisualizationNode | null>(null);

  useEffect(() => {
    setActiveStep(0);
    setIsPlaying(false);
    setSelectedNode(null);
  }, [queryTopic, data.title]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= visualStepCount - 1) {
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 2200);

    return () => window.clearInterval(timer);
  }, [isPlaying, visualStepCount]);

  const currentStep =
    safeSteps[clamp(activeStep, 0, safeSteps.length - 1)] ||
    safeSteps[0];

  const resetVisualization = () => {
    setIsPlaying(false);
    setActiveStep(0);
    setSelectedNode(null);
  };

  const previousStep = () => {
    setIsPlaying(false);
    setActiveStep((current) => Math.max(0, current - 1));
  };

  const nextStep = () => {
    setIsPlaying(false);
    setActiveStep((current) =>
      Math.min(visualStepCount - 1, current + 1),
    );
  };

  const isNodeActive = (index: number) => {
    if (safeSteps.length === 0) return false;
    return index <= activeStep;
  };

  const visualTitle = useMemo(() => {
    switch (visualMode) {
      case 'photosynthesis':
        return 'Photosynthesis — Animated Biology';
      case 'binary-search':
        return 'Binary Search — Algorithm Animation';
      case 'tcp':
        return 'TCP Handshake — Network Animation';
      case 'dna':
        return 'DNA — Molecular Visualization';
      case 'heart':
        return 'Human Heart — Blood Flow';
      default:
        return data.title || `${queryTopic} — Interactive Visual`;
    }
  }, [visualMode, data.title, queryTopic]);

  const visualDescription = useMemo(() => {
    switch (visualMode) {
      case 'photosynthesis':
        return 'Watch sunlight, water and carbon dioxide transform into glucose and oxygen.';
      case 'binary-search':
        return 'See how binary search repeatedly cuts the search space in half.';
      case 'tcp':
        return 'Visualize the three messages used to establish a TCP connection.';
      case 'dna':
        return 'Explore the structure of DNA as two complementary strands.';
      case 'heart':
        return 'Follow the movement of blood through the heart.';
      default:
        return (
          data.description ||
          `Step-by-step interactive explanation of ${queryTopic}.`
        );
    }
  }, [visualMode, data.description, queryTopic]);

  const renderSpecialScene = () => {
    switch (visualMode) {
      case 'photosynthesis':
        return <PhotosynthesisScene step={activeStep} />;

      case 'binary-search':
        return <BinarySearchScene step={activeStep} />;

      case 'tcp':
        return <TcpScene step={activeStep} />;

      case 'dna':
        return <DnaScene step={activeStep} />;

      case 'heart':
        return <HeartScene step={activeStep} />;

      default:
        return (
          <GenericScene
            nodes={safeNodes}
            activeStep={activeStep}
            onSelect={setSelectedNode}
            selectedNode={selectedNode}
          />
        );
    }
  };

  return (
    <section className="w-full overflow-hidden rounded-[28px] border border-slate-800 bg-[#05091c] text-white shadow-2xl">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-b border-white/10 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-400/20">
                <Layers className="h-5 w-5" />
              </div>

              <h2 className="text-base font-extrabold sm:text-lg">
                {visualTitle}
              </h2>

              <span className="rounded-full bg-indigo-500/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-300 ring-1 ring-indigo-400/20">
                Interactive Visual
              </span>
            </div>

            <p className="ml-11 max-w-3xl text-xs leading-relaxed text-slate-400">
              {visualDescription}
            </p>
          </div>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={previousStep}
              disabled={activeStep === 0}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              title="Previous step"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((value) => !value)}
              className={`flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-bold transition ${
                isPlaying
                  ? 'bg-amber-500 text-black'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Play
                </>
              )}
            </button>

            <button
              type="button"
              onClick={nextStep}
              disabled={activeStep >= visualStepCount - 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
              title="Next step"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={resetVisualization}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* VISUALIZATION                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="px-4 py-6 sm:px-7 sm:py-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">
            {visualMode === 'generic'
              ? 'Interactive Architecture & Flow'
              : 'Interactive Concept Visualization'}
          </span>

          <span className="text-[10px] text-slate-500">
            {visualMode === 'generic'
              ? 'Click a node for details'
              : 'Use Play to animate'}
          </span>
        </div>

        {renderSpecialScene()}

        {/* ---------------------------------------------------------------- */}
        {/* CURRENT STEP                                                     */}
        {/* ---------------------------------------------------------------- */}

        {currentStep && (
          <div className="mt-7 rounded-2xl border border-white/10 bg-[#080f24] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <span className="text-sm font-extrabold">
                    {activeStep + 1}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400">
                    Step {activeStep + 1} of {visualStepCount}
                  </div>

                  <h3 className="mt-1 text-sm font-extrabold text-white sm:text-base">
                    {currentStep.title}
                  </h3>

                  <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-400 sm:text-sm">
                    {currentStep.description}
                  </p>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex shrink-0 items-center gap-1.5">
                {Array.from({ length: visualStepCount }).map(
                  (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        setActiveStep(index);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        index === activeStep
                          ? 'w-7 bg-indigo-500'
                          : index < activeStep
                          ? 'w-2 bg-cyan-400'
                          : 'w-2 bg-slate-700'
                      }`}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ),
                )}
              </div>
            </div>

            {currentStep.analogy && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />

                <p className="text-[11px] leading-5 text-amber-200">
                  <span className="font-bold text-amber-400">
                    Analogy:
                  </span>{' '}
                  {currentStep.analogy}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* SELECTED NODE                                                    */}
        {/* ---------------------------------------------------------------- */}

        {selectedNode && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-indigo-400/20 bg-indigo-500/5 p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />

            <div className="min-w-0">
              <div className="text-xs font-bold text-indigo-300">
                {selectedNode.label}
              </div>

              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                {selectedNode.sublabel ||
                  `This node represents an important stage in ${queryTopic}.`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="ml-auto text-xs text-slate-500 hover:text-white"
              aria-label="Close node details"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="border-t border-white/10 bg-black/10 px-5 py-3 sm:px-7">
        <div className="flex flex-col gap-2 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Visual learning mode •{' '}
            {visualMode === 'generic'
              ? `${safeNodes.length} nodes`
              : `${visualStepCount} animation stages`}
          </span>

          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            {visualMode === 'generic'
              ? 'Interactive concept flow'
              : 'Animated educational visualization'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default VisualizationEngine;