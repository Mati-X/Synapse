import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { useWorkflowStore } from '../../store/workflowStore';
import { Play, RotateCcw, Zap, GitBranch, Globe, Loader2, LayoutGrid, Pencil } from 'lucide-react';

export interface TopBarProps {
  onRunWorkflow?: () => void;
  onNavigateHome?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onRunWorkflow,
  onNavigateHome,
}) => {
  const {
    workflowMeta,
    addNode,
    isExecuting,
    resetExecutionStatus,
    setWorkflowName,
  } = useWorkflowStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(workflowMeta.name);

  useEffect(() => {
    setTempName(workflowMeta.name);
  }, [workflowMeta.name]);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setWorkflowName(tempName.trim());
    } else {
      setTempName(workflowMeta.name);
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setTempName(workflowMeta.name);
      setIsEditingName(false);
    }
  };

  return (
    <header className="bg-zinc-900/95 border-b border-zinc-800/90 text-zinc-200 select-none backdrop-blur-md z-40">
      <div className="flex justify-between items-center h-13 px-5">

        <div className="flex items-center gap-3">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer mr-1"
              title="Return to Projects Dashboard"
            >
              <LayoutGrid className="size-3.5 text-amber-400" />
              <span>Workflows</span>
            </button>
          )}

          <div className="size-8 font-mono font-bold text-base rounded-lg flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-zinc-950 shadow-[0_0_14px_rgba(245,158,11,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] border border-amber-300/40 shrink-0">
            {workflowMeta.name[0] || 'S'}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="font-sans font-semibold text-sm text-zinc-100 bg-zinc-950 border border-amber-500/80 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-amber-500/40 tracking-tight"
                />
              ) : (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="group/title flex items-center gap-1.5 text-left font-sans font-semibold text-sm text-zinc-100 hover:text-white hover:bg-zinc-800/80 rounded px-1.5 py-0.5 -ml-1.5 transition-colors cursor-text tracking-tight truncate max-w-[320px]"
                  title="Click to rename pipeline"
                >
                  <span className="truncate">{workflowMeta.name}</span>
                  <Pencil className="size-3 text-zinc-500 opacity-0 group-hover/title:opacity-100 transition-opacity shrink-0" />
                </button>
              )}
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 px-1.5 py-0.2 rounded shrink-0">
                v{workflowMeta.version}
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
              Synapse Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <div className="flex items-center gap-1.5 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/80">
            <Button
              variant="ghost"
              onClick={() => addNode('TRIGGER')}
              className="text-xs hover:text-amber-300 hover:bg-zinc-800/60 !py-1"
            >
              <Zap className="text-amber-400 size-3.5" />
              <span>Webhook</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => addNode('CORE_CONDITION')}
              className="text-xs hover:text-sky-300 hover:bg-zinc-800/60 !py-1"
            >
              <GitBranch className="text-sky-400 size-3.5" />
              <span>Condition</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => addNode('HTTP_REQUEST')}
              className="text-xs hover:text-emerald-300 hover:bg-zinc-800/60 !py-1"
            >
              <Globe className="text-emerald-400 size-3.5" />
              <span>HTTP</span>
            </Button>
          </div>

          <div className="w-px h-6 bg-zinc-800 mx-1" />

          <Button
            variant="secondary"
            onClick={resetExecutionStatus}
            title="Reset Execution State"
            className="!py-1.5 text-zinc-400 hover:text-zinc-200"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </Button>

          <Button
            variant="primary"
            onClick={onRunWorkflow}
            disabled={isExecuting}
            className="!py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 shadow-[0_0_16px_rgba(16,185,129,0.35)] font-semibold"
          >
            {isExecuting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                <span>Run Pipeline</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
