import {WorkflowDefinition, WorkflowEdge} from "../types/workflow";
import {ExecutionContext, NodeExecutor, NodeExecutorResult} from "../types/execution";
import {kahnSort} from "./kahn";

export class WorkflowRunner {
    constructor(private registry: Map<string, NodeExecutor<any>>) {
        this.registry = registry;
    }

    async run(workflow: WorkflowDefinition, context: ExecutionContext) : Promise<ExecutionContext> {
        let executionOrder = kahnSort(workflow.nodes,workflow.edges);
        const nodeMap = new Map(workflow.nodes.map(n => [n.id, n]));
        const incomingEdgesMap = new Map<string, WorkflowEdge[]>();

        for (const node of workflow.nodes) {
            incomingEdgesMap.set(node.id, []);
        }
        for (const edge of workflow.edges) {
            incomingEdgesMap.get(edge.target)?.push(edge);
        }

        const skippedNodes = new Set<string>();
        const nodeOutputs = new Map<string, NodeExecutorResult>();

        for (const nodeId of executionOrder) {
            const node = nodeMap.get(nodeId)!;
            const incomingEdges = incomingEdgesMap.get(nodeId) || [];

            for (const edge of incomingEdges) {
                if (skippedNodes.has(edge.source)) {
                    skippedNodes.add(nodeId);
                    break;
                }

                const parentResult = nodeOutputs.get(edge.source);

                if (edge.sourceHandle && edge.sourceHandle !== parentResult?.nextHandle) {
                    skippedNodes.add(nodeId);
                    break;
                }
            }

            if (skippedNodes.has(nodeId)) {
                continue;
            }

            const executor = this.registry.get(node.type);
            if (!executor) {
                throw new Error(`Unknown node executor for type: ${node.type}`);
            }

            const result = await executor.execute(node.data.config,context);

            context.variables[node.id] = result.output;
            nodeOutputs.set(nodeId, result);
        }

        return context;
    }
}