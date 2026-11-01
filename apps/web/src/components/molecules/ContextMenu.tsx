import React, { useEffect, useRef } from 'react';
import {
  Zap,
  GitBranch,
  Globe,
  Copy,
  Trash2,
  Fingerprint,
  Check,
} from 'lucide-react';

export interface ContextMenuProps {
  x: number;
  y: number;
  type: 'pane' | 'node';
  nodeId?: string;
  nodeTitle?: string;
  onAddNode: (type: 'TRIGGER' | 'CORE_CONDITION' | 'HTTP_REQUEST') => void;
  onDuplicateNode?: (nodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  type,
  nodeId,
  nodeTitle,
  onAddNode,
  onDuplicateNode,
  onDeleteNode,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const menuWidth = 220;
  const menuHeight = type === 'node' ? 180 : 190;
  const clampedX = Math.min(Math.max(12, x), window.innerWidth - menuWidth - 16);
  const clampedY = Math.min(Math.max(12, y), window.innerHeight - menuHeight - 16);

  const handleCopyId = () => {
    if (nodeId) {
      navigator.clipboard.writeText(nodeId);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 600);
    }
  };

  return (
    <div
      ref={menuRef}
      style={{ left: clampedX, top: clampedY }}
      className="fixed z-50 w-56 select-none rounded-xl border border-zinc-700/80 bg-zinc-900/98 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 font-sans"
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {type === 'pane' ? (
        <>
          <div className="px-2.5 py-1.5 pb-2 text-[10px] font-mono tracking-wider uppercase text-zinc-400 border-b border-zinc-800 flex items-center justify-between">
            <span>Spawn Module</span>
            <span className="text-zinc-400 font-mono text-[9px] bg-zinc-800/80 px-1.5 py-0.5 rounded">Patchbay</span>
          </div>

          <div className="pt-1.5 space-y-0.5">
            <button
              onClick={() => {
                onAddNode('TRIGGER');
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-zinc-200 hover:text-white hover:bg-zinc-800/90 rounded-lg transition-colors group text-left cursor-pointer"
            >
              <div className="size-5 rounded flex items-center justify-center bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25 transition-colors border border-amber-500/30">
                <Zap className="size-3" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-zinc-200 group-hover:text-amber-300">Webhook Trigger</span>
                <span className="text-[10px] text-zinc-400 font-mono">Incoming payload</span>
              </div>
            </button>

            <button
              onClick={() => {
                onAddNode('CORE_CONDITION');
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-zinc-200 hover:text-white hover:bg-zinc-800/90 rounded-lg transition-colors group text-left cursor-pointer"
            >
              <div className="size-5 rounded flex items-center justify-center bg-sky-500/15 text-sky-400 group-hover:bg-sky-500/25 transition-colors border border-sky-500/30">
                <GitBranch className="size-3" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-zinc-200 group-hover:text-sky-300">Logic Comparator</span>
                <span className="text-[10px] text-zinc-400 font-mono">If / Else routing</span>
              </div>
            </button>

            <button
              onClick={() => {
                onAddNode('HTTP_REQUEST');
                onClose();
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-zinc-200 hover:text-white hover:bg-zinc-800/90 rounded-lg transition-colors group text-left cursor-pointer"
            >
              <div className="size-5 rounded flex items-center justify-center bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-500/25 transition-colors border border-emerald-500/30">
                <Globe className="size-3" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-zinc-200 group-hover:text-emerald-300">HTTP Request</span>
                <span className="text-[10px] text-zinc-400 font-mono">REST API call</span>
              </div>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="px-2.5 py-1.5 pb-2 text-[10px] font-mono tracking-wider uppercase text-zinc-400 border-b border-zinc-800 flex items-center justify-between">
            <span className="truncate max-w-[120px]">{nodeTitle || 'Node Actions'}</span>
            <span className="text-zinc-400 font-mono text-[9px] bg-zinc-800/80 px-1.5 py-0.5 rounded truncate max-w-[60px]">
              {nodeId}
            </span>
          </div>

          <div className="pt-1.5 space-y-0.5">
            <button
              onClick={() => {
                if (nodeId && onDuplicateNode) onDuplicateNode(nodeId);
                onClose();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-200 hover:text-white hover:bg-zinc-800/90 rounded-lg transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Copy className="size-3.5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                <span className="font-medium">Duplicate</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Ctrl+D</span>
            </button>

            <button
              onClick={handleCopyId}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-zinc-200 hover:text-white hover:bg-zinc-800/90 rounded-lg transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {copied ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : (
                  <Fingerprint className="size-3.5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                )}
                <span className="font-medium">{copied ? 'Copied ID!' : 'Copy ID'}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">#id</span>
            </button>

            <div className="h-px bg-zinc-800 my-1" />

            <button
              onClick={() => {
                if (nodeId && onDeleteNode) onDeleteNode(nodeId);
                onClose();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded-lg transition-colors group text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="size-3.5 text-rose-400 group-hover:text-rose-300 transition-colors" />
                <span className="font-medium">Delete Node</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400/60">Del</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
