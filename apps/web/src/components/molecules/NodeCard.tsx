import React from 'react';
import { NodeExecutionStatus } from '../../types/workflow';

export interface NodeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  status?: NodeExecutionStatus;
  children: React.ReactNode;
}

const statusChassisStyles: Record<NodeExecutionStatus, string> = {
  IDLE: 'border-zinc-700/80 hover:border-zinc-500 shadow-[0_8px_24px_rgba(0,0,0,0.65)]',
  RUNNING: 'border-sky-500/60 shadow-[0_8px_24px_rgba(0,0,0,0.65),0_0_18px_rgba(56,189,248,0.25)]',
  COMPLETED: 'border-emerald-500/50 shadow-[0_8px_24px_rgba(0,0,0,0.65),0_0_18px_rgba(16,185,129,0.2)]',
  FAILED: 'border-rose-500/60 shadow-[0_8px_24px_rgba(0,0,0,0.65),0_0_18px_rgba(244,63,94,0.25)]',
  SKIPPED: 'border-zinc-800/80 opacity-55 shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
};

export const NodeCard: React.FC<NodeCardProps> = ({
  selected = false,
  status = 'IDLE',
  children,
  className = '',
  onClick,
  ...props
}) => {
  const chassisStyle = statusChassisStyles[status] || statusChassisStyles.IDLE;

  return (
    <div
      data-selected={selected}
      data-status={status}
      onClick={onClick}
      className={`
        relative select-none min-w-[240px] p-3.5 rounded-2xl backdrop-blur-2xl backdrop-saturate-[180%] backdrop-contrast-[110%] cursor-pointer
        bg-gradient-to-b from-zinc-900/70 via-zinc-900/78 to-zinc-950/85
        border transition-all duration-200
        shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_32px_rgba(0,0,0,0.65)]
        ${chassisStyle}
        ${selected ? 'ring-2 ring-indigo-500/80 !border-indigo-400 shadow-[0_0_24px_rgba(99,102,241,0.35)]' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
