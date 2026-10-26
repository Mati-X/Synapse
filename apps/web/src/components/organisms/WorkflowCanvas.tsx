import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import { useWorkflowStore } from '../../store/workflowStore';
import { TriggerNode } from './nodes/TriggerNode';
import { ConditionNode } from './nodes/ConditionNode';
import HttpRequestNode from './nodes/HttpRequestNode';
import { CycleAlert } from '../molecules/CycleAlert';
import { CableConnectionLine } from '../molecules/CableConnectionLine';
import { CableEdge } from '../molecules/CableEdge';

export const WorkflowCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    validationError,
    clearValidationError,
    setConnectingHandle,
  } = useWorkflowStore();

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      triggerNode: TriggerNode,
      conditionNode: ConditionNode,
      httpNode: HttpRequestNode,
    }),
    []
  );

  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      cable: CableEdge,
    }),
    []
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <CycleAlert message={validationError} onDismiss={clearValidationError} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        connectionLineComponent={CableConnectionLine}
        onConnectStart={(_, params) => {
          if (params.nodeId) {
            setConnectingHandle({
              nodeId: params.nodeId,
              handleId: params.handleId,
              handleType: params.handleType ?? undefined,
            });
          }
        }}
        onConnectEnd={() => {
          setConnectingHandle(null);
        }}
        defaultEdgeOptions={{
          type: 'cable',
        }}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
