export interface EdgeConnection {
  source: string;
  target: string;
}

/**
 * Checks if adding a directed connection from source to target would create a cycle.
 * In a DAG, adding u -> v creates a cycle if and only if v can already reach u.
 */
export function wouldCauseCycle(
  existingEdges: EdgeConnection[],
  newConnection: EdgeConnection
): boolean {
  const { source, target } = newConnection;

  if (source === target) {
    return true;
  }

  const adjacencyList = new Map<string, string[]>();
  for (const edge of existingEdges) {
    const neighbors = adjacencyList.get(edge.source);
    if (neighbors) {
      neighbors.push(edge.target);
    } else {
      adjacencyList.set(edge.source, [edge.target]);
    }
  }

  const visited = new Set<string>();
  const stack: string[] = [target];

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (current === source) {
      return true;
    }

    if (!visited.has(current)) {
      visited.add(current);
      const neighbors = adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }

  return false;
}
