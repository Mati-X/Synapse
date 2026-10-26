import React from 'react';
import { NodeExecutionStatus } from '../../types/workflow';

export interface NodeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  status?: NodeExecutionStatus;
  footerLabel?: string;
  children: React.ReactNode;
}

const trayStatusStyles: Record<NodeExecutionStatus, { container: string; text: string }> = {
  IDLE: {
    container: 'bg-zinc-950/90 border-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
    text: 'text-zinc-400',
  },
  RUNNING: {
    container: 'bg-gradient-to-b from-sky-950/90 to-sky-900/90 border-sky-600/60 shadow-[0_4px_16px_rgba(56,189,248,0.25)] animate-pulse',
    text: 'text-sky-300',
  },
  COMPLETED: {
    container: 'bg-gradient-to-b from-emerald-950/90 to-emerald-900/90 border-emerald-600/60 shadow-[0_4px_16px_rgba(16,185,129,0.2)]',
    text: 'text-emerald-300',
  },
  FAILED: {
    container: 'bg-gradient-to-b from-rose-950/90 to-rose-900/90 border-rose-600/60 shadow-[0_4px_16px_rgba(244,63,94,0.25)]',
    text: 'text-rose-300',
  },
  SKIPPED: {
    container: 'bg-zinc-950/60 border-zinc-800/80 opacity-60',
    text: 'text-zinc-500',
  },
};

export const NodeCard: React.FC<NodeCardProps> = ({
  selected = false,
  status = 'IDLE',
  footerLabel,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const currentTray = trayStatusStyles[status];
  const displayLabel = footerLabel || status;

  return (
    <div
      data-selected={selected}
      data-status={status}
      onClick={onClick}
      className={`relative select-none min-w-[240px] transition-all duration-150 ${className}`}
      {...props}
    >
      <div
        className={`
          relative z-10 p-3.5 rounded-2xl backdrop-blur-md cursor-pointer
          bg-gradient-to-b from-zinc-800/95 to-zinc-900/95
          border border-zinc-700/70
          shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_8px_20px_rgba(0,0,0,0.5)]
          transition-all duration-150
          ${selected ? 'ring-1 ring-inset ring-current/40 shadow-[0_0_20px_rgba(99,102,241,0.25)]' : 'hover:border-zinc-600'}
        `}
      >
        {children}
      </div>

      <div
        className={`
          relative z-0 -mt-3 pt-4 pb-1.5 px-3.5 rounded-b-2xl border-x border-b
          flex items-center justify-between text-[10px] font-mono font-bold tracking-widest uppercase
          transition-all duration-200
          ${currentTray.container}
        `}
      >
        <span className={currentTray.text}>{displayLabel}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      </div>
    </div>
  );
};
