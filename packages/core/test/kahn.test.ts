import { describe, it, expect } from 'vitest';
import { kahnSort } from '../src/engine/kahn.js';

describe('Kahn Topological Sort (Synapse Core)', () => {
  it('should sort a simple linear DAG correctly', () => {
    const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
    const edges = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
    ];

    const result = kahnSort(nodes, edges);
    expect(result).toEqual(['A', 'B', 'C']);
  });

  it('should resolve branching and converging dependencies (Diamond DAG)', () => {
    // A -> B -> D
    // A -> C -> D
    const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }];
    const edges = [
      { source: 'A', target: 'B' },
      { source: 'A', target: 'C' },
      { source: 'B', target: 'D' },
      { source: 'C', target: 'D' },
    ];

    const result = kahnSort(nodes, edges);
    expect(result[0]).toBe('A');
    expect(result[3]).toBe('D');
    // B and C can be in any relative order, but both must be between A and D
    expect(result.slice(1, 3)).toEqual(expect.arrayContaining(['B', 'C']));
  });

  it('should handle disconnected nodes without edges', () => {
    const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
    const edges: { source: string; target: string }[] = [];

    const result = kahnSort(nodes, edges);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(['A', 'B', 'C']));
  });

  it('should throw error when a direct 2-node cycle is detected', () => {
    const nodes = [{ id: 'A' }, { id: 'B' }];
    const edges = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'A' },
    ];

    expect(() => kahnSort(nodes, edges)).toThrow(
      'Graph cycle detected: Kahn algorithm failed to resolve all nodes'
    );
  });

  it('should throw error when a multi-node cycle is detected', () => {
    // A -> B -> C -> D -> B
    const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }];
    const edges = [
      { source: 'A', target: 'B' },
      { source: 'B', target: 'C' },
      { source: 'C', target: 'D' },
      { source: 'D', target: 'B' },
    ];

    expect(() => kahnSort(nodes, edges)).toThrow(
      'Graph cycle detected: Kahn algorithm failed to resolve all nodes'
    );
  });

  it('should throw error on self-referencing cycle', () => {
    const nodes = [{ id: 'A' }];
    const edges = [{ source: 'A', target: 'A' }];

    expect(() => kahnSort(nodes, edges)).toThrow(
      'Graph cycle detected: Kahn algorithm failed to resolve all nodes'
    );
  });
});
