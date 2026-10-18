export interface WorkflowNode {
     id: string;
     type: string;
     data: {
         title?: string
         config: any
     }
}

export interface WorkflowEdge {
     id: string;
     source: string;
     target: string;
     sourceHandle?: string;
     targetHandle?: string;
}

export interface WorkflowDefinition {
    id: string;
    name: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}