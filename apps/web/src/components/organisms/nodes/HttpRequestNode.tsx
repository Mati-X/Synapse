import React, { useLayoutEffect } from 'react';
import { NodeProps, Position, useUpdateNodeInternals } from '@xyflow/react';
import { SynapseNode } from '../../../types/workflow';
import { NodeCard } from '../../molecules/NodeCard';
import { NodeHeader } from '../../molecules/NodeHeader';
import { NodePort } from '../../atoms/NodePort';
import { FaviconIcon } from '../../atoms/FaviconIcon';

const methodStyles: Record<string, { bg: string; text: string; border: string }> = {
  GET: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  POST: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  PUT: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  PATCH: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  DELETE: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
};

const getDomain = (rawUrl?: string): string => {
  if (!rawUrl) return '';
  try {
    const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
    return parsed.hostname;
  } catch {
    return rawUrl;
  }
};

export const HttpRequestNode: React.FC<NodeProps<SynapseNode>> = ({ id, data, selected }) => {
  const updateNodeInternals = useUpdateNodeInternals();

  useLayoutEffect(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals]);
  const method = (data.config?.method || 'GET').toUpperCase();
  const url = data.config?.url || 'https://api.example.com';
  const domain = getDomain(url);
  const methodStyle = methodStyles[method] || methodStyles.GET;

  return (
    <NodeCard selected={selected} status={data.status}>
      <NodeHeader
        title={data.title}
        subtitle={domain || 'HTTP Webhook'}
        icon={<FaviconIcon url={url} />}
      />

      {/* Recessed Request Well */}
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-lg px-2.5 py-1.5 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.6)] flex items-center gap-2 mb-2.5">
        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${methodStyle.bg} ${methodStyle.text} ${methodStyle.border}`}>
          {method}
        </span>
        <span className="text-[11px] font-mono text-zinc-300 truncate select-all" title={url}>
          {url}
        </span>
      </div>

      {/* Sockets row: Symmetrical IN (left) and OUT (right) */}
      <div className="flex items-center justify-between pt-0.5">
        <NodePort type="target" position={Position.Left} id="input" />
        <NodePort type="source" position={Position.Right} id="output" />
      </div>
    </NodeCard>
  );
};

export default HttpRequestNode;
