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
  Cable,
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
          className="pt-28 pb-12 px-6 lg:px-12 max-w-6xl mx-auto flex flex-col items-center text-center scroll-mt-24"
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
          className="py-6 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto scroll-mt-20"
        >
          <BorderGlow
            borderRadius="1rem"
            accentRgb="56, 189, 248"
            glowRadius={520}
            className="w-full"
          >
            <div className="bg-[#070709] rounded-[15px] overflow-hidden border border-zinc-800/80">
                <div className="h-12 px-4 sm:px-5 bg-zinc-900/95 border-b border-zinc-800/90 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-7 font-mono font-bold text-xs rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-[0_0_12px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-300/40">
                      P
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-100 tracking-tight">
                        Payment Fraud Sentinel
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.2 rounded">
                        v1
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOperator('equals');
                        setTargetVal('"success"');
                        setRunPhase('COMPLETED');
                      }}
                      className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-gradient-to-b from-zinc-800/90 to-zinc-900 text-zinc-300 border border-zinc-700/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-zinc-500 cursor-pointer"
                    >
                      <RotateCcw className="size-3 text-zinc-400" />
                      <span>Reset</span>
                    </button>

                    <button
                      type="button"
                      onClick={triggerSignalRun}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono font-semibold bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white border border-indigo-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_12px_rgba(99,102,241,0.35)] cursor-pointer active:scale-95 transition-all"
                    >
                      <Play className="size-3 fill-white" />
                      <span>{isRunning ? 'Executing Patch...' : 'Run Pipeline'}</span>
                      <kbd className="ml-1 px-1 py-0.2 text-[9px] font-mono rounded bg-black/30 border border-white/10 text-white/80">
                        ⌘↵
                      </kbd>
                    </button>
                  </div>
                </div>

                <div className="relative p-6 sm:p-10 min-h-[430px] flex items-center justify-center overflow-x-auto">
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #52525b 1px, transparent 1px)',
                      backgroundSize: '18px 18px',
                    }}
                  />

                  <svg
                    className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10"
                    viewBox="0 0 1050 420"
                     preserveAspectRatio="none"
                  >
                    <path
                      d="M 278 258 C 335 258, 335 182, 392 182"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth={7}
                      strokeOpacity={runPhase === 'TRIGGER' || runPhase === 'CONDITION' ? 0.45 : 0.25}
                    />
                    <path
                      d="M 278 258 C 335 258, 335 182, 392 182"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                    />
                    <path
                      d="M 278 258 C 335 258, 335 182, 392 182"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      strokeDasharray="4 16"
                      strokeOpacity={0.75}
                    />

                    <path
                      d="M 702 182 C 745 182, 745 128, 788 128"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={isTrueBranch ? 7 : 4}
                      strokeOpacity={isTrueBranch ? 0.35 : 0.1}
                    />
                    <path
                      d="M 702 182 C 745 182, 745 128, 788 128"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      strokeOpacity={isTrueBranch ? 1 : 0.3}
                      strokeLinecap="round"
                    />
                    {isTrueBranch && (
                      <path
                        d="M 702 182 C 745 182, 745 128, 788 128"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        strokeDasharray="4 16"
                        strokeOpacity={0.75}
                      />
                    )}

                    <path
                      d="M 702 252 C 745 252, 745 305, 788 305"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth={!isTrueBranch ? 7 : 4}
                      strokeOpacity={!isTrueBranch ? 0.35 : 0.1}
                    />
                    <path
                      d="M 702 252 C 745 252, 745 305, 788 305"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      strokeOpacity={!isTrueBranch ? 1 : 0.3}
                      strokeLinecap="round"
                    />
                    {!isTrueBranch && (
                      <path
                        d="M 702 252 C 745 252, 745 305, 788 305"
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
                      className={`w-[245px] shrink-0 p-3.5 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-zinc-900/75 via-zinc-900/82 to-zinc-950/90 border transition-all duration-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.65)] ${
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

                    <div className="flex flex-col gap-4 w-[250px] shrink-0">
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

                <div className="h-8 border-t border-zinc-800/80 bg-zinc-950/95 text-zinc-400 text-[11px] font-mono flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
                      <span className="font-semibold text-zinc-300">SYNAPSE RUNTIME READY</span>
                    </div>
                    <div className="w-px h-3.5 bg-zinc-800 hidden sm:block" />
                    <div className="hidden sm:flex items-center gap-3 text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Layers className="size-3 text-zinc-500" />
                        <span>4 Modules</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Cable className="size-3 text-zinc-500" />
                        <span>3 Patch Cables</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                    <span>Click operator button (===) on Condition module to switch active cable</span>
                  </div>
                </div>
              </div>
            </BorderGlow>
        </section>

        <section
          id="benchmarks"
          className="py-10 px-6 lg:px-12 max-w-6xl mx-auto scroll-mt-24"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'DFS Cycle Lock',
                sub: 'In-Flight Cable Guard',
                val: '< 0.04ms',
                plug: 'ACYCLIC',
                pin: 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.8)]',
                accentRgb: '16, 185, 129',
              },
              {
                title: 'Kahn Wave Sort',
                sub: 'Topological Compiler',
                val: 'O(V + E)',
                plug: 'PARALLEL',
                pin: 'bg-amber-400 border-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
                accentRgb: '245, 158, 11',
              },
              {
                title: 'PostgreSQL State',
                sub: 'UUIDv4 & Run Snapshots',
                val: '100% ACID',
                plug: 'COMMITTED',
                pin: 'bg-sky-400 border-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.8)]',
                accentRgb: '56, 189, 248',
              },
              {
                title: 'SSE Patch Stream',
                sub: 'Live Socket Telemetry',
                val: 'Zero Poll',
                plug: 'REALTIME',
                pin: 'bg-rose-400 border-rose-300 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
                accentRgb: '244, 63, 94',
              },
            ].map((item, idx) => (
              <BorderGlow
                key={idx}
                accentRgb={item.accentRgb}
                glowRadius={280}
                borderRadius="1rem"
                innerClassName="p-4 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80">
                  <div>
                    <div className="text-xs font-semibold text-zinc-100">{item.title}</div>
                    <div className="text-[10px] font-mono text-zinc-400">{item.sub}</div>
                  </div>
                  <div className="h-[22px] px-2 rounded-[5px] border bg-gradient-to-r from-zinc-800 to-zinc-900 border-zinc-600/80 flex items-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
                    <span className="text-[8px] font-mono font-bold text-zinc-200">{item.plug}</span>
                    <div className={`w-1.5 h-3 rounded-xs border ${item.pin}`} />
                  </div>
                </div>

                <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-lg px-3 py-2 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">BENCHMARK</span>
                  <span className="font-mono text-lg font-bold text-zinc-100">{item.val}</span>
                </div>
              </BorderGlow>
            ))}
          </div>
        </section>

        <section
          id="features"
          className="py-16 px-6 lg:px-12 max-w-6xl mx-auto scroll-mt-20"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded mb-2">
                <Cpu className="size-3" />
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
          className="py-14 px-6 lg:px-12 max-w-6xl mx-auto scroll-mt-24"
        >
          <BorderGlow
            borderRadius="1rem"
            accentRgb="245, 158, 11"
            glowRadius={460}
            innerClassName="p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800/80">
                  <div className="w-8 h-8 rounded-lg bg-zinc-950/90 border border-zinc-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center">
                    <Terminal className="size-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">Stateless NodeExecutor</h3>
                    <span className="text-[10px] font-mono text-zinc-400 block">
                      packages/core/src/runtime/runner.ts
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Synapse compiles visual node graphs into topological execution arrays. Each wave runs in parallel while resolving upstream variables via <code className="text-amber-300 font-mono">resolvePath</code>.
                </p>

                <div className="space-y-2">
                  {[
                    'Kahn topological sorting with zero-in-degree wave batching',
                    'Strategy pattern executors validated with strict Zod schemas',
                    'Native PostgreSQL UUIDv4 persistence for runs & versions',
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-zinc-950/90 border border-zinc-800/90 rounded-lg px-3 py-2 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.75)] flex items-center gap-2 text-xs font-mono text-zinc-300"
                    >
                      <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/95 shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)] overflow-hidden font-mono text-xs">
                  <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/80 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>KAHN EXECUTION LOOP</span>
                    <span className="text-emerald-400">DETERMINISTIC DAG</span>
                  </div>
                  <pre className="p-4 text-[11px] leading-relaxed text-zinc-300 overflow-x-auto">
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
              </div>
            </div>
          </BorderGlow>
        </section>

        <section
          id="cta"
          className="py-16 px-6 lg:px-12 max-w-5xl mx-auto scroll-mt-24"
        >
          <BorderGlow
            borderRadius="1rem"
            accentRgb="16, 185, 129"
            glowRadius={480}
            innerClassName="p-8 sm:p-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider mb-4">
              <Database className="size-3.5" />
              <span>POSTGRESQL CLUSTER ONLINE</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-zinc-100 tracking-tight max-w-xl mx-auto">
              Ready to Wire Your First Deterministic Pipeline?
            </h2>

            <p className="mt-3 text-xs sm:text-sm font-mono text-zinc-400 max-w-lg mx-auto">
              Mount the Synapse Studio patchbay, inspect pre-seeded production templates in PostgreSQL, or patch new webhook workflows from scratch.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3.5">
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
          </BorderGlow>
        </section>
      </main>

      <footer className="relative z-10 h-10 border-t border-zinc-800/80 bg-zinc-950/95 text-zinc-400 text-[11px] font-mono select-none flex items-center justify-between px-6 lg:px-12">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span className="font-semibold text-zinc-300">SYNAPSE ENGINE v0.1.0</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-500 text-[10px]">
            <span className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
              PostgreSQL + Drizzle
            </span>
            <span className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">
              Kahn DAG + DFS
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
