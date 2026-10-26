import React, { useRef, useEffect } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Zap, Hash, Type, ToggleLeft, Braces, Check } from 'lucide-react';

export interface VariableItem {
  nodeId: string;
  nodeTitle: string;
  path: string;
  fullPath: string;
  type: 'number' | 'string' | 'boolean' | 'object';
  example: string | number | boolean;
}

export interface VariablePickerProps {
  currentNodeId: string;
  targetHandleId?: string;
  currentValue?: string;
  onSelect: (fullPath: string) => void;
  onClose: () => void;
}

export const VariablePicker: React.FC<VariablePickerProps> = ({
  currentNodeId,
  targetHandleId,
  currentValue,
  onSelect,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { nodes, edges } = useWorkflowStore();

  // Close on click outside or Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Find upstream connected node
  const incomingEdge = edges.find(
    (e) =>
      e.target === currentNodeId &&
      (!targetHandleId || e.targetHandle === targetHandleId || (!e.targetHandle && targetHandleId === 'input_a'))
  );

  const connectedSourceNode = incomingEdge
    ? nodes.find((n) => n.id === incomingEdge.source)
    : undefined;

  // Compile available variables from connected node or all upstream nodes
  const availableVariables: VariableItem[] = [];

  const inspectNodePayload = (node: (typeof nodes)[0]) => {
    const sourcePrefix = node.data.type === 'TRIGGER' ? 'trigger' : node.id;
    const output = node.data.output;

    if (output && typeof output === 'object') {
      // Dynamic output from execution
      Object.entries(output).forEach(([key, val]) => {
        const valType: VariableItem['type'] =
          typeof val === 'number'
            ? 'number'
            : typeof val === 'boolean'
            ? 'boolean'
            : typeof val === 'object'
            ? 'object'
            : 'string';

        availableVariables.push({
          nodeId: node.id,
          nodeTitle: node.data.title || node.id,
          path: key,
          fullPath: `${sourcePrefix}.${key}`,
          type: valType,
          example: typeof val === 'object' ? '{...}' : String(val),
        });
      });
    } else if (node.data.type === 'TRIGGER') {
      // Default schema for trigger
      availableVariables.push(
        {
          nodeId: node.id,
          nodeTitle: node.data.title || 'Webhook Trigger',
          path: 'amount',
          fullPath: 'trigger.amount',
          type: 'number',
          example: 250,
        },
        {
          nodeId: node.id,
          nodeTitle: node.data.title || 'Webhook Trigger',
          path: 'userId',
          fullPath: 'trigger.userId',
          type: 'string',
          example: '"usr_123"',
        },
        {
          nodeId: node.id,
          nodeTitle: node.data.title || 'Webhook Trigger',
          path: 'status',
          fullPath: 'trigger.status',
          type: 'string',
          example: '"success"',
        },
        {
          nodeId: node.id,
          nodeTitle: node.data.title || 'Webhook Trigger',
          path: 'currency',
          fullPath: 'trigger.currency',
          type: 'string',
          example: '"PLN"',
        }
      );
    } else if (node.data.type === 'HTTP_REQUEST') {
      availableVariables.push(
        {
          nodeId: node.id,
          nodeTitle: node.data.title || 'HTTP Request',
          path: 'status',
          fullPath: `${node.id}.status`,
          type: 'number',
          example: 200,
        },
        {
          nodeId: node.id,
          nodeTitle: node.data.title || 'HTTP Request',
          path: 'data.total',
          fullPath: `${node.id}.data.total`,
          type: 'number',
          example: 500,
        }
      );
    }
  };

  if (connectedSourceNode) {
    inspectNodePayload(connectedSourceNode);
  } else {
    // If not directly connected, show variables from any upstream node
    nodes
      .filter((n) => n.id !== currentNodeId)
      .forEach((n) => inspectNodePayload(n));
  }

  const renderTypeIcon = (type: VariableItem['type']) => {
    switch (type) {
      case 'number':
        return <Hash className="w-3 h-3 text-emerald-400" />;
      case 'boolean':
        return <ToggleLeft className="w-3 h-3 text-amber-400" />;
      case 'object':
        return <Braces className="w-3 h-3 text-purple-400" />;
      default:
        return <Type className="w-3 h-3 text-sky-400" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="nodrag nopan absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-64 bg-zinc-900/98 border border-zinc-700/80 rounded-xl shadow-[0_16px_36px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl p-2 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-1.5 pb-2 border-b border-zinc-800">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
          Select Variable
        </span>
        {connectedSourceNode ? (
          <span className="flex items-center gap-1 text-[9px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
            <Zap className="w-2.5 h-2.5" />
            {connectedSourceNode.data.title || connectedSourceNode.id}
          </span>
        ) : (
          <span className="text-[9px] font-mono text-zinc-500">Unconnected</span>
        )}
      </div>

      {/* Variables List */}
      <div className="flex flex-col gap-1 mt-1.5 max-h-52 overflow-y-auto">
        {availableVariables.length === 0 ? (
          <div className="py-4 text-center text-[11px] font-mono text-zinc-500">
            No variables found. Connect a cable first.
          </div>
        ) : (
          availableVariables.map((item) => {
            const isSelected = currentValue === item.fullPath;
            return (
              <button
                key={item.fullPath}
                type="button"
                onClick={() => {
                  onSelect(item.fullPath);
                  onClose();
                }}
                className={`
                  flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all duration-100 group
                  ${isSelected ? 'bg-indigo-600/20 border border-indigo-500/50' : 'hover:bg-zinc-800/80 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded bg-zinc-950 flex items-center justify-center shrink-0 border border-zinc-800">
                    {renderTypeIcon(item.type)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-mono font-bold text-zinc-200 truncate group-hover:text-white">
                      {item.path}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 truncate">
                      {item.fullPath}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span className="text-[10px] font-mono text-zinc-400 opacity-70">
                    {item.example}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VariablePicker;
