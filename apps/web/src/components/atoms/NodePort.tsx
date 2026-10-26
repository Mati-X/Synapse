import React, { useLayoutEffect } from 'react';
import { Handle, Position, useNodeId, useUpdateNodeInternals } from '@xyflow/react';
import { useWorkflowStore } from '../../store/workflowStore';

export type PortVariant = 'default' | 'true' | 'false';

export interface NodePortProps {
  type: 'source' | 'target';
  position: Position;
  id?: string;
  label?: string;
  variant?: PortVariant;
  className?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<PortVariant, { plug: string; pin: string; text: string; glow: string; socketBorder: string }> = {
  default: {
    plug: 'bg-gradient-to-r from-zinc-800 to-zinc-900 border-zinc-600/80',
    pin: 'bg-sky-400 border-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.7)]',
    text: 'text-zinc-100',
    glow: 'shadow-[0_0_8px_rgba(56,189,248,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]',
    socketBorder: 'border-zinc-800 text-zinc-500',
  },
  true: {
    plug: 'bg-gradient-to-r from-emerald-900 to-emerald-950 border-emerald-500/80',
    pin: 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.7)]',
    text: 'text-emerald-100',
    glow: 'shadow-[0_0_10px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]',
    socketBorder: 'border-emerald-950 text-emerald-600/70',
  },
  false: {
    plug: 'bg-gradient-to-r from-rose-900 to-rose-950 border-rose-500/80',
    pin: 'bg-rose-400 border-rose-300 shadow-[0_0_6px_rgba(244,63,94,0.7)]',
    text: 'text-rose-100',
    glow: 'shadow-[0_0_10px_rgba(244,63,94,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]',
    socketBorder: 'border-rose-950 text-rose-600/70',
  },
};

export const NodePort: React.FC<NodePortProps> = ({
  type,
  position,
  id,
  label,
  variant,
  className = '',
  style,
}) => {
  const nodeId = useNodeId();
  const updateNodeInternals = useUpdateNodeInternals();
  const edges = useWorkflowStore((state) => state.edges);
  const connectingHandle = useWorkflowStore((state) => state.connectingHandle);

  useLayoutEffect(() => {
    if (nodeId) {
      updateNodeInternals(nodeId);
    }
  }, [nodeId, updateNodeInternals, id, position]);

  const isOutput = position === Position.Right;
  const resolvedVariant: PortVariant = variant || (id === 'true' ? 'true' : id === 'false' ? 'false' : 'default');

  const connectedEdgesCount = isOutput
    ? edges.filter((e) => e.source === nodeId && (!id || e.sourceHandle === id || (!e.sourceHandle && (id === 'output' || id === 'true' || id === 'false')))).length
    : 0;

  const incomingEdge = !isOutput
    ? edges.find((e) => e.target === nodeId && (!id || e.targetHandle === id || (!e.targetHandle && (id === 'input' || id === 'input_a'))))
    : undefined;

  const isConnected = isOutput ? connectedEdgesCount > 0 : Boolean(incomingEdge);

  const isBeingDragged =
    isOutput &&
    connectingHandle?.nodeId === nodeId &&
    (!id || connectingHandle?.handleId === id || (!connectingHandle?.handleId && id === 'output'));

  const incomingVariant: PortVariant =
    incomingEdge?.sourceHandle === 'true'
      ? 'true'
      : incomingEdge?.sourceHandle === 'false'
      ? 'false'
      : 'default';

  const activeVariant = !isOutput ? incomingVariant : resolvedVariant;
  const styles = variantStyles[activeVariant];

  const displayLabel = !isOutput && incomingEdge
    ? incomingEdge.sourceHandle?.toUpperCase() || 'IN'
    : label || (id === 'true' ? 'TRUE' : id === 'false' ? 'FALSE' : isOutput ? 'OUT' : 'IN');

  return (
    <div
      className={`
        nodrag nopan group relative flex items-center select-none py-1
        ${isOutput ? 'justify-end -mr-3.5' : 'justify-start -ml-3.5'}
        ${className}
      `}
    >
      <div
        className={`
          nodrag relative flex items-center h-[26px] w-[60px] overflow-hidden
          bg-zinc-950/95 border-y
          shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)]
          transition-colors duration-150
          ${isOutput 
            ? `rounded-l-lg rounded-r-none border-l border-r-0 pl-2 pr-0.5 justify-end ${styles.socketBorder}` 
            : `rounded-r-lg rounded-l-none border-r border-l-0 pr-2 pl-0.5 justify-start ${styles.socketBorder}`
          }
        `}
      >
        <div className="flex items-center gap-1 opacity-40 px-1 pointer-events-none">
          <span className="text-[8px] font-mono font-bold tracking-wider uppercase">
            {displayLabel}
          </span>
          {isOutput && connectedEdgesCount > 0 && (
            <span className="text-[7px] font-mono bg-zinc-800 text-zinc-300 rounded px-1">
              {connectedEdgesCount}
            </span>
          )}
        </div>

        {((isOutput && !isConnected && !isBeingDragged) || (!isOutput && isConnected)) && (
          <div
            className={`
              absolute top-[2px] ${isOutput ? 'right-[2px]' : 'left-[2px]'}
              w-[52px] h-[20px] flex items-center justify-between px-2 rounded-[5px] border
              pointer-events-none transition-all duration-150
              ${styles.plug} ${styles.glow}
            `}
          >
            <span className={`text-[8px] font-mono font-bold tracking-wider uppercase truncate ${styles.text}`}>
              {displayLabel}
            </span>
            <div className={`w-1.5 h-3 rounded-xs border shrink-0 ${styles.pin}`} />
          </div>
        )}

        {isOutput && isConnected && !isBeingDragged && (
          <div
            className={`
              absolute top-[2px] right-[2px]
              w-[52px] h-[20px] flex items-center justify-between px-2 rounded-[5px] border
              pointer-events-none transition-all duration-200
              opacity-0 translate-x-1 scale-95
              group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100
              ${styles.plug} ${styles.glow}
            `}
          >
            <span className={`text-[8px] font-mono font-bold tracking-wider uppercase truncate ${styles.text}`}>
              +{displayLabel}
            </span>
            <div className={`w-1.5 h-3 rounded-xs border shrink-0 ${styles.pin}`} />
          </div>
        )}

        <Handle
          type={type}
          position={position}
          id={id}
          style={style}
          className="nodrag !absolute !inset-0 !w-full !h-full !transform-none !rounded-none !border-0 !opacity-0 !cursor-crosshair !z-30"
        />
      </div>
    </div>
  );
};
