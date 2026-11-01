import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export interface CycleAlertProps {
  message: string | null;
  onDismiss: () => void;
}

export const CycleAlert: React.FC<CycleAlertProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-rose-950/90 border border-rose-500/80 text-rose-100 shadow-[0_12px_36px_rgba(0,0,0,0.8),0_0_24px_rgba(244,63,94,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-150 select-none max-w-lg">
      <div className="size-6 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 text-rose-400">
        <AlertTriangle className="size-3.5" />
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
          In-Flight DAG Cycle Prevented
        </span>
        <span className="text-xs font-mono text-rose-200/90 truncate">
          {message}
        </span>
      </div>

      <button
        onClick={onDismiss}
        className="ml-2 text-rose-400 hover:text-white p-1 hover:bg-rose-900/50 rounded-lg transition-colors cursor-pointer"
        title="Dismiss alert"
      >
        <X className="size-4" />
      </button>
    </div>
  );
};
