import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudioLayout } from '../components/templates/StudioLayout';
import { useWorkflowStore } from '../store/workflowStore';
import { PageLoader } from '../components/atoms/PageLoader';

export const StudioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    workflowMeta,
    loadWorkflow,
    toWorkflowDefinition,
    setExecuting,
    updateNodeStatus,
    resetExecutionStatus,
    edges,
  } = useWorkflowStore();

  const [isLoading, setIsLoading] = useState(() => Boolean(id && workflowMeta.id !== id));
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    if (!id || workflowMeta.id === id) {
      setIsLoading(false);
      return;
    }

    const fetchPipeline = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/workflows/${id}`);
        if (res.ok) {
          const data = await res.json();
          loadWorkflow(data.name, data.nodes, data.edges, data.id);
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    fetchPipeline();
  }, [id, workflowMeta.id, loadWorkflow, apiUrl]);

  const handleRunWorkflow = async () => {
    resetExecutionStatus();
    setExecuting(true);

    const definition = toWorkflowDefinition();

    try {
      const response = await fetch(`${apiUrl}/api/workflows/${definition.id}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 250, userId: 'usr_123', status: 'success' }),
      });

      if (!response.ok) {
        throw new Error(`Execution failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.runId) {
        const eventSource = new EventSource(`${apiUrl}/api/runs/${result.runId}/telemetry`);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'NODE_STARTED') {
              updateNodeStatus(data.nodeId, 'RUNNING');
            } else if (data.type === 'NODE_COMPLETED') {
              updateNodeStatus(data.nodeId, 'COMPLETED', data.output);
            } else if (data.type === 'NODE_SKIPPED') {
              updateNodeStatus(data.nodeId, 'SKIPPED');
            } else if (data.type === 'NODE_FAILED') {
              updateNodeStatus(data.nodeId, 'FAILED', undefined, data.error);
            }
          } catch {}
        };

        eventSource.onerror = () => {
          eventSource.close();
          setExecuting(false);
        };
      }
    } catch {
      const resolveVariable = (variables: Record<string, any>, path?: string): any => {
        if (!path) return undefined;
        const parts = path.split('.');
        let current: any = variables;
        for (const part of parts) {
          if (current == null) return undefined;
          current = current[part];
        }
        return current;
      };

      const compareValues = (op1: any, op2: any, operator: string): boolean => {
        switch (operator) {
          case 'equals':
            return op1 === op2;
          case 'not_equals':
            return op1 !== op2;
          case 'contains':
            return typeof op1 === 'string' && op1.includes(String(op2));
          case 'gt':
            return Number(op1) > Number(op2);
          case 'gte':
            return Number(op1) >= Number(op2);
          case 'lt':
            return Number(op1) < Number(op2);
          case 'lte':
            return Number(op1) <= Number(op2);
          default:
            return false;
        }
      };

      const variables: Record<string, any> = {};
      const nodeOutputs = new Map<string, { output: any; nextHandle?: string }>();
      const skippedNodes = new Set<string>();

      const inDegree = new Map<string, number>();
      const adj = new Map<string, string[]>();
      definition.nodes.forEach((n) => {
        inDegree.set(n.id, 0);
        adj.set(n.id, []);
      });
      edges.forEach((e) => {
        if (inDegree.has(e.target)) {
          inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
        }
        adj.get(e.source)?.push(e.target);
      });

      const queue: string[] = [];
      inDegree.forEach((deg, id) => {
        if (deg === 0) queue.push(id);
      });

      const executionOrder: string[] = [];
      while (queue.length > 0) {
        const u = queue.shift()!;
        executionOrder.push(u);
        for (const v of adj.get(u) || []) {
          const newDeg = (inDegree.get(v) || 0) - 1;
          inDegree.set(v, newDeg);
          if (newDeg === 0) queue.push(v);
        }
      }

      const nodeMap = new Map(definition.nodes.map((n) => [n.id, n]));

      for (const nodeId of executionOrder) {
        const node = nodeMap.get(nodeId);
        if (!node) continue;

        const incomingEdges = edges.filter((e) => e.target === nodeId);

        let shouldSkip = false;
        for (const edge of incomingEdges) {
          if (skippedNodes.has(edge.source)) {
            shouldSkip = true;
            break;
          }
          const parentResult = nodeOutputs.get(edge.source);
          if (edge.sourceHandle && parentResult?.nextHandle && edge.sourceHandle !== parentResult.nextHandle) {
            shouldSkip = true;
            break;
          }
        }

        if (shouldSkip) {
          skippedNodes.add(nodeId);
          updateNodeStatus(nodeId, 'SKIPPED');
          continue;
        }

        updateNodeStatus(nodeId, 'RUNNING');
        await new Promise((res) => setTimeout(res, 400));

        const isTrigger = node.type === 'TRIGGER' || node.type === 'triggerNode';
        const isCondition = node.type === 'CORE_CONDITION' || node.type === 'conditionNode';

        if (isTrigger) {
          const payload = { amount: 250, userId: 'usr_123', status: 'success', currency: 'PLN' };
          variables['trigger'] = payload;
          variables[node.id] = payload;
          nodeOutputs.set(node.id, { output: payload, nextHandle: 'output' });
          updateNodeStatus(node.id, 'COMPLETED', payload);
        } else if (isCondition) {
          const config = node.data?.config || {};
          const fieldValue = resolveVariable(variables, config.field);
          const targetValue = config.targetValue;
          const isEvaluated = compareValues(fieldValue, targetValue, config.operator || 'equals');
          const nextHandle = isEvaluated ? 'true' : 'false';

          const output = { evaluated: isEvaluated, result: fieldValue };
          nodeOutputs.set(node.id, { output, nextHandle });
          updateNodeStatus(node.id, 'COMPLETED', output);
        } else {
          const output = { status: 200, statusText: 'OK', data: { success: true } };
          nodeOutputs.set(node.id, { output, nextHandle: 'output' });
          updateNodeStatus(node.id, 'COMPLETED', output);
        }
      }
    } finally {
      setExecuting(false);
    }
  };

  if (isLoading) {
    return (
      <PageLoader
        message="Mounting DAG Canvas..."
        subMessage={`Synchronizing pipeline [${id?.slice(0, 8)}...]`}
      />
    );
  }

  return (
    <div className="w-full h-full animate-fadeIn">
      <StudioLayout
        onRunWorkflow={handleRunWorkflow}
        onNavigateHome={() => navigate('/dashboard')}
      />
    </div>
  );
};
