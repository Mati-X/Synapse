import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Layers, Cable, CheckCircle2, AlertCircle } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { nodes, edges, isExecuting, selectedNodeId } = useWorkflowStore();

  const completedCount = nodes.filter((n) => n.data.status === 'COMPLETED').length;
  const failedCount = nodes.filter((n) => n.data.status === 'FAILED').length;

  return (
    <footer className="h-7 border-t border-zinc-800/80 bg-zinc-950/95 text-zinc-400 text-[11px] font-mono select-none flex items-center justify-between px-4 z-40 backdrop-blur-md">
      {/* Left: Execution Status & Stats */}
      <div className="flex items-center gap-4">
        {/* Engine State Indicator */}
        <div className="flex items-center gap-1.5">
          <span
            className={`size-2 rounded-full ${
              isExecuting
                ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)] animate-pulse'
                : failedCount > 0
                ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                : completedCount > 0
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                : 'bg-zinc-600'
            }`}
          />
          <span className="font-semibold text-zinc-300">
            {isExecuting ? 'EXECUTING PIPELINE' : 'SYNAPSE RUNTIME READY'}
          </span>
        </div>

        <div className="w-px h-3.5 bg-zinc-800" />

        {/* Modules & Cables counts */}
        <div className="flex items-center gap-3 text-zinc-400">
          <span className="flex items-center gap-1 hover:text-zinc-200 transition-colors">
            <Layers className="size-3 text-zinc-500" />
            <span>{nodes.length} Modules</span>
          </span>
          <span className="flex items-center gap-1 hover:text-zinc-200 transition-colors">
            <Cable className="size-3 text-zinc-500" />
            <span>{edges.length} Cables</span>
          </span>
        </div>

        {/* Run results if completed */}
        {(completedCount > 0 || failedCount > 0) && (
          <>
            <div className="w-px h-3.5 bg-zinc-800" />
            <div className="flex items-center gap-2">
              {completedCount > 0 && (
                <span className="flex items-center gap-1 text-emerald-400/90">
                  <CheckCircle2 className="size-3" />
                  <span>{completedCount} Completed</span>
                </span>
              )}
              {failedCount > 0 && (
                <span className="flex items-center gap-1 text-rose-400">
                  <AlertCircle className="size-3" />
                  <span>{failedCount} Failed</span>
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right: Quick Hotkey hints */}
      <div className="flex items-center gap-3 text-zinc-500 text-[10px]">
        {selectedNodeId && (
          <span className="text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
            Selected: {selectedNodeId}
          </span>
        )}
        <span className="flex items-center gap-1">
          <kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded text-zinc-400 font-bold">R-Click</kbd>
          <span>Context Menu</span>
        </span>
        <span className="flex items-center gap-1">
          <kbd className="bg-zinc-900 border border-zinc-800 px-1 rounded text-zinc-400 font-bold">Space+Drag</kbd>
          <span>Pan</span>
        </span>
      </div>
    </footer>
  );
};
