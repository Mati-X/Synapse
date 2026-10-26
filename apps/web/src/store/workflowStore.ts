import { create } from 'zustand';
import {
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';
import { WorkflowDefinition, WorkflowNode, WorkflowEdge } from '@synapse/core';
import { SynapseNode, SynapseEdge, NodeExecutionStatus, WorkflowMetadata } from '../types/workflow';
import { wouldCauseCycle } from '../utils/cycleDetection';

interface WorkflowStoreState {
  nodes: SynapseNode[];
  edges: SynapseEdge[];
  workflowMeta: WorkflowMetadata;
  selectedNodeId: string | null;
  validationError: string | null;
  isExecuting: boolean;
  connectingHandle: { nodeId: string; handleId?: string | null; handleType?: string } | null;

  onNodesChange: OnNodesChange<SynapseNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setConnectingHandle: (handle: { nodeId: string; handleId?: string | null; handleType?: string } | null) => void;

  addNode: (nodeType: 'TRIGGER' | 'CORE_CONDITION' | 'HTTP_REQUEST', position?: { x: number; y: number }) => void;
  selectNode: (nodeId: string | null) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, any>) => void;
  updateNodeStatus: (nodeId: string, status: NodeExecutionStatus, output?: any, error?: string) => void;
  resetExecutionStatus: () => void;
  setExecuting: (isExecuting: boolean) => void;
  clearValidationError: () => void;

  toWorkflowDefinition: () => WorkflowDefinition;
  loadWorkflowDefinition: (definition: WorkflowDefinition) => void;
}

const initialNodes: SynapseNode[] = [
  {
    id: 'trigger_1',
    type: 'triggerNode',
    position: { x: 100, y: 150 },
    data: {
      title: 'Incoming Webhook',
      type: 'TRIGGER',
      category: 'TRIGGER',
      config: {},
      status: 'IDLE',
    },
  },
  {
    id: 'condition_1',
    type: 'conditionNode',
    position: { x: 400, y: 150 },
    data: {
      title: 'Check Threshold',
      type: 'CORE_CONDITION',
      category: 'LOGIC',
      config: {
        field: 'trigger.amount',
        operator: 'gt',
        targetValue: 100,
      },
      status: 'IDLE',
    },
  },
  {
    id: 'http_1',
    type: 'httpNode',
    position: { x: 750, y: 80 },
    data: {
      title: 'Notify High Priority',
      type: 'HTTP_REQUEST',
      category: 'ACTION',
      config: {
        method: 'POST',
        url: 'https://httpbin.org/post',
        headers: { 'Content-Type': 'application/json' },
        body: '{"alert": "High value: {{ trigger.amount }}"}',
      },
      status: 'IDLE',
    },
  },
  {
    id: 'http_2',
    type: 'httpNode',
    position: { x: 750, y: 260 },
    data: {
      title: 'Notify Low Priority',
      type: 'HTTP_REQUEST',
      category: 'ACTION',
      config: {
        method: 'POST',
        url: 'https://httpbin.org/post',
        headers: { 'Content-Type': 'application/json' },
        body: '{"alert": "Normal transaction: {{ trigger.amount }}"}',
      },
      status: 'IDLE',
    },
  },
];

const initialEdges: SynapseEdge[] = [
  {
    id: 'e_trigger_cond',
    source: 'trigger_1',
    sourceHandle: 'output',
    target: 'condition_1',
    targetHandle: 'input_a',
    type: 'cable',
  },
  {
    id: 'e_cond_true',
    source: 'condition_1',
    sourceHandle: 'true',
    target: 'http_1',
    targetHandle: 'input',
    label: 'true',
    type: 'cable',
  },
  {
    id: 'e_cond_false',
    source: 'condition_1',
    sourceHandle: 'false',
    target: 'http_2',
    targetHandle: 'input',
    label: 'false',
    type: 'cable',
  },
];

