import React, { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import {
  X,
  Sliders,
  Copy,
  Trash2,
  Check,
  Code2,
  AlertTriangle,
} from 'lucide-react';

export const Inspector: React.FC = () => {
  const {
    nodes,
    selectedNodeId,
    selectNode,
    updateNodeConfig,
    deleteNode,
    duplicateNode,
  } = useWorkflowStore();

  const [activeTab, setActiveTab] = useState<'config' | 'output'>('config');
  const [copied, setCopied] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside className="w-88 border-l border-zinc-800/80 bg-zinc-950/80 p-6 flex flex-col items-center justify-center text-zinc-500 font-mono text-xs text-center select-none backdrop-blur-xl">
        <Sliders className="size-8 mb-3 opacity-25 text-zinc-400 stroke-1" />
        <span className="font-semibold text-zinc-300">No Module Selected</span>
        <span className="text-[10px] text-zinc-500 mt-1.5 max-w-[180px] leading-relaxed">
          Select a node on the canvas to configure its parameters or inspect runtime output
        </span>
      </aside>
    );
  }

  const { data } = selectedNode;
  const config = data.config || {};
  const output = data.output;
  const error = data.error;

  const handleCopyOutput = () => {
    if (output) {
      navigator.clipboard.writeText(JSON.stringify(output, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 800);
    }
  };

  return (
    <aside className="w-88 border-l border-zinc-800/80 bg-zinc-950/90 flex flex-col backdrop-blur-xl select-none z-30">

      <div className="p-4 border-b border-zinc-800/80">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[9px] font-mono font-bold bg-zinc-800/90 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-700/60 uppercase shrink-0">
              {data.type}
            </span>
            <span className="font-sans font-semibold text-sm text-zinc-100 truncate">
              {data.title}
            </span>
          </div>
          <button
            onClick={() => selectNode(null)}
            className="text-zinc-400 hover:text-white p-1 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            title="Close inspector"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium mt-3">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer ${
              activeTab === 'config'
                ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Parameters
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`flex-1 py-1 rounded-md text-center transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'output'
                ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Telemetry</span>
            {data.status && data.status !== 'IDLE' && (
              <span
                className={`size-1.5 rounded-full ${
                  data.status === 'COMPLETED'
                    ? 'bg-emerald-400'
                    : data.status === 'RUNNING'
                    ? 'bg-sky-400 animate-pulse'
                    : data.status === 'FAILED'
                    ? 'bg-rose-400'
                    : 'bg-zinc-500'
                }`}
              />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans">
        {activeTab === 'config' ? (
          <>

            {data.type === 'TRIGGER' && (
              <div className="space-y-3">
                <FormField label="Webhook Trigger Mode">
                  <Select
                    value={config.mode || 'POST'}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { mode: e.target.value })}
                    options={[
                      { label: 'POST Webhook (JSON)', value: 'POST' },
                      { label: 'GET Query Parameters', value: 'GET' },
                    ]}
                  />
                </FormField>
                <FormField label="Mock Ingress Payload" helperText="Test payload emitted on trigger execution">
                  <Input
                    value={config.mockPayload || '{"amount": 250, "status": "success"}'}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { mockPayload: e.target.value })}
                  />
                </FormField>
              </div>
            )}

            {data.type === 'CORE_CONDITION' && (
              <div className="space-y-3">
                <FormField label="Field Path" helperText="Target JSON path (e.g. trigger.amount)">
                  <Input
                    value={config.field || ''}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { field: e.target.value })}
                  />
                </FormField>
                <FormField label="Operator">
                  <Select
                    value={config.operator || 'equals'}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { operator: e.target.value })}
                    options={[
                      { label: 'equals (===)', value: 'equals' },
                      { label: 'not_equals (≠)', value: 'not_equals' },
                      { label: 'contains (∋)', value: 'contains' },
                      { label: 'greater than (>)', value: 'gt' },
                      { label: 'greater or equal (≥)', value: 'gte' },
                      { label: 'less than (<)', value: 'lt' },
                      { label: 'less or equal (≤)', value: 'lte' },
                    ]}
                  />
                </FormField>
                <FormField label="Target Value" helperText="Literal number, string or path">
                  <Input
                    value={config.targetValue ?? ''}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { targetValue: e.target.value })}
                  />
                </FormField>
              </div>
            )}

            {data.type === 'HTTP_REQUEST' && (
              <div className="space-y-3">
                <FormField label="HTTP Method">
                  <Select
                    value={config.method || 'GET'}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { method: e.target.value })}
                    options={[
                      { label: 'GET', value: 'GET' },
                      { label: 'POST', value: 'POST' },
                      { label: 'PUT', value: 'PUT' },
                      { label: 'PATCH', value: 'PATCH' },
                      { label: 'DELETE', value: 'DELETE' },
                    ]}
                  />
                </FormField>
                <FormField label="Target URL">
                  <Input
                    value={config.url || ''}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { url: e.target.value })}
                  />
                </FormField>
                <FormField label="Request Body" helperText="Supports interpolation like {{ trigger.amount }}">
                  <Input
                    value={config.body || ''}
                    onChange={(e) => updateNodeConfig(selectedNode.id, { body: e.target.value })}
                  />
                </FormField>
              </div>
            )}
          </>
        ) : (

          <div className="space-y-3 font-mono">
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Execution Status</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                    data.status === 'COMPLETED'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : data.status === 'RUNNING'
                      ? 'bg-sky-500/15 text-sky-300 border-sky-500/30 animate-pulse'
                      : data.status === 'FAILED'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {data.status || 'IDLE'}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Code2 className="size-3.5" />
                  <span>Output Payload</span>
                </span>
                {output && (
                  <button
                    onClick={handleCopyOutput}
                    className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <pre className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 text-xs text-zinc-300 overflow-x-auto max-h-60 leading-relaxed font-mono shadow-inner">
                {output
                  ? JSON.stringify(output, null, 2)
                  : '// No execution output yet.\n// Run pipeline to capture telemetry.'}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between gap-2">
        <button
          onClick={() => duplicateNode(selectedNode.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 transition-colors cursor-pointer"
        >
          <Copy className="size-3.5 text-zinc-400" />
          <span>Duplicate</span>
        </button>
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 transition-colors cursor-pointer"
          title="Delete selected module"
        >
          <Trash2 className="size-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </aside>
  );
};
