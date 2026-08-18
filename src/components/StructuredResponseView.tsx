import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Lightbulb,
  Play,
  RotateCcw,
  Server,
  Sparkles,
  Square,
  Target,
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

  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] =
    useState<VisualizationNode | null>(null);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => {
        if (current >= safeSteps.length - 1) {
          setIsPlaying(false);
          return current;
        }

        return current + 1;
      });
    }, 2600);

    return () => window.clearInterval(timer);
  }, [isPlaying, safeSteps.length]);

  const currentStep = safeSteps[activeStep] || safeSteps[0];

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
      Math.min(safeSteps.length - 1, current + 1)
    );
  };

  const isNodeActive = (index: number) => {
    if (safeSteps.length === 0) return false;
    return index <= activeStep;
  };

  const getNodeColor = (node: VisualizationNode, index: number) => {
    return node.color || fallbackColors[index % fallbackColors.length];
  };

  return (
    <section className="w-full overflow-hidden rounded-[28px] border border-slate-800 bg-[#05091c] text-white shadow-2xl">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="border-b border-white/10 px-5 py-5 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-400/20">
                <Layers className="h-5 w-5" />
              </div>

              <h2 className="truncate text-base font-extrabold sm:text-lg">
                {data.title || `${queryTopic} — Visual Flow`}
              </h2>

              <span className="hidden rounded-full bg-indigo-500/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-300 ring-1 ring-indigo-400/20 sm:inline-flex">
                Interactive Visual
              </span>
            </div>

            <p className="ml-11 max-w-3xl text-xs leading-relaxed text-slate-400">
              {data.description ||
                `Step-by-step visual explanation of ${queryTopic}.`}
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
                  Auto Play
                </>
              )}
            </button>

            <button
              type="button"
              onClick={nextStep}
              disabled={activeStep >= safeSteps.length - 1}
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

      {/* =========================================================
          FLOW AREA
      ========================================================= */}
      <div className="px-4 py-6 sm:px-7 sm:py-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">
            Interactive Architecture &amp; Flow
          </span>

          <span className="text-[10px] text-slate-500">
            Click any node for details
          </span>
        </div>

        {/* Desktop flow */}
        <div className="hidden overflow-x-auto pb-3 md:block">
          <div className="flex min-w-max items-center justify-center gap-3">
            {safeNodes.map((node, index) => {
              const Icon = getIcon(node.icon);
              const color = getNodeColor(node, index);
              const active = isNodeActive(index);
              const selected = selectedNode?.id === node.id;

              return (
                <React.Fragment key={node.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    className={`group relative w-[205px] rounded-2xl border p-4 text-left transition-all duration-500 ${
                      selected
                        ? 'scale-[1.03] border-indigo-400 bg-indigo-500/15 shadow-lg shadow-indigo-950/50'
                        : active
                        ? 'border-white/20 bg-[#101a32] shadow-lg'
                        : 'border-white/10 bg-[#0c1428] opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Active glow */}
                    {active && (
                      <span
                        className="absolute inset-0 -z-0 rounded-2xl opacity-20 blur-xl"
                        style={{ backgroundColor: color }}
                      />
                    )}

                    <div className="relative z-10">
                      <div className="mb-3 flex items-center justify-between">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: `${color}22`,
                            color,
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                          Step {index + 1}
                        </span>
                      </div>

                      <div className="text-sm font-bold text-white">
                        {node.label}
                      </div>

                      {node.sublabel && (
                        <div className="mt-1 text-[11px] leading-relaxed text-slate-400">
                          {node.sublabel}
                        </div>
                      )}

                      <div
                        className="mt-4 h-1 rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: active ? color : '#1e293b',
                          width: active ? '100%' : '35%',
                        }}
                      />
                    </div>
                  </button>

                  {index < safeNodes.length - 1 && (
                    <div className="flex w-16 shrink-0 flex-col items-center gap-1">
                      <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                          style={{
                            width: activeStep > index ? '100%' : '0%',
                            background:
                              'linear-gradient(90deg,#6366f1,#22d3ee)',
                          }}
                        />
                      </div>

                      <ArrowRight
                        className={`h-4 w-4 transition-colors ${
                          activeStep > index
                            ? 'text-cyan-400'
                            : 'text-slate-700'
                        }`}
                      />

                      {edges[index]?.label && (
                        <span className="max-w-16 truncate text-[8px] font-semibold uppercase tracking-wider text-slate-500">
                          {edges[index].label}
                        </span>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Mobile flow */}
        <div className="space-y-3 md:hidden">
          {safeNodes.map((node, index) => {
            const Icon = getIcon(node.icon);
            const color = getNodeColor(node, index);
            const active = isNodeActive(index);

            return (
              <React.Fragment key={node.id}>
                <button
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? 'border-indigo-400/40 bg-[#101a32]'
                      : 'border-white/10 bg-[#0c1428]'
                  }`}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: `${color}22`,
                      color,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white">
                      {node.label}
                    </div>

                    <div className="mt-0.5 text-[11px] text-slate-400">
                      {node.sublabel || `Step ${index + 1}`}
                    </div>
                  </div>

                  <span className="text-[9px] font-bold uppercase text-slate-500">
                    {index + 1}/{safeNodes.length}
                  </span>
                </button>

                {index < safeNodes.length - 1 && (
                  <div className="ml-9 flex h-6 items-center">
                    <div
                      className={`h-full w-[2px] ${
                        activeStep > index
                          ? 'bg-cyan-400'
                          : 'bg-slate-800'
                      }`}
                    />
                    <ChevronRight className="-ml-1 h-4 w-4 rotate-90 text-slate-600" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* =========================================================
            CURRENT STEP
        ========================================================= */}
        {currentStep && (
          <div className="mt-7 rounded-2xl border border-white/10 bg-[#080f24] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                  <span className="text-sm font-extrabold">
                    {currentStep.stepNumber}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400">
                    Step {currentStep.stepNumber} of {safeSteps.length}
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
                {safeSteps.map((_, index) => (
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
                ))}
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

        {/* =========================================================
            SELECTED NODE DETAILS
        ========================================================= */}
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

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <div className="border-t border-white/10 bg-black/10 px-5 py-3 sm:px-7">
        <div className="flex flex-col gap-2 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Visual learning mode • {safeNodes.length} nodes •{' '}
            {safeSteps.length} steps
          </span>

          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            Click nodes or use Auto Play
          </span>
        </div>
      </div>
    </section>
  );
};

export default VisualizationEngine;