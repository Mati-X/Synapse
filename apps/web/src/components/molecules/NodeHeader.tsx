import React from 'react';
import { NodeExecutionStatus } from '../../types/workflow';

export interface NodeHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  status?: NodeExecutionStatus;
  category?: string;
  className?: string;
}

const statusBadgeStyles: Record<NodeExecutionStatus, { pill: string; dot: string }> = {
  IDLE: {
    pill: 'bg-zinc-800/40 text-zinc-400 border-zinc-700/40',
    dot: 'bg-zinc-500',
  },
  RUNNING: {
    pill: 'bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-[0_0_8px_rgba(56,189,248,0.25)] animate-pulse',
    dot: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]',
  },
  COMPLETED: {
    pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]',
    dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]',
  },
  FAILED: {
    pill: 'bg-rose-500/15 text-rose-400 border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.25)]',
    dot: 'bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
  },
  SKIPPED: {
    pill: 'bg-zinc-800/80 text-zinc-400 border-zinc-700/60',
    dot: 'bg-zinc-500',
  },
};

export const NodeHeader: React.FC<NodeHeaderProps> = ({
  title,
  subtitle,
  icon,
  status,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2.5 pb-2 mb-2 border-b border-zinc-800/80 select-none ${className}`}>
      {icon && (
        <div className="w-8 h-8 rounded-lg bg-zinc-950/80 border border-zinc-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 text-zinc-300 [&>svg]:size-4">
          {icon}
        </div>
      )}

      <div className="flex flex-col min-w-0 flex-1">
        <h4 className="text-xs font-semibold text-zinc-100 truncate tracking-tight">
          {title}
        </h4>
        {subtitle && (
          <span className="text-[10px] font-mono text-zinc-400 truncate opacity-80" title={subtitle}>
            {subtitle}
          </span>
        )}
      </div>

      {status && status !== 'IDLE' && (
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-mono font-bold tracking-wider uppercase shrink-0 border ${statusBadgeStyles[status].pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusBadgeStyles[status].dot}`} />
          <span>{status}</span>
        </div>
      )}
    </div>
  );
};