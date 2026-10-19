import { Node, Edge } from '@xyflow/react';

export type NodeExecutionStatus = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'SKIPPED' | 'FAILED';

export interface SynapseNodeData {
  title: string;
  type: string;
  category: 'TRIGGER' | 'LOGIC' | 'ACTION' | 'INTEGRATION';
  config: Record<string, any>;
  status?: NodeExecutionStatus;
  output?: any;
  error?: string;
  [key: string]: unknown;
}

export type SynapseNode = Node<SynapseNodeData>;
export type SynapseEdge = Edge;

export interface WorkflowMetadata {
  id: string;
  name: string;
  version: number;
}
