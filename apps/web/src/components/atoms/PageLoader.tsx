import React from 'react';

export interface PageLoaderProps {
  message?: string;
  subMessage?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Initializing Synapse Workspace...',
  subMessage = 'Connecting to PostgreSQL DAG cluster',
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#070709] flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
      <div className="relative mb-6">
        <div className="size-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-zinc-950 font-mono font-bold text-2xl shadow-[0_0_32px_rgba(245,158,11,0.45)] border border-amber-300/40 animate-pulse">
          S
        </div>
        <div className="absolute -inset-2 rounded-3xl bg-amber-500/20 blur-xl -z-10 animate-pulse" />
      </div>

      <div className="w-56 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 mb-4">
        <div className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full animate-shimmer w-full" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs font-semibold text-zinc-200 tracking-tight">{message}</p>
        <p className="text-[11px] font-mono text-zinc-500">{subMessage}</p>
      </div>
    </div>
  );
};
