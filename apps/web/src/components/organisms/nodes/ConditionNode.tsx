import React, { useLayoutEffect, useState } from 'react';
import { NodeProps, Position, useUpdateNodeInternals } from '@xyflow/react';
import { SynapseNode } from '../../../types/workflow';
import { NodeCard } from '../../molecules/NodeCard';
import { NodeHeader } from '../../molecules/NodeHeader';
import { NodePort } from '../../atoms/NodePort';
import { VariablePicker } from '../../molecules/VariablePicker';
import { useWorkflowStore } from '../../../store/workflowStore';
import { GitFork, Zap } from 'lucide-react';

export const ConditionNode: React.FC<NodeProps<SynapseNode>> = ({ id, data, selected }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const updateNodeConfig = useWorkflowStore((state) => state.updateNodeConfig);
  const [activePicker, setActivePicker] = useState<'A' | 'B' | null>(null);

  useLayoutEffect(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals]);

  const operatorSymbols: Record<string, string> = {
    equals: '===',
    not_equals: '≠',
    gt: '>',
    gte: '≥',
    lt: '<',
    lte: '≤',
    contains: '∋',
  };

  const nextOperator: Record<string, string> = {
    equals: 'gt',
    gt: 'lt',
    lt: 'not_equals',
    not_equals: 'contains',
    contains: 'equals',
  };

  const operator = data.config?.operator || 'equals';
  const symbol = operatorSymbols[operator] || '===';
  const field = data.config?.field || 'field';
  const targetValue = data.config?.targetValue;

  const handleCycleOperator = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = nextOperator[operator] || 'equals';
    updateNodeConfig(id, { operator: next });
  };

  const renderOperand = (value: unknown) => {
    if (typeof value === 'string') {
      if (value.includes('.')) {
        const [source, ...rest] = value.split('.');
        const prop = rest.join('.');
        return (
          <div className="flex items-center gap-1 min-w-0">
            <span className="flex items-center gap-0.5 text-[8px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded shrink-0 shadow-sm">
              <Zap className="w-2 h-2" />
              {source}
            </span>
            <span className="text-[11px] font-mono font-semibold text-zinc-100 truncate" title={prop}>
              .{prop}
            </span>
          </div>
        );
      }
      return (
        <span className="text-[11px] font-mono text-zinc-200 font-medium truncate" title={value}>
          "{value}"
        </span>
      );
    }

    if (typeof value === 'number') {
      return (
        <span className="text-[11px] font-mono text-zinc-100 font-bold">
          {value}
        </span>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <span className="text-[11px] font-mono text-zinc-300 font-bold">
          {value ? 'true' : 'false'}
        </span>
      );
    }

    return (
      <span className="text-[11px] font-mono text-zinc-400 italic">
        {String(value ?? 'null')}
      </span>
    );
  };

  return (
    <div className="relative">
      <NodeCard selected={selected} status={data.status} className="w-[280px]">
        <NodeHeader
          title={data.title}
          subtitle="Logic Comparator"
          icon={<GitFork />}
        />

        {/* Symmetrical Dual-Story Comparator Deck */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          {/* Story A: IN A ── [ Operand A ] ── TRUE */}
          <div className="flex items-center justify-between">
            <NodePort type="target" position={Position.Left} id="input_a" label="IN A" />
            
            {/* Clickable Operand Well A */}
            <div
              onClick={() => setActivePicker(activePicker === 'A' ? null : 'A')}
              title="Click to select upstream variable"
              className={`
                flex-1 mx-1.5 bg-zinc-950/80 hover:bg-zinc-900 border rounded-md px-2 py-1
                shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.6)] flex items-center justify-center min-w-0 cursor-pointer transition-colors
                ${activePicker === 'A' ? 'border-amber-400/80 ring-1 ring-amber-400/40' : 'border-zinc-800/90 hover:border-zinc-600'}
              `}
            >
              {renderOperand(field)}
            </div>

            <NodePort type="source" position={Position.Right} id="true" label="TRUE" />
          </div>

          {/* Center Operator Keycap (Click to toggle operator) */}
          <div className="relative flex items-center justify-center -my-1 z-10">
            <button
              type="button"
              onClick={handleCycleOperator}
              title={`Operator: ${operator}. Click to cycle.`}
              className="nodrag nopan bg-gradient-to-b from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 active:scale-95 border border-zinc-600/80 hover:border-zinc-500 rounded px-2 py-0.5 shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center cursor-pointer transition-all"
            >
              <span className="text-[10px] font-mono font-bold text-zinc-100 tracking-tight">
                {symbol}
              </span>
            </button>
          </div>

          {/* Story B: IN B ── [ Operand B ] ── FALSE */}
          <div className="flex items-center justify-between">
            <NodePort type="target" position={Position.Left} id="input_b" label="IN B" />
            
            {/* Clickable Operand Well B */}
            <div
              onClick={() => setActivePicker(activePicker === 'B' ? null : 'B')}
              title="Click to select variable or target value"
              className={`
                flex-1 mx-1.5 bg-zinc-950/80 hover:bg-zinc-900 border rounded-md px-2 py-1
                shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.6)] flex items-center justify-center min-w-0 cursor-pointer transition-colors
                ${activePicker === 'B' ? 'border-amber-400/80 ring-1 ring-amber-400/40' : 'border-zinc-800/90 hover:border-zinc-600'}
              `}
            >
              {renderOperand(targetValue)}
            </div>

            <NodePort type="source" position={Position.Right} id="false" label="FALSE" />
          </div>
        </div>
      </NodeCard>

      {/* Floating Variable Picker Popover */}
      {activePicker && (
        <VariablePicker
          currentNodeId={id}
          targetHandleId={activePicker === 'A' ? 'input_a' : 'input_b'}
          currentValue={activePicker === 'A' ? field : String(targetValue)}
          onSelect={(selectedPath) => {
            if (activePicker === 'A') {
              updateNodeConfig(id, { field: selectedPath });
            } else {
              updateNodeConfig(id, { targetValue: selectedPath });
            }
            setActivePicker(null);
          }}
          onClose={() => setActivePicker(null)}
        />
      )}
    </div>
  );
};

export default ConditionNode;
