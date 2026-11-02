import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  GitFork,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Database,
  Globe,
  Play,
  Terminal,
  Layers,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import ambientMeshUrl from '../assets/ambient-mesh.png';
import { ShinyText } from '../components/reactbits/ShinyText';
import { DecryptedText } from '../components/reactbits/DecryptedText';
import { Particles } from '../components/reactbits/Particles';
import { SpecularButton } from '../components/reactbits/SpecularButton';
import { BorderGlow } from '../components/reactbits/BorderGlow';
import { LineSidebar, LineSidebarItem } from '../components/reactbits/LineSidebar';
import { MagicBento } from '../components/reactbits/MagicBento';

const SIDEBAR_SECTIONS: LineSidebarItem[] = [
  { id: 'overview', code: 'MOD 01', label: 'Patchbay Hero', variant: 'amber' },
  { id: 'architecture', code: 'MOD 02', label: 'Live Node Canvas', variant: 'sky' },
  { id: 'benchmarks', code: 'MOD 03', label: 'Chassis Specs', variant: 'emerald' },
  { id: 'features', code: 'MOD 04', label: 'Magic Bento', variant: 'sky' },
  { id: 'engine', code: 'MOD 05', label: 'Kahn Compiler', variant: 'amber' },
  { id: 'cta', code: 'MOD 06', label: 'Mount Studio', variant: 'emerald' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [operator, setOperator] = useState<'equals' | 'not_equals'>('equals');
  const [targetVal, setTargetVal] = useState<'"success"' | '"failed"'>('"success"');
  const [runPhase, setRunPhase] = useState<'IDLE' | 'TRIGGER' | 'CONDITION' | 'EGRESS' | 'COMPLETED'>('COMPLETED');
  const [isRunning, setIsRunning] = useState(false);

  const isTrueBranch =
    (operator === 'equals' && targetVal === '"success"') ||
    (operator === 'not_equals' && targetVal === '"failed"');

  const triggerSignalRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunPhase('TRIGGER');
    setTimeout(() => setRunPhase('CONDITION'), 500);
    setTimeout(() => setRunPhase('EGRESS'), 1050);
    setTimeout(() => {
      setRunPhase('COMPLETED');
      setIsRunning(false);
    }, 1650);
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0 bg-[#070709]">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-45 transform-gpu blur-[24px] scale-105"
          style={{
            backgroundImage: `url(${ambientMeshUrl})`,
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(circle, #52525b 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <Particles
        particleCount={42}
        speed={0.28}
        particleBaseSize={1.4}
        particleColors={['#38bdf8', '#10b981', '#f59e0b', '#f43f5e']}
        className="opacity-45"
      />

      <LineSidebar items={SIDEBAR_SECTIONS} />

      <header className="fixed top-0 inset-x-0 h-14 bg-zinc-900/95 border-b border-zinc-800/90 text-zinc-200 select-none backdrop-blur-md z-40 px-5 lg:px-10 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.65)]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 font-mono font-bold text-base rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-[0_0_14px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-300/40 shrink-0">
              S
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-sans font-semibold text-sm text-zinc-100 tracking-tight">
                  Synapse Engine
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.2 rounded">
                  v0.1.0
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 pl-2.5 border-l border-zinc-800">
                  <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
                  <span>CLUSTER ONLINE</span>
                </span>
              </div>
              <span className="text-[9px] font-mono text-zinc-400 tracking-wider uppercase">
                Tactile DAG Orchestrator
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <SpecularButton
              variant="secondary"
              ledColor="sky"
              onClick={() => navigate('/login')}
            >
              <span>Sign In</span>
            </SpecularButton>

            <SpecularButton
              variant="primary"
              ledColor="amber"
              shortcut="⌘K"
              onClick={() => navigate('/register')}
            >
              <span>Mount Studio</span>
              <ArrowRight className="size-3.5" />
            </SpecularButton>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section
          id="overview"
          className="pt-28 pb-10 px-6 lg:px-12 max-w-6xl mx-auto flex flex-col items-center text-center scroll-mt-24"
        >
          <div className="inline-flex items-center h-[28px] bg-zinc-950/95 border border-zinc-800 rounded-lg p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] mb-7">
            <div className="h-full flex items-center gap-2 px-2.5 rounded-[5px] bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-600/80 shadow-[0_0_8px_rgba(56,189,248,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]">
              <Zap className="size-3 text-amber-400" />
              <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-zinc-100">
                PATCHBAY ENGINE
              </span>
              <div className="w-1.5 h-3 rounded-xs bg-sky-400 border border-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
            </div>
            <ShinyText
              text="KAHN TOPOLOGICAL DAG • IN-FLIGHT DFS GUARD • POSTGRESQL UUIDv4"
              speed={4.5}
              className="px-3 text-[10px] font-mono font-semibold tracking-wider"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100 max-w-4xl leading-[1.08]">
            <DecryptedText
              text="Tactile Modular DAG"
              animateOn="view"
              speed={32}
              className="text-white"
            />
            <span className="block mt-1.5 text-zinc-300">
              Workflow Patchbay &amp; Execution Engine
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed font-mono">
            Wire webhook triggers, logic comparators, and HTTP egress modules with live Bezier patch cables. Validated in-flight by recursive DFS and executed in parallel Kahn layers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <SpecularButton
              variant="emerald"
              ledColor="emerald"
              shortcut="ENTER"
              onClick={() => navigate('/register')}
            >
              <Play className="size-3.5 fill-emerald-300 text-emerald-300" />
              <span>Create Developer Account</span>
            </SpecularButton>

            <SpecularButton
              variant="secondary"
              ledColor="sky"
              shortcut="DEMO"
              onClick={() => navigate('/dashboard')}
            >
              <Layers className="size-3.5 text-amber-400" />
              <span>Open Live Patchbay</span>
            </SpecularButton>
          </div>
        </section>

        <section
          id="architecture"
          className="py-10 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto scroll-mt-20"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-2">
            <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-400">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
              <span className="text-zinc-200 font-semibold">INTERACTIVE PATCHBAY PREVIEW</span>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="hidden sm:inline text-[11px] text-zinc-500">
                Click (===) or (&quot;success&quot;) on Condition module to switch active branch
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setOperator('equals');
                  setTargetVal('"success"');
                  setRunPhase('COMPLETED');
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors"
              >
                <RotateCcw className="size-3" />
                <span>Reset</span>
              </button>

              <SpecularButton
                variant="secondary"
                ledColor="sky"
                shortcut="⌘↵"
                onClick={triggerSignalRun}
                disabled={isRunning}
              >
                <Play className="size-3 fill-sky-400 text-sky-400" />
                <span>{isRunning ? 'Executing Patch...' : 'Simulate Signal'}</span>
              </SpecularButton>
            </div>
          </div>

          <div className="relative py-8 min-h-[390px] flex items-center justify-center overflow-x-auto">
            <svg
              className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 1050 390"
              preserveAspectRatio="none"
            >
              <path
                d="M 248 242 C 315 242, 315 168, 382 168"
                fill="none"
                stroke="#38bdf8"
                strokeWidth={7}
                strokeOpacity={runPhase === 'TRIGGER' || runPhase === 'CONDITION' ? 0.45 : 0.25}
              />
              <path
                d="M 248 242 C 315 242, 315 168, 382 168"
                fill="none"
                stroke="#38bdf8"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <path
                d="M 248 242 C 315 242, 315 168, 382 168"
                fill="none"
                stroke="#ffffff"
                strokeWidth={1.5}
                strokeDasharray="4 16"
                strokeOpacity={0.75}
              />

              <path
                d="M 692 168 C 745 168, 745 112, 798 112"
                fill="none"
                stroke="#10b981"
                strokeWidth={isTrueBranch ? 7 : 4}
                strokeOpacity={isTrueBranch ? 0.35 : 0.1}
              />
              <path
                d="M 692 168 C 745 168, 745 112, 798 112"
                fill="none"
                stroke="#10b981"
                strokeWidth={2.5}
                strokeOpacity={isTrueBranch ? 1 : 0.3}
                strokeLinecap="round"
              />
              {isTrueBranch && (
                <path
                  d="M 692 168 C 745 168, 745 112, 798 112"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  strokeDasharray="4 16"
                  strokeOpacity={0.75}
                />
              )}

              <path
                d="M 692 238 C 745 238, 745 292, 798 292"
                fill="none"
                stroke="#f43f5e"
                strokeWidth={!isTrueBranch ? 7 : 4}
                strokeOpacity={!isTrueBranch ? 0.35 : 0.1}
              />
              <path
                d="M 692 238 C 745 238, 745 292, 798 292"
                fill="none"
                stroke="#f43f5e"
                strokeWidth={2.5}
                strokeOpacity={!isTrueBranch ? 1 : 0.3}
                strokeLinecap="round"
              />
              {!isTrueBranch && (
                <path
                  d="M 692 238 C 745 238, 745 292, 798 292"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  strokeDasharray="4 16"
                  strokeOpacity={0.75}
                />
              )}
            </svg>

            <div className="relative z-20 w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6">
              <div
                className={`w-[248px] shrink-0 p-3.5 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-zinc-900/75 via-zinc-900/82 to-zinc-950/90 border transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.65)] ${
                  runPhase === 'TRIGGER'
                    ? 'border-sky-500/70 shadow-[0_8px_24px_rgba(0,0,0,0.65),0_0_20px_rgba(56,189,248,0.3)]'
                    : 'border-zinc-700/80 hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-2.5 pb-2 mb-2 border-b border-zinc-800/80">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950/80 border border-zinc-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center shrink-0">
                    <Zap className="size-4 text-amber-400" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-zinc-100 truncate tracking-tight">
                      Incoming Webhook
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-400 truncate opacity-80">
                      Webhook Trigger
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 py-1.5 px-1">
                  <span className="opacity-70">Source</span>
                  <span className="text-zinc-200 font-semibold">Incoming Payload</span>
                </div>

                <div className="flex justify-end pt-2 -mr-3.5">
                  <div className="relative flex items-center h-[26px] w-[60px] rounded-l-lg bg-zinc-950/95 border-y border-l border-r-0 border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] justify-end pr-1.5">
                    <span className="text-[8px] font-mono font-bold tracking-wider uppercase text-zinc-500 pr-1">
                      OUT
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`w-[310px] shrink-0 p-3.5 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-zinc-900/75 via-zinc-900/82 to-zinc-950/90 border transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.65)] ${
                  runPhase === 'CONDITION'
                    ? 'border-sky-500/70 shadow-[0_8px_24px_rgba(0,0,0,0.65),0_0_20px_rgba(56,189,248,0.3)]'
                    : 'border-zinc-700/80 hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-2.5 pb-2 mb-2 border-b border-zinc-800/80">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950/80 border border-zinc-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 text-zinc-300">
                    <GitFork className="size-4" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-zinc-100 truncate tracking-tight">
                      Condition
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-400 truncate opacity-80">
                      Logic Comparator
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-0.5">
                  <div className="flex items-center justify-between -mx-3.5">
                    <div className="relative flex items-center h-[26px] w-[60px] rounded-r-lg bg-zinc-950/95 border-y border-r border-l-0 border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] pl-0.5">
                      <div className="w-[52px] h-[20px] flex items-center justify-between px-2 rounded-[5px] border bg-gradient-to-r from-zinc-800 to-zinc-900 border-zinc-600/80 shadow-[0_0_8px_rgba(56,189,248,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]">
                        <span className="text-[8px] font-mono font-bold tracking-wider uppercase text-zinc-100">
                          IN A
                        </span>
                        <div className="w-1.5 h-3 rounded-xs border bg-sky-400 border-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
                      </div>
                    </div>

                    <div className="flex-1 mx-1.5 bg-zinc-950/90 border border-zinc-800/90 rounded-lg px-2.5 py-1.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.7)] flex items-center justify-center min-w-0">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="flex items-center gap-0.5 text-[8px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded shrink-0">
                          <Zap className="w-2 h-2" />
                          TRIGGER
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-zinc-100 truncate">
                          .status
                        </span>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-end h-[26px] w-[60px] rounded-l-lg bg-zinc-950/95 border-y border-l border-r-0 border-emerald-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] pr-0.5">
                      <div className="w-[52px] h-[20px] flex items-center justify-between px-2 rounded-[5px] border bg-gradient-to-r from-emerald-900 to-emerald-950 border-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]">
                        <span className="text-[8px] font-mono font-bold tracking-wider uppercase text-emerald-100">
                          TRUE
                        </span>
                        <div className="w-1.5 h-3 rounded-xs border bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center py-0.5 z-10">
                    <div className="absolute inset-x-4 h-px bg-zinc-800/80" />
                    <button
                      type="button"
                      onClick={() => setOperator(operator === 'equals' ? 'not_equals' : 'equals')}
                      title="Click to toggle comparator operator"
                      className="relative z-10 bg-gradient-to-b from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 active:scale-95 border border-zinc-600/90 hover:border-zinc-400 rounded-md px-2.5 py-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)] flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <span className="text-[11px] font-mono font-bold text-amber-300 tracking-tight">
                        {operator === 'equals' ? '===' : '≠'}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-wider">
                        {operator}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between -mx-3.5">
                    <div className="relative flex items-center h-[26px] w-[60px] rounded-r-lg bg-zinc-950/95 border-y border-r border-l-0 border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] pl-2">
                      <span className="text-[8px] font-mono font-bold tracking-wider uppercase text-zinc-600">
                        IN B
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTargetVal(targetVal === '"success"' ? '"failed"' : '"success"')}
                      title="Click to toggle target value"
                      className="flex-1 mx-1.5 bg-zinc-950/90 hover:bg-zinc-900 border border-zinc-800/90 hover:border-zinc-600 rounded-lg px-2.5 py-1.5 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.7)] flex items-center justify-center min-w-0 cursor-pointer transition-all"
                    >
                      <span className="text-[11px] font-mono text-zinc-200 font-medium">
                        {targetVal}
                      </span>
                    </button>

                    <div className="relative flex items-center justify-end h-[26px] w-[60px] rounded-l-lg bg-zinc-950/95 border-y border-l border-r-0 border-rose-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] pr-0.5">
                      <div className="w-[52px] h-[20px] flex items-center justify-between px-2 rounded-[5px] border bg-gradient-to-r from-rose-900 to-rose-950 border-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]">
                        <span className="text-[8px] font-mono font-bold tracking-wider uppercase text-rose-100">
                          FALSE
                        </span>
                        <div className="w-1.5 h-3 rounded-xs border bg-rose-400 border-rose-300 shadow-[0_0_6px_rgba(244,63,94,0.7)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-[252px] shrink-0">
                <div
                  className={`p-3.5 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-zinc-900/75 via-zinc-900/82 to-zinc-950/90 border transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.65)] ${
                    isTrueBranch
                      ? 'border-emerald-500/60 shadow-[0_8px_24px_rgba(0,0,0,0.65),0_0_18px_rgba(16,185,129,0.22)]'
                      : 'border-zinc-800/80 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-zinc-950/80 border border-zinc-700/60 flex items-center justify-center">
                        <Globe className="size-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-100">Stripe Settlement</h4>
                        <span className="text-[9px] font-mono text-zinc-400 block">api.stripe.com</span>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {isTrueBranch ? 'COMPLETED' : 'SKIPPED'}
                    </span>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg px-2 py-1 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.6)] flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded border bg-sky-500/10 text-sky-400 border-sky-500/30">
                      POST
                    </span>
                    <span className="text-[10px] font-mono text-zinc-300 truncate">
                      /v1/charges/capture
                    </span>
                  </div>

                  <div className="flex items-center justify-between -mx-3.5">
                    <div className="relative flex items-center h-[24px] w-[56px] rounded-r-lg bg-zinc-950/95 border-y border-r border-l-0 border-emerald-950 pl-0.5">
                      <div className="w-[48px] h-[18px] flex items-center justify-between px-1.5 rounded-[4px] border bg-gradient-to-r from-emerald-900 to-emerald-950 border-emerald-500/80">
                        <span className="text-[7px] font-mono font-bold text-emerald-100">IN</span>
                        <div className="w-1 h-2.5 rounded-xs bg-emerald-400" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 pr-3">200 OK • 18ms</span>
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-zinc-900/75 via-zinc-900/82 to-zinc-950/90 border transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.65)] ${
                    !isTrueBranch
                      ? 'border-rose-500/60 shadow-[0_8px_24px_rgba(0,0,0,0.65),0_0_18px_rgba(244,63,94,0.22)]'
                      : 'border-zinc-800/80 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-zinc-950/80 border border-zinc-700/60 flex items-center justify-center">
                        <ShieldCheck className="size-3.5 text-rose-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-100">Fraud Escalation</h4>
                        <span className="text-[9px] font-mono text-zinc-400 block">events.pagerduty.com</span>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      {!isTrueBranch ? 'COMPLETED' : 'SKIPPED'}
                    </span>
                  </div>

                  <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg px-2 py-1 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.6)] flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded border bg-rose-500/10 text-rose-400 border-rose-500/30">
                      POST
                    </span>
                    <span className="text-[10px] font-mono text-zinc-300 truncate">
                      /v2/incidents/alert
                    </span>
                  </div>

                  <div className="flex items-center justify-between -mx-3.5">
                    <div className="relative flex items-center h-[24px] w-[56px] rounded-r-lg bg-zinc-950/95 border-y border-r border-l-0 border-rose-950 pl-0.5">
                      <div className="w-[48px] h-[18px] flex items-center justify-between px-1.5 rounded-[4px] border bg-gradient-to-r from-rose-900 to-rose-950 border-rose-500/80">
                        <span className="text-[7px] font-mono font-bold text-rose-100">IN</span>
                        <div className="w-1 h-2.5 rounded-xs bg-rose-400" />
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 pr-3">Branch: FALSE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="benchmarks"
          className="my-12 border-y border-zinc-800/70 bg-zinc-950/35 backdrop-blur-sm scroll-mt-24"
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/70">
            {[
              {
                title: 'DFS Cycle Lock',
                sub: 'In-Flight Cable Guard',
                val: '< 0.04ms',
                plug: 'ACYCLIC',
                pin: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]',
              },
              {
                title: 'Kahn Wave Sort',
                sub: 'Topological Compiler',
                val: 'O(V + E)',
                plug: 'PARALLEL',
                pin: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
              },
              {
                title: 'PostgreSQL State',
                sub: 'UUIDv4 & Run Snapshots',
                val: '100% ACID',
                plug: 'COMMITTED',
                pin: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]',
              },
              {
                title: 'SSE Patch Stream',
                sub: 'Live Socket Telemetry',
                val: 'Zero Poll',
                plug: 'REALTIME',
                pin: 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
              },
            ].map((item, idx) => (
              <div key={idx} className="py-7 px-4 sm:px-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    {item.plug}
                  </span>
                  <span className={`w-1.5 h-3 rounded-xs ${item.pin}`} />
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
                  {item.val}
                </div>
                <div className="mt-1.5">
                  <div className="text-xs font-semibold text-zinc-200">{item.title}</div>
                  <div className="text-[11px] font-mono text-zinc-500">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="features"
          className="py-16 px-6 lg:px-12 max-w-6xl mx-auto scroll-mt-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-2">
                <Cpu className="size-3.5" />
                <span>MODULAR HARDWARE ARCHITECTURE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
                Industrial-Grade Execution Primitives
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-400 max-w-md">
              Built like a physical hardware rack: every module port, cable connection, and execution context is isolated and deterministically typed.
            </p>
          </div>

          <MagicBento />
        </section>

        <section
          id="engine"
          className="py-20 px-6 lg:px-12 max-w-6xl mx-auto border-t border-zinc-800/60 scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-amber-400">
                <Terminal className="size-3.5" />
                <span>STATELESS NODE EXECUTOR</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight leading-snug">
                Deterministic Wave Dispatch &amp; Path Resolution
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Synapse compiles visual node graphs into topological execution arrays. Each wave runs in parallel while resolving upstream variables via <code className="text-amber-300 font-mono">resolvePath</code>.
              </p>

              <ul className="space-y-3 pt-2">
                {[
                  'Kahn topological sorting with zero-in-degree wave batching',
                  'Strategy pattern executors validated with strict Zod schemas',
                  'Native PostgreSQL UUIDv4 persistence for runs & versions',
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs font-mono text-zinc-300"
                  >
                    <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <BorderGlow
                borderRadius="1rem"
                accentRgb="245, 158, 11"
                glowRadius={420}
              >
                <div className="font-mono text-xs">
                  <div className="px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950/90 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>packages/core/src/runtime/runner.ts</span>
                    <span className="text-emerald-400">KAHN EXECUTION LOOP</span>
                  </div>
                  <pre className="p-5 text-[11px] sm:text-xs leading-relaxed text-zinc-300 overflow-x-auto bg-zinc-950/60">
                    <code>{`const layers = kahnTopologicalSort(workflow.nodes, workflow.edges);

for (const layer of layers) {
  await Promise.all(
    layer.map(async (nodeId) => {
      const node = nodeMap.get(nodeId)!;
      const resolvedConfig = interpolate(node.config, context);
      const output = await registry.execute(node.type, resolvedConfig);
      context.setNodeOutput(node.id, output);
      telemetryBroker.emit(runId, { type: 'NODE_COMPLETED', nodeId, output });
    })
  );
}`}</code>
                  </pre>
                </div>
              </BorderGlow>
            </div>
          </div>
        </section>

        <section
          id="cta"
          className="relative py-24 px-6 lg:px-12 max-w-4xl mx-auto text-center border-t border-zinc-800/60 scroll-mt-24"
        >
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider mb-5">
            <Database className="size-3.5" />
            <span>POSTGRESQL CLUSTER ONLINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-zinc-100 tracking-tight max-w-2xl mx-auto leading-[1.12]">
            Ready to Wire Your First Deterministic Pipeline?
          </h2>

          <p className="mt-4 text-xs sm:text-sm font-mono text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Mount the Synapse Studio patchbay, inspect pre-seeded production templates in PostgreSQL, or patch new webhook workflows from scratch.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <SpecularButton
              variant="emerald"
              ledColor="emerald"
              shortcut="NEW"
              onClick={() => navigate('/register')}
            >
              <span>Create Developer Account</span>
              <ArrowRight className="size-3.5" />
            </SpecularButton>

            <SpecularButton
              variant="secondary"
              ledColor="sky"
              shortcut="AUTH"
              onClick={() => navigate('/login')}
            >
              <span>Sign In to Workspace</span>
            </SpecularButton>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-zinc-800/80 bg-[#060608]/90 backdrop-blur-md select-none overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-zinc-800/70">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-8 font-mono font-bold text-base rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-[0_0_14px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-300/40 shrink-0">
                  S
                </div>
                <div>
                  <span className="font-sans font-bold text-sm text-zinc-100 tracking-tight block">
                    Synapse Engine
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    Deterministic DAG Patchbay
                  </span>
                </div>
              </div>

              <p className="text-xs font-mono text-zinc-400 leading-relaxed max-w-sm">
                Tactile workflow orchestration engineered with Kahn topological layer sorting, in-flight DFS cycle prevention, and native PostgreSQL state persistence.
              </p>

              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800/90 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.8)]">
                <span className="w-1.5 h-3 rounded-xs bg-emerald-400 border border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] font-mono font-semibold text-zinc-300 tracking-wider uppercase">
                  RUNTIME CLUSTER: OPERATIONAL
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                01 / Navigation
              </div>
              <ul className="space-y-2 text-xs font-mono text-zinc-400">
                {[
                  { label: 'Patchbay Hero', href: '#overview' },
                  { label: 'Live Node Canvas', href: '#architecture' },
                  { label: 'Chassis Specs', href: '#benchmarks' },
                  { label: 'Magic Bento', href: '#features' },
                  { label: 'Kahn Compiler', href: '#engine' },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-2 hover:text-zinc-100 transition-colors"
                    >
                      <span className="w-1 h-2.5 rounded-xs bg-zinc-800 group-hover:bg-amber-400 transition-colors" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                02 / Workspace
              </div>
              <ul className="space-y-2 text-xs font-mono text-zinc-400">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="group inline-flex items-center gap-2 hover:text-zinc-100 transition-colors cursor-pointer"
                  >
                    <span className="w-1 h-2.5 rounded-xs bg-zinc-800 group-hover:bg-sky-400 transition-colors" />
                    <span>Open Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="group inline-flex items-center gap-2 hover:text-zinc-100 transition-colors cursor-pointer"
                  >
                    <span className="w-1 h-2.5 rounded-xs bg-zinc-800 group-hover:bg-sky-400 transition-colors" />
                    <span>Operator Sign In</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="group inline-flex items-center gap-2 hover:text-zinc-100 transition-colors cursor-pointer"
                  >
                    <span className="w-1 h-2.5 rounded-xs bg-zinc-800 group-hover:bg-emerald-400 transition-colors" />
                    <span>Create Account</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                03 / Architecture Specs
              </div>
              <div className="space-y-2 text-[11px] font-mono">
                {[
                  { k: 'DAG Sort', v: 'Kahn O(V + E)', c: 'text-amber-400' },
                  { k: 'Cycle Guard', v: 'In-Flight DFS', c: 'text-emerald-400' },
                  { k: 'Persistence', v: 'PostgreSQL UUIDv4', c: 'text-sky-400' },
                  { k: 'Telemetry', v: 'Fastify SSE Stream', c: 'text-rose-400' },
                ].map((spec) => (
                  <div
                    key={spec.k}
                    className="flex items-center justify-between border-b border-zinc-800/50 pb-1.5"
                  >
                    <span className="text-zinc-500">{spec.k}</span>
                    <span className={spec.c}>{spec.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
            <div className="flex items-center gap-4">
              <span>© {new Date().getFullYear()} SYNAPSE ENGINE</span>
              <span className="hidden sm:inline text-zinc-700">•</span>
              <span className="hidden sm:inline">RELEASE v0.1.0</span>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors cursor-pointer"
            >
              <span>RETURN TO TOP</span>
              <span className="text-amber-400 group-hover:-translate-y-0.5 transition-transform">↑</span>
            </button>
          </div>
        </div>

        <div className="pointer-events-none select-none overflow-hidden flex justify-center -mb-6 sm:-mb-10">
          <span className="font-mono font-black text-[72px] sm:text-[130px] lg:text-[180px] leading-none tracking-tighter bg-gradient-to-b from-zinc-800/40 via-zinc-900/15 to-transparent bg-clip-text text-transparent">
            SYNAPSE
          </span>
        </div>
      </footer>
    </div>
  );
};
