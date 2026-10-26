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
    plug: 'bg-gradient-to-r from-zinc-700 to-zinc-800 border-zinc-600',
    pin: 'bg-zinc-300 border-zinc-400',
    text: 'text-zinc-200',
    glow: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]',
    socketBorder: 'border-zinc-800 text-zinc-600',
  },
  true: {
    plug: 'bg-gradient-to-r from-emerald-700 to-emerald-900 border-emerald-500',
    pin: 'bg-emerald-300 border-emerald-400',
    text: 'text-emerald-200',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]',
    socketBorder: 'border-emerald-900/60 text-emerald-600/70',
  },
  false: {
    plug: 'bg-gradient-to-r from-rose-700 to-rose-900 border-rose-500',
    pin: 'bg-rose-300 border-rose-400',
    text: 'text-rose-200',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]',
    socketBorder: 'border-rose-900/60 text-rose-600/70',
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
          nodrag relative flex items-center h-6 min-w-[56px] overflow-visible
          bg-zinc-950/95 border-y
          shadow-[inset_2px_1.5px_4px_rgba(0,0,0,0.85)]
          transition-all duration-200
          ${isOutput 
            ? `rounded-l-md rounded-r-none border-l border-r-0 pl-2 pr-1 justify-end ${styles.socketBorder}` 
            : `rounded-r-md rounded-l-none border-r border-l-0 pr-2 pl-1 justify-start ${styles.socketBorder}`
          }
        `}
      >
        <div className="flex items-center gap-1 opacity-50 px-1 pointer-events-none">
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
              absolute inset-y-0.5 ${isOutput ? 'right-0.5' : 'left-0.5'}
              flex items-center gap-1.5 px-2 rounded-sm border
              transition-transform duration-150 ease-out pointer-events-none
              ${styles.plug} ${styles.glow}
            `}
          >
            <span className={`text-[8px] font-mono font-bold tracking-wider uppercase ${styles.text}`}>
              {displayLabel}
            </span>
            <div className={`w-1 h-2 rounded-xs border ${styles.pin}`} />
          </div>
        )}

        {isOutput && isConnected && !isBeingDragged && (
          <div
            className={`
              absolute inset-y-0.5 right-0.5 flex items-center gap-1.5 px-2 rounded-sm border
              transition-all duration-200 ease-out pointer-events-none
              opacity-0 translate-x-1 scale-95
              group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100
              ${styles.plug} ${styles.glow}
            `}
          >
            <span className={`text-[8px] font-mono font-bold tracking-wider uppercase ${styles.text}`}>
              +{displayLabel}
            </span>
            <div className={`w-1 h-2 rounded-xs border ${styles.pin}`} />
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
