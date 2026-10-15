export interface GraphNode {
    id: string;
}
export interface GraphEdge {
    source: string;
    target: string;
}
export function kahnSort(nodes: GraphNode[], edges: GraphEdge[]): string[] {
    const inDegree = new Map<string, number>(nodes.map(node => [node.id, 0]));
    const adjList = new Map<string, string[]>(nodes.map(node => [node.id, []]));
    const result: string[] = [];

    edges.map(edge =>
    {
        adjList.get(edge.source)?.push(edge.target);

        const current = inDegree.get(edge.target) || 0;
        inDegree.set(edge.target, current + 1);
    })

    const queue: string[] = [];

    for (const [nodeId, deg] of inDegree.entries()) {
        if (deg === 0) {
            queue.push(nodeId);
        }
    }

    while (queue.length > 0) {
        const current = queue.shift()!;
        result.push(current);

        const neighbors = adjList.get(current) || [];
        for (const neighbor of neighbors) {
            const newDeg = (inDegree.get(neighbor) || 0) - 1;
            inDegree.set(neighbor, newDeg);

            if (newDeg === 0) {
                queue.push(neighbor);
            }
        }
    }

    if (result.length !== nodes.length) {
        throw new Error("Graph cycle detected: Kahn algorithm failed to resolve all nodes");
    }

    return result;
}