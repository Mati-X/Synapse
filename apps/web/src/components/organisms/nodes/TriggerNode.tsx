import React, { useLayoutEffect } from 'react';
import { NodeProps, Position, useUpdateNodeInternals } from '@xyflow/react';
import { SynapseNode } from '../../../types/workflow';
import { NodeCard } from '../../molecules/NodeCard';
import { NodeHeader } from '../../molecules/NodeHeader';
import { NodePort } from '../../atoms/NodePort';
import { Zap } from 'lucide-react';

export const TriggerNode: React.FC<NodeProps<SynapseNode>> = ({ id, data, selected }) => {
  const updateNodeInternals = useUpdateNodeInternals();

  useLayoutEffect(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals]);

  return (
    <NodeCard selected={selected} status={data.status}>
      <NodeHeader
        title={data.title}
        subtitle="Webhook Trigger"
        icon={<Zap className="text-amber-400" />}
      />

      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 py-1 px-1">
        <span className="opacity-70">Source</span>
        <span className="text-zinc-300 font-semibold">Incoming Payload</span>
      </div>

      <div className="flex justify-end pt-1">
        <NodePort type="source" position={Position.Right} id="output" />
      </div>
    </NodeCard>
  );
};
