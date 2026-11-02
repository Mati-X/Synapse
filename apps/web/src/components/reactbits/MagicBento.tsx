import React, { useRef, useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  Activity,
  Database,
  Zap,
  GitFork,
  Terminal,
  Lock,
} from 'lucide-react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  cardIndex: number;
}

export interface MagicBentoProps {
  className?: string;
}

export const MagicBento: React.FC<MagicBentoProps> = ({ className = '' }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardCoords, setCardCoords] = useState<{ x: number; y: number }[]>(
    Array.from({ length: 5 }, () => ({ x: -1000, y: -1000 }))
  );
  const [isGridHovered, setIsGridHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const nextCoords = cardRefs.current.map((el) => {
      if (!el) return { x: -1000, y: -1000 };
      const rect = el.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    });
    setCardCoords(nextCoords);
  };

  const handleCardClick = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRefs.current[index];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      cardIndex: index,
    };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 750);
  };

  const renderHardwarePort = (
    side: 'left' | 'right',
    label: string,
    variant: 'sky' | 'emerald' | 'rose' | 'empty'
  ) => {
    const isRight = side === 'right';
    const plugColors = {
      sky: {
        plug: 'bg-gradient-to-r from-zinc-800 to-zinc-900 border-zinc-600/80 shadow-[0_0_8px_rgba(56,189,248,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]',
        pin: 'bg-sky-400 border-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.7)]',
        text: 'text-zinc-100',
      },
      emerald: {
        plug: 'bg-gradient-to-r from-emerald-900 to-emerald-950 border-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]',
        pin: 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.7)]',
        text: 'text-emerald-100',
      },
      rose: {
        plug: 'bg-gradient-to-r from-rose-900 to-rose-950 border-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]',
        pin: 'bg-rose-400 border-rose-300 shadow-[0_0_6px_rgba(244,63,94,0.7)]',
        text: 'text-rose-100',
      },
    };

    return (
      <div
        className={`relative flex items-center h-[26px] w-[62px] bg-zinc-950/95 border-y border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] shrink-0 ${
          isRight
            ? 'rounded-l-lg border-l border-r-0 justify-end pr-0.5'
            : 'rounded-r-lg border-r border-l-0 justify-start pl-0.5'
        }`}
      >
        {variant === 'empty' ? (
          <span className="text-[8px] font-mono font-bold tracking-wider uppercase text-zinc-600 px-2">
            {label}
          </span>
        ) : (
          <div
            className={`w-[54px] h-[20px] flex items-center justify-between px-2 rounded-[5px] border ${plugColors[variant].plug}`}
          >
            <span className={`text-[8px] font-mono font-bold tracking-wider uppercase ${plugColors[variant].text}`}>
              {label}
            </span>
            <div className={`w-1.5 h-3 rounded-xs border shrink-0 ${plugColors[variant].pin}`} />
          </div>
        )}
      </div>
    );
  };

  const renderBentoChassis = (
    index: number,
    spanClass: string,
    accentRgb: string,
    headerTitle: string,
    headerSubtitle: string,
    headerIcon: React.ReactNode,
    badgeText: string,
    badgeColor: 'sky' | 'emerald' | 'amber' | 'rose',
    children: React.ReactNode
  ) => {
    const pos = cardCoords[index] || { x: -1000, y: -1000 };
    const cardRipples = ripples.filter((r) => r.cardIndex === index);

    const badgeClasses = {
      sky: 'bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-[0_0_8px_rgba(56,189,248,0.2)]',
      emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
      amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
      rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]',
    };

    const dotClasses = {
      sky: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]',
      emerald: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]',
      amber: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
      rose: 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
    };

    return (
      <div
        key={index}
        ref={(el) => {
          cardRefs.current[index] = el;
        }}
        onClick={(e) => handleCardClick(index, e)}
        className={`group relative rounded-2xl p-[1px] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer select-none ${spanClass}`}
        style={{
          background: 'rgba(63, 63, 70, 0.8)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: isGridHovered ? 1 : 0,
            background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(${accentRgb}, 0.75), rgba(${accentRgb}, 0.15) 45%, transparent 75%)`,
          }}
        />

        <div
          className="relative z-10 h-full w-full rounded-[15px] bg-gradient-to-b from-zinc-900/85 via-zinc-900/90 to-zinc-950/95 backdrop-blur-2xl p-5 flex flex-col justify-between overflow-hidden"
          style={{
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: isGridHovered ? 1 : 0,
              background: `radial-gradient(480px circle at ${pos.x}px ${pos.y}px, rgba(${accentRgb}, 0.08), transparent 70%)`,
            }}
          />

          {cardRipples.map((r) => (
            <span
              key={r.id}
              className="pointer-events-none absolute rounded-full animate-ping"
              style={{
                left: r.x - 60,
                top: r.y - 60,
                width: 120,
                height: 120,
                background: `radial-gradient(circle, rgba(${accentRgb}, 0.35) 0%, transparent 70%)`,
                animationDuration: '700ms',
              }}
            />
          ))}

          <div className="relative z-10 flex items-center gap-3 pb-3 mb-3 border-b border-zinc-800/80">
            <div className="w-9 h-9 rounded-lg bg-zinc-950/90 border border-zinc-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 text-zinc-200 [&>svg]:size-4">
              {headerIcon}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-zinc-100 truncate tracking-tight">
                {headerTitle}
              </h3>
              <span className="text-[11px] font-mono text-zinc-400 truncate opacity-85">
                {headerSubtitle}
              </span>
            </div>
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-mono font-bold tracking-wider uppercase shrink-0 border ${badgeClasses[badgeColor]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses[badgeColor]}`} />
              <span>{badgeText}</span>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-between gap-4">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={gridRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsGridHovered(true)}
      onMouseLeave={() => setIsGridHovered(false)}
      className={`grid grid-cols-12 gap-5 ${className}`}
    >
      {renderBentoChassis(
        0,
        'col-span-12 lg:col-span-7',
        '56, 189, 248',
        'Kahn Topological Engine',
        'Parallel Layer Compiler • O(V + E)',
        <Cpu className="text-amber-400" />,
        'LAYERED DAG',
        'amber',
        <>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Resolves node dependencies in linear time, grouping independent zero-in-degree modules into concurrent execution waves.
          </p>

          <div className="space-y-2 -mx-5">
            <div className="flex items-center justify-between">
              {renderHardwarePort('left', 'IN A', 'sky')}
              <div className="flex-1 mx-2 bg-zinc-950/90 border border-zinc-800/90 rounded-lg px-3 py-1.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-0.5 text-[8px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    <Zap className="w-2.5 h-2.5" />
                    WAVE 0
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-zinc-100">
                    .webhook_ingress
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">in-deg: 0</span>
              </div>
              {renderHardwarePort('right', 'TRUE', 'emerald')}
            </div>

            <div className="relative flex items-center justify-center py-0.5 px-8">
              <div className="w-full h-px bg-zinc-800/80" />
              <div className="absolute bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-600/90 rounded-md px-2.5 py-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)] flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-amber-300">∥</span>
                <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-wider">
                  PROMISE.ALLSETTLED
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {renderHardwarePort('left', 'IN B', 'empty')}
              <div className="flex-1 mx-2 bg-zinc-950/90 border border-zinc-800/90 rounded-lg px-3 py-1.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-200">
                  &quot;layer_1: [fraud_check, kyc_guard]&quot;
                </span>
                <span className="text-[10px] font-mono text-emerald-400">2x Parallel</span>
              </div>
              {renderHardwarePort('right', 'OUT', 'sky')}
            </div>
          </div>
        </>
      )}

      {renderBentoChassis(
        1,
        'col-span-12 lg:col-span-5',
        '16, 185, 129',
        'In-Flight Cycle Guard',
        'Recursive DFS Edge Validator',
        <GitFork className="text-emerald-400" />,
        '0 CYCLES',
        'emerald',
        <>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every cable connection is validated in-flight via Depth-First Search before React Flow commits the edge to state.
          </p>

          <div className="space-y-2 -mx-5">
            <div className="flex items-center justify-between">
              {renderHardwarePort('left', 'SRC', 'sky')}
              <div className="flex-1 mx-2 bg-zinc-950/90 border border-emerald-500/30 rounded-lg px-3 py-1.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-300">
                  trigger → condition
                </span>
                <span className="text-[9px] font-mono uppercase text-emerald-400">VALID</span>
              </div>
              {renderHardwarePort('right', 'TRUE', 'emerald')}
            </div>

            <div className="flex items-center justify-between">
              {renderHardwarePort('left', 'LOOP', 'empty')}
              <div className="flex-1 mx-2 bg-zinc-950/90 border border-rose-500/35 rounded-lg px-3 py-1.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] flex items-center justify-between">
                <span className="text-[11px] font-mono text-rose-300">
                  http_out → trigger
                </span>
                <span className="text-[9px] font-mono uppercase text-rose-400">BLOCKED</span>
              </div>
              {renderHardwarePort('right', 'FALSE', 'rose')}
            </div>
          </div>
        </>
      )}

      {renderBentoChassis(
        2,
        'col-span-12 md:col-span-6 lg:col-span-4',
        '244, 63, 94',
        'Live SSE Telemetry',
        'Real-Time Patch Signal Broker',
        <Activity className="text-rose-400" />,
        'STREAMING',
        'rose',
        <>
          <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-lg p-2.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.8)] font-mono text-[10px] space-y-1.5">
            <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-800/80 pb-1">
              <span className="flex items-center gap-1">
                <Terminal className="size-3 text-amber-400" />
                <span>SSE Event Bus</span>
              </span>
              <span className="text-emerald-400">24ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sky-400">NODE_RUNNING</span>
              <span className="text-zinc-400">cond_comparator</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-400">NODE_COMPLETED</span>
              <span className="text-zinc-300">branch: TRUE</span>
            </div>
          </div>

          <div className="flex items-center justify-between -mx-5 pt-1">
            {renderHardwarePort('left', 'SSE', 'sky')}
            <span className="text-[10px] font-mono text-zinc-400">Zero Polling</span>
            {renderHardwarePort('right', 'OUT', 'emerald')}
          </div>
        </>
      )}

      {renderBentoChassis(
        3,
        'col-span-12 md:col-span-6 lg:col-span-4',
        '245, 158, 11',
        'PostgreSQL Persistence',
        'UUIDv4 & Versioned Snapshots',
        <Database className="text-sky-400" />,
        'ACID DB',
        'sky',
        <>
          <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-lg p-2.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.8)] font-mono text-[10px] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded text-[9px] font-bold">
                PK: UUIDv4
              </span>
              <span className="text-zinc-300">workflows</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>workflow_versions</span>
              <span className="text-sky-400">v1..vN</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>execution_runs</span>
              <span className="text-emerald-400">COMMITTED</span>
            </div>
          </div>

          <div className="flex items-center justify-between -mx-5 pt-1">
            {renderHardwarePort('left', 'SQL', 'sky')}
            <span className="text-[10px] font-mono text-zinc-400">Drizzle ORM</span>
            {renderHardwarePort('right', 'SYNC', 'emerald')}
          </div>
        </>
      )}

      {renderBentoChassis(
        4,
        'col-span-12 lg:col-span-4',
        '168, 85, 247',
        'Isolated Path Resolver',
        'Safe Variable Interpolation',
        <ShieldCheck className="text-amber-400" />,
        'SANDBOXED',
        'amber',
        <>
          <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-lg p-2.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.8)] font-mono text-[10px] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-0.5 text-[8px] font-mono font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded">
                  <Zap className="w-2 h-2" />
                  TRIGGER
                </span>
                <span className="text-zinc-100 font-semibold">.payload.status</span>
              </div>
              <Lock className="size-3 text-zinc-500" />
            </div>
            <div className="text-zinc-400 bg-zinc-900/90 px-2 py-1 rounded border border-zinc-800 truncate">
              === &quot;success&quot; → Route TRUE
            </div>
          </div>

          <div className="flex items-center justify-between -mx-5 pt-1">
            {renderHardwarePort('left', 'CTX', 'sky')}
            <span className="text-[10px] font-mono text-zinc-400">Stateless Engine</span>
            {renderHardwarePort('right', 'TRUE', 'emerald')}
          </div>
        </>
      )}
    </div>
  );
};
