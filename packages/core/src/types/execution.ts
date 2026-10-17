export enum NodeCategory {
    'TRIGGER',
    'LOGIC',
    'ACTION',
    'INTEGRATION'
}

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