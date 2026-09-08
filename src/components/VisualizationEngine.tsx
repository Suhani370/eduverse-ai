import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  Box,
  Globe,
  Network,
  Activity,
  Gauge
} from 'lucide-react';
import { VisualizationData, VisualNode, VisualizationStep, ThreeDSceneData } from '../types';

interface VisualizationEngineProps {
  data: VisualizationData;
  queryTopic?: string;
  threeDData?: ThreeDSceneData;
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
  Box,
  Globe,
  Network,
  Activity,
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

const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

/* -------------------------------------------------------------------------- */
/*                         DOMAIN-SPECIFIC 2D SCENES                          */
/* -------------------------------------------------------------------------- */

/** 1. Photosynthesis Scene */
const PhotosynthesisScene: React.FC<{ step: number }> = ({ step }) => {
  const stage = clamp(step, 0, 3);
  return (
    <div className="relative min-h-[300px] rounded-2xl bg-gradient-to-br from-[#06191c] via-[#081729] to-[#0f142b] p-5 border border-emerald-500/20 overflow-hidden select-none">
      <div className="absolute right-6 top-6 transition-all duration-700">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.6)]">
          <Sun className="h-8 w-8 text-amber-950 animate-spin" style={{ animationDuration: '20s' }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <div className={`p-3 rounded-xl border transition-all duration-500 ${stage >= 1 ? 'bg-cyan-950/60 border-cyan-400/40 text-cyan-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider">Atmosphere</div>
          <div className="text-sm font-black mt-0.5">CO₂ (Carbon Dioxide)</div>
        </div>

        <div className={`p-3 rounded-xl border transition-all duration-500 ${stage >= 1 ? 'bg-blue-950/60 border-blue-400/40 text-blue-200' : 'bg-slate-900/40 border-slate-800 text-slate-500'}`}>
          <div className="text-[10px] font-bold uppercase tracking-wider">Roots / Soil</div>
          <div className="text-sm font-black mt-0.5">H₂O (Water)</div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center">
        <div className={`p-5 rounded-2xl border transition-all duration-700 max-w-md w-full text-center ${stage >= 2 ? 'bg-emerald-950/70 border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.25)]' : 'bg-slate-900/40 border-slate-800'}`}>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            {stage < 2 ? 'Thylakoid Membrane Awaiting Energy' : 'Chloroplast Stroma (Light & Calvin Cycle)'}
          </div>
          <div className="text-sm sm:text-base font-extrabold text-white mt-2 font-mono">
            6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂
          </div>
          {stage >= 3 && (
            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                ✓ Glucose (Energy)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40">
                ✓ O₂ Released
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** 2. TCP 3-Way Handshake Scene */
const TcpScene: React.FC<{ step: number }> = ({ step }) => {
  const stage = clamp(step, 0, 3);
  return (
    <div className="relative min-h-[300px] rounded-2xl bg-gradient-to-br from-[#080d24] via-[#09122c] to-[#0c1938] p-5 border border-indigo-500/20 overflow-hidden select-none flex flex-col justify-between">
      <div className="flex items-center justify-between px-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-white mt-1.5">Client (Initiator)</span>
          <span className="text-[10px] text-indigo-300 font-mono">Port: 54321</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-lg">
            <Server className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-white mt-1.5">Server (Receiver)</span>
          <span className="text-[10px] text-cyan-300 font-mono">Port: 80 / 443</span>
        </div>
      </div>

      <div className="my-4 space-y-2.5 max-w-lg mx-auto w-full">
        <div className={`p-2.5 rounded-xl border text-xs font-mono transition-all duration-500 flex items-center justify-between ${stage >= 1 ? 'bg-amber-500/20 border-amber-400/50 text-amber-200' : 'opacity-20 border-slate-800'}`}>
          <span className="font-bold">1. SYN (Seq=100)</span>
          <span className="text-[11px] text-amber-300">Client → Server</span>
        </div>

        <div className={`p-2.5 rounded-xl border text-xs font-mono transition-all duration-500 flex items-center justify-between ${stage >= 2 ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200' : 'opacity-20 border-slate-800'}`}>
          <span className="font-bold">2. SYN-ACK (Seq=300, Ack=101)</span>
          <span className="text-[11px] text-cyan-300">Server → Client</span>
        </div>

        <div className={`p-2.5 rounded-xl border text-xs font-mono transition-all duration-500 flex items-center justify-between ${stage >= 3 ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200' : 'opacity-20 border-slate-800'}`}>
          <span className="font-bold">3. ACK (Ack=301)</span>
          <span className="text-[11px] text-emerald-300">Client → Server</span>
        </div>
      </div>

      <div className="text-center">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${stage >= 3 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' : 'bg-slate-800 text-slate-400'}`}>
          {stage >= 3 ? '✓ Socket Connection ESTABLISHED' : 'Handshake in Progress...'}
        </span>
      </div>
    </div>
  );
};

/** 3. Binary Search Scene */
const BinarySearchScene: React.FC<{ step: number }> = ({ step }) => {
  const stage = clamp(step, 0, 3);
  const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const target = 23;

  let low = 0;
  let high = arr.length - 1;
  let mid = 4;

  if (stage === 1) {
    low = 0; high = 9; mid = 4; // arr[4] = 16 < 23
  } else if (stage === 2) {
    low = 5; high = 9; mid = 7; // arr[7] = 56 > 23
  } else if (stage >= 3) {
    low = 5; high = 6; mid = 5; // arr[5] = 23 MATCH
  }

  return (
    <div className="relative min-h-[300px] rounded-2xl bg-gradient-to-br from-[#081024] via-[#0a1836] to-[#0c1e40] p-5 border border-cyan-500/20 select-none flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-cyan-300">Searching for Target: <strong className="text-white text-sm font-mono">{target}</strong></span>
        <span className="text-slate-400 text-[11px] font-mono">Time: O(log N)</span>
      </div>

      <div className="my-6 overflow-x-auto pb-2">
        <div className="flex items-center justify-center gap-2 min-w-max">
          {arr.map((val, idx) => {
            const isMid = idx === mid;
            const isLow = idx === low;
            const isHigh = idx === high;
            const isInRange = idx >= low && idx <= high;
            const isFound = stage >= 3 && idx === 5;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div className="h-5 text-[10px] font-bold text-cyan-400 font-mono">
                  {isLow && 'L'} {isMid && 'M'} {isHigh && 'H'}
                </div>
                <div className={`w-10 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-sm transition-all duration-500 ${
                  isFound
                    ? 'bg-emerald-600 text-white border-emerald-400 scale-110 shadow-lg shadow-emerald-500/30'
                    : isMid
                    ? 'bg-amber-500 text-black border-amber-300 scale-105'
                    : isInRange
                    ? 'bg-slate-800 text-white border-slate-600'
                    : 'bg-slate-900/40 text-slate-600 border-slate-800/60'
                }`}>
                  {val}
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono">{idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-center font-mono text-cyan-200">
        {stage === 0 && 'Initial sorted array with bounds [low = 0, high = 9]'}
        {stage === 1 && 'Iteration 1: mid = 4 (value: 16). 16 < 23 → Discard left half, set low = 5.'}
        {stage === 2 && 'Iteration 2: mid = 7 (value: 56). 56 > 23 → Discard right half, set high = 6.'}
        {stage >= 3 && 'Iteration 3: mid = 5 (value: 23). Match found! Returned index 5.'}
      </div>
    </div>
  );
};

/** 4. Linked List Scene */
const LinkedListScene: React.FC<{ step: number }> = ({ step }) => {
  const stage = clamp(step, 0, 3);
  const nodes = [
    { id: 1, val: 'Head: 10' },
    { id: 2, val: 'Node: 20' },
    { id: 3, val: 'Node: 30' },
    { id: 4, val: 'Tail: 40' },
  ];

  return (
    <div className="relative min-h-[300px] rounded-2xl bg-gradient-to-br from-[#0b0f2a] via-[#10173b] to-[#121c47] p-5 border border-indigo-500/20 select-none flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-indigo-300">Singly Linked List Traversal & Pointer Update</span>
        <span className="text-slate-400 text-[11px] font-mono">Access: O(N) • Insert: O(1)</span>
      </div>

      <div className="my-6 flex items-center justify-center gap-2 overflow-x-auto pb-2 min-w-max">
        {nodes.map((n, idx) => {
          const isActive = idx === stage;
          return (
            <React.Fragment key={n.id}>
              <div className={`p-3.5 rounded-2xl border font-mono transition-all duration-500 flex flex-col items-center ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-400 scale-105 shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800'
              }`}>
                <span className="text-xs font-extrabold">{n.val}</span>
                <span className="text-[9px] text-indigo-200 mt-1">next → {idx < nodes.length - 1 ? '0x' + (idx + 2) : 'NULL'}</span>
              </div>
              {idx < nodes.length - 1 && (
                <ArrowRight className={`w-5 h-5 shrink-0 ${idx < stage ? 'text-cyan-400' : 'text-slate-600'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-center font-mono text-indigo-200">
        Current Pointer: <strong className="text-white">Node {stage + 1}</strong> (Memory Address: 0x{stage + 1}A4F)
      </div>
    </div>
  );
};

/** 5. Generic Dynamic Multi-Node Graph Scene */
const GenericScene: React.FC<{
  nodes: VisualNode[];
  activeStep: number;
  onSelect: (node: VisualNode) => void;
  selectedNode: VisualNode | null;
}> = ({ nodes, activeStep, onSelect, selectedNode }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-[#070b22] to-[#10152e] p-5">
      <div className="flex min-w-max items-center justify-center gap-3">
        {nodes.map((node, index) => {
          const Icon = getIcon(node.icon);
          const color = node.color || fallbackColors[index % fallbackColors.length];
          const active = index <= activeStep;
          const selected = selectedNode?.id === node.id;

          return (
            <React.Fragment key={node.id}>
              <button
                type="button"
                onClick={() => onSelect(node)}
                className={`group relative w-[190px] rounded-2xl border p-4 text-left transition-all duration-500 cursor-pointer ${
                  selected
                    ? 'scale-105 border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-950/50'
                    : active
                    ? 'border-white/20 bg-white/[0.08]'
                    : 'border-white/10 bg-white/[0.03] opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${color}22`, color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Step {index + 1}
                  </span>
                </div>

                <div className="text-sm font-bold text-white truncate">{node.label}</div>
                {node.sublabel && (
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{node.sublabel}</div>
                )}

                <div
                  className="mt-3.5 h-1 rounded-full transition-all duration-500"
                  style={{ backgroundColor: active ? color : '#1e293b', width: active ? '100%' : '30%' }}
                />
              </button>

              {index < nodes.length - 1 && (
                <ArrowRight
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    activeStep > index ? 'text-cyan-400' : 'text-slate-700'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                     INTERACTIVE 3D SPATIAL VIEWER                          */
/* -------------------------------------------------------------------------- */

const Interactive3DViewer: React.FC<{
  sceneData?: ThreeDSceneData;
  topic?: string;
}> = ({ sceneData, topic = 'Concept' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotationX, setRotationX] = useState(0.3);
  const [rotationY, setRotationY] = useState(0.5);
  const [zoom, setZoom] = useState(1);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  // 3D Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background Grid Effect
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      const cx = width / 2;
      const cy = height / 2;
      const baseScale = 70 * zoom;

      // Draw Orbiting 3D Nodes / Molecule Atoms
      const objects = sceneData?.objects && sceneData.objects.length > 0
        ? sceneData.objects
        : [
            { name: 'Core Nucleus', type: 'sphere', color: '#6366f1', position: [0, 0, 0], label: topic },
            { name: 'Orbital A', type: 'sphere', color: '#06b6d4', position: [1.5, 0.8, 0.5], label: 'State A' },
            { name: 'Orbital B', type: 'sphere', color: '#22c55e', position: [-1.4, -0.6, 0.8], label: 'State B' },
            { name: 'Orbital C', type: 'sphere', color: '#f59e0b', position: [0.3, 1.6, -1.2], label: 'State C' },
          ];

      // Sort objects by depth after 3D rotation
      const projected = objects.map(obj => {
        const [x, y, z] = obj.position;
        // Apply 3D Rotation Matrix
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);

        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const screenX = cx + x1 * baseScale;
        const screenY = cy + y1 * baseScale;
        const depth = z2;

        return { ...obj, screenX, screenY, depth };
      }).sort((a, b) => a.depth - b.depth);

      // Draw Connection Struts / Bonds
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 2;
      const center = projected.find(p => p.position[0] === 0 && p.position[1] === 0) || projected[0];

      projected.forEach(p => {
        if (p !== center) {
          ctx.beginPath();
          ctx.moveTo(center.screenX, center.screenY);
          ctx.lineTo(p.screenX, p.screenY);
          ctx.stroke();
        }
      });

      // Draw 3D Spheres & Labels
      projected.forEach(p => {
        const radius = Math.max(12, (20 + p.depth * 4) * zoom);
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        if (p.label) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(p.label, p.screenX, p.screenY + radius + 14);
        }
      });

      if (isAutoRotate) {
        setRotationY(prev => prev + 0.008);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [rotationX, rotationY, zoom, isAutoRotate, sceneData, topic]);

  // Mouse drag listeners for 3D rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMouseRef.current.x;
    const dy = e.clientY - lastMouseRef.current.y;
    setRotationY(prev => prev + dx * 0.01);
    setRotationX(prev => clamp(prev + dy * 0.01, -1.2, 1.2));
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-[#060a1c] via-[#091129] to-[#0d1633] p-4 border border-indigo-500/20 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {sceneData?.title || `${topic} 3D Model Explorer`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAutoRotate(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
              isAutoRotate ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {isAutoRotate ? 'Auto-Rotate: ON' : 'Auto-Rotate: OFF'}
          </button>
          <button
            type="button"
            onClick={() => { setRotationX(0.3); setRotationY(0.5); setZoom(1); }}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
            title="Reset 3D View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        className="relative w-full h-[320px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing border border-slate-800/80 bg-black/40 flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas ref={canvasRef} width={640} height={320} className="w-full h-full" />
        <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 pointer-events-none select-none">
          Click & drag to rotate in 3D space
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                           MAIN VISUALIZATION ENGINE                        */
/* -------------------------------------------------------------------------- */

export const VisualizationEngine: React.FC<VisualizationEngineProps> = ({
  data,
  queryTopic = 'Concept',
  threeDData,
}) => {
  const [activeTab, setActiveTab] = useState<'2d' | '3d'>('2d');
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<VisualNode | null>(null);

  const nodes = Array.isArray(data?.nodes) && data.nodes.length > 0 ? data.nodes : [
    { id: '1', label: 'Initial State', sublabel: 'Starting configuration', icon: 'Zap', color: '#6366f1' },
    { id: '2', label: 'Mechanism', sublabel: 'Transformation process', icon: 'Cpu', color: '#06b6d4' },
    { id: '3', label: 'Target State', sublabel: 'Resolved outcome', icon: 'Check', color: '#22c55e' }
  ];

  const steps: VisualizationStep[] = Array.isArray(data?.steps) && data.steps.length > 0
    ? data.steps
    : nodes.map((n, i) => ({
        stepNumber: i + 1,
        title: n.label,
        description: n.sublabel || `Execution phase ${i + 1}`,
      }));

  // Detect visual domain
  const topicText = `${queryTopic} ${data?.title || ''}`.toLowerCase();
  const isTcp = topicText.includes('tcp') || topicText.includes('handshake');
  const isBinarySearch = topicText.includes('binary search');
  const isLinkedList = topicText.includes('linked list');
  const isPhotosynthesis = topicText.includes('photosynthesis');

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = Math.max(1000, 2500 / playbackSpeed);

    const timer = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length, playbackSpeed]);

  const currentStep = steps[activeStep] || steps[0];

  return (
    <section className="w-full rounded-3xl border border-slate-800 bg-[#05091c] text-white shadow-2xl overflow-hidden my-4" id="visual-learning-engine">
      {/* Header & Mode Switcher */}
      <div className="border-b border-white/10 px-5 py-4 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-400/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">
              {data.title || `${queryTopic} — Visual Flow`}
            </h3>
            <p className="text-[11px] text-slate-400">{data.description || 'Interactive animation and architectural diagrams'}</p>
          </div>
        </div>

        {/* 2D / 3D Mode Tabs & Play Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('2d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === '2d' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              2D Stepper
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('3d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === '3d' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Spatial
            </button>
          </div>

          {activeTab === '2d' && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                disabled={activeStep === 0}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 cursor-pointer"
                title="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isPlaying ? 'bg-amber-500 text-black shadow-md' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                disabled={activeStep >= steps.length - 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 cursor-pointer"
                title="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => { setActiveStep(0); setIsPlaying(false); }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                title="Reset animation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="p-5">
        {activeTab === '3d' ? (
          <Interactive3DViewer sceneData={threeDData} topic={queryTopic} />
        ) : (
          <div className="space-y-4">
            {/* Domain-Specific Visual Scene */}
            {isPhotosynthesis ? (
              <PhotosynthesisScene step={activeStep} />
            ) : isTcp ? (
              <TcpScene step={activeStep} />
            ) : isBinarySearch ? (
              <BinarySearchScene step={activeStep} />
            ) : isLinkedList ? (
              <LinkedListScene step={activeStep} />
            ) : (
              <GenericScene
                nodes={nodes}
                activeStep={activeStep}
                onSelect={setSelectedNode}
                selectedNode={selectedNode}
              />
            )}

            {/* Current Step Description Card */}
            {currentStep && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                    Step {currentStep.stepNumber} of {steps.length}: {currentStep.title}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { setIsPlaying(false); setActiveStep(i); }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        i === activeStep ? 'w-6 bg-indigo-500' : i < activeStep ? 'w-2 bg-cyan-400' : 'w-2 bg-slate-700'
                      }`}
                      aria-label={`Go to step ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default VisualizationEngine;