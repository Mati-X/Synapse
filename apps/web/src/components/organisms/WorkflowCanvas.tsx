import React, { useMemo, useState, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  type Node,
} from '@xyflow/react';
import { useWorkflowStore } from '../../store/workflowStore';
import { TriggerNode } from './nodes/TriggerNode';
import { ConditionNode } from './nodes/ConditionNode';
import HttpRequestNode from './nodes/HttpRequestNode';
import { CycleAlert } from '../molecules/CycleAlert';
import { CableConnectionLine } from '../molecules/CableConnectionLine';
import { CableEdge } from '../molecules/CableEdge';
import { ContextMenu } from '../molecules/ContextMenu';
import { AmbientBackground } from '../atoms/AmbientBackground';

interface MenuState {
  isOpen: boolean;
  x: number;
  y: number;
  type: 'pane' | 'node';
  nodeId?: string;
  nodeTitle?: string;
  flowPosition?: { x: number; y: number };
}

const WorkflowCanvasInner: React.FC = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
    duplicateNode,
    selectNode,
    validationError,
    clearValidationError,
    setConnectingHandle,
  } = useWorkflowStore();

  const { screenToFlowPosition } = useReactFlow();
  const [menu, setMenu] = useState<MenuState | null>(null);

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

  const closeMenu = useCallback(() => {
    setMenu(null);
  }, []);

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent | MouseEvent) => {
      event.preventDefault();
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      setMenu({
        isOpen: true,
        x: event.clientX,
        y: event.clientY,
        type: 'pane',
        flowPosition,
      });
    },
    [screenToFlowPosition]
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent | MouseEvent, node: Node) => {
      event.preventDefault();
      setMenu({
        isOpen: true,
        x: event.clientX,
        y: event.clientY,
        type: 'node',
        nodeId: node.id,
        nodeTitle: (node.data as any)?.title,
      });
    },
    []
  );

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#070709]">

      <AmbientBackground />

      <CycleAlert message={validationError} onDismiss={clearValidationError} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, node) => {
          selectNode(node.id);
          closeMenu();
        }}
        onPaneClick={() => {
          selectNode(null);
          closeMenu();
        }}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onMoveStart={closeMenu}
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
        <Background color="#27272a" gap={20} size={1} />
        <Controls
          className="!bg-zinc-900/90 !border !border-zinc-700/80 !rounded-xl !overflow-hidden !shadow-2xl !backdrop-blur-xl [&>button]:!bg-transparent [&>button]:!border-b [&>button]:!border-zinc-800/80 [&>button]:!fill-zinc-400 hover:[&>button]:!bg-zinc-800 hover:[&>button]:!fill-white transition-colors"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={(n) => {
            if (n.data?.type === 'TRIGGER') return '#f59e0b';
            if (n.data?.type === 'CORE_CONDITION') return '#38bdf8';
            return '#10b981';
          }}
          maskColor="rgba(7, 7, 9, 0.82)"
          className="!bg-zinc-950/90 !border !border-zinc-800/90 !rounded-xl !overflow-hidden !shadow-2xl !backdrop-blur-xl"
        />
      </ReactFlow>

      {menu && menu.isOpen && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          type={menu.type}
          nodeId={menu.nodeId}
          nodeTitle={menu.nodeTitle}
          onAddNode={(type) => {
            addNode(type, menu.flowPosition);
          }}
          onDuplicateNode={duplicateNode}
          onDeleteNode={deleteNode}
          onClose={closeMenu}
        />
      )}
    </div>
  );
};

export const WorkflowCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner />
    </ReactFlowProvider>
  );
};
