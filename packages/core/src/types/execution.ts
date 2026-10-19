export type NodeCategory = 'TRIGGER' | 'LOGIC' | 'ACTION' | 'INTEGRATION';

export interface ExecutionContext {
    runId : string;
    workflowId : string;
    variables : Record<string, any>;
    logger: {
        info: (msg: string, meta?: any) => void;
        error: (msg: string, meta?: any) => void;
    };
}

export interface NodeExecutorResult {
    output: Record<string, any>;
    nextHandle?: string;
}

export interface NodeExecutor<TConfig> {
    type : Readonly<string>;
    category: Readonly<NodeCategory>;
    execute: (config: TConfig, context: ExecutionContext) => Promise<NodeExecutorResult>
}

export type WorkflowTelemetryEvent =
    | { type: 'NODE_STARTED'; runId: string; nodeId: string; timestamp: string }
    | { type: 'NODE_COMPLETED'; runId: string; nodeId: string; output: any; nextHandle?: string; timestamp: string }
    | { type: 'NODE_SKIPPED'; runId: string; nodeId: string; timestamp: string }
    | { type: 'NODE_FAILED'; runId: string; nodeId: string; error: string; timestamp: string };

export type TelemetryListener = (event: WorkflowTelemetryEvent) => void;