export const useWorkflowStore = create<WorkflowStoreState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  workflowMeta: {
    id: 'wf_sample',
    name: 'Transaction Approval Pipeline',
    version: 1,
  },
  selectedNodeId: null,
  validationError: null,
  isExecuting: false,
  connectingHandle: null,

  setConnectingHandle: (connectingHandle) => {
    set({ connectingHandle });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    if (!connection.source || !connection.target) return;

    const currentEdges = get().edges.map((e) => ({
      source: e.source,
      target: e.target,
    }));

    const isCycle = wouldCauseCycle(currentEdges, {
      source: connection.source,
      target: connection.target,
    });

    if (isCycle) {
      set({
        validationError: `Cycle detected: connecting "${connection.source}" to "${connection.target}" creates a closed loop.`,
      });
      return;
    }

    set({
      validationError: null,
      edges: addEdge(
        {
          ...connection,
          type: 'cable',
          label: connection.sourceHandle ?? undefined,
        },
        get().edges
      ),
    });
  },

  addNode: (nodeType, position) => {
    const id = `${nodeType.toLowerCase()}_${Date.now()}`;
    const defaultPosition = position || {
      x: 250 + (get().nodes.length % 5) * 40,
      y: 100 + (get().nodes.length % 5) * 40,
    };

    let title = 'New Node';
    let rfType = 'httpNode';
    let category: 'TRIGGER' | 'LOGIC' | 'ACTION' | 'INTEGRATION' = 'ACTION';
    let config: Record<string, any> = {};

    switch (nodeType) {
      case 'TRIGGER':
        title = 'Webhook Trigger';
        rfType = 'triggerNode';
        category = 'TRIGGER';
        config = {};
        break;
      case 'CORE_CONDITION':
        title = 'Condition';
        rfType = 'conditionNode';
        category = 'LOGIC';
        config = { field: 'trigger.status', operator: 'equals', targetValue: 'success' };
        break;
      case 'HTTP_REQUEST':
        title = 'HTTP Request';
        rfType = 'httpNode';
        category = 'ACTION';
        config = { method: 'GET', url: 'https://httpbin.org/get' };
        break;
    }

    const newNode: SynapseNode = {
      id,
      type: rfType,
      position: defaultPosition,
      data: {
        title,
        type: nodeType,
        category,
        config,
        status: 'IDLE',
      },
    };

    set({
      nodes: [...get().nodes, newNode],
      selectedNodeId: id,
    });
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  updateNodeConfig: (nodeId, config) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
          : node
      ),
    });
  },

  updateNodeStatus: (nodeId, status, output, error) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                status,
                ...(output !== undefined ? { output } : {}),
                ...(error !== undefined ? { error } : {}),
              },
            }
          : node
      ),
    });
  },

  resetExecutionStatus: () => {
    set({
      nodes: get().nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'IDLE',
          output: undefined,
          error: undefined,
        },
      })),
      isExecuting: false,
    });
  },

  setExecuting: (isExecuting) => {
    set({ isExecuting });
  },

  clearValidationError: () => {
    set({ validationError: null });
  },

  toWorkflowDefinition: (): WorkflowDefinition => {
    const { nodes, edges, workflowMeta } = get();

    const coreNodes: WorkflowNode[] = nodes.map((node) => ({
      id: node.id,
      type: node.data.type,
      data: {
        title: node.data.title,
        config: node.data.config,
      },
    }));

    const coreEdges: WorkflowEdge[] = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle ?? undefined,
      targetHandle: edge.targetHandle ?? undefined,
    }));

    return {
      id: workflowMeta.id,
      name: workflowMeta.name,
      nodes: coreNodes,
      edges: coreEdges,
    };
  },

  loadWorkflowDefinition: (definition: WorkflowDefinition) => {
    const nodes: SynapseNode[] = definition.nodes.map((node, index) => {
      let rfType = 'httpNode';
      let category: 'TRIGGER' | 'LOGIC' | 'ACTION' | 'INTEGRATION' = 'ACTION';

      if (node.type === 'TRIGGER') {
        rfType = 'triggerNode';
        category = 'TRIGGER';
      } else if (node.type === 'CORE_CONDITION') {
        rfType = 'conditionNode';
        category = 'LOGIC';
      }

      return {
        id: node.id,
        type: rfType,
        position: { x: 100 + (index % 4) * 250, y: 100 + Math.floor(index / 4) * 150 },
        data: {
          title: node.data.title || node.id,
          type: node.type,
          category,
          config: node.data.config || {},
          status: 'IDLE',
        },
      };
    });

    const edges: SynapseEdge[] = definition.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      label: edge.sourceHandle,
      animated: true,
    }));

    set({
      nodes,
      edges,
      workflowMeta: {
        id: definition.id,
        name: definition.name,
        version: 1,
      },
      selectedNodeId: null,
      validationError: null,
    });
  },
}));
