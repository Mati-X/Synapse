import { describe, it, expect } from 'vitest';
import { resolvePath, interpolate } from '../src/engine/interpolator.js';

describe('Path Resolver & Interpolator', () => {
  const context = {
    env: {
      GITHUB_TOKEN: 'ghp_secret_token_123',
    },
    trigger: {
      body: {
        service: 'billing-gateway',
        severity: 'CRITICAL',
        active: true,
        metrics: {
          latencyMs: 1450,
        },
      },
    },
    node_http: {
      status: 200,
      data: {
        id: 999,
        items: ['a', 'b'],
      },
    },
  };

  describe('resolvePath', () => {
    it('resolves direct and deeply nested properties', () => {
      expect(resolvePath(context, 'env.GITHUB_TOKEN')).toBe('ghp_secret_token_123');
      expect(resolvePath(context, 'trigger.body.service')).toBe('billing-gateway');
      expect(resolvePath(context, 'trigger.body.metrics.latencyMs')).toBe(1450);
      expect(resolvePath(context, 'trigger.body.active')).toBe(true);
    });

    it('returns empty string when path is missing or intermediate property is nullish', () => {
      expect(resolvePath(context, 'non.existing.path')).toBe('');
      expect(resolvePath(context, 'trigger.body.unknown.subfield')).toBe('');
      expect(resolvePath(null, 'foo.bar')).toBe('');
      expect(resolvePath(undefined, 'foo.bar')).toBe('');
      expect(resolvePath(context, '')).toBe('');
    });
  });

  describe('interpolate', () => {
    it('interpolates multiple variables with and without whitespace inside curly braces', () => {
      const template = 'ALERT: {{ trigger.body.service }} has severity {{trigger.body.severity}} (token: {{  env.GITHUB_TOKEN  }})';
      const result = interpolate(template, context);
      expect(result).toBe('ALERT: billing-gateway has severity CRITICAL (token: ghp_secret_token_123)');
    });

    it('interpolates numeric and boolean values correctly', () => {
      const template = 'Latency: {{ trigger.body.metrics.latencyMs }}ms, Active: {{ trigger.body.active }}';
      const result = interpolate(template, context);
      expect(result).toBe('Latency: 1450ms, Active: true');
    });

    it('serializes nested objects and arrays to JSON string', () => {
      const template = 'Data: {{ node_http.data }}';
      const result = interpolate(template, context);
      expect(result).toBe('Data: {"id":999,"items":["a","b"]}');
    });

    it('replaces missing variables with empty string', () => {
      const template = 'Missing: [{{ trigger.body.missingField }}]';
      const result = interpolate(template, context);
      expect(result).toBe('Missing: []');
    });

    it('handles empty or falsy templates gracefully', () => {
      expect(interpolate('', context)).toBe('');
      expect(interpolate(null as any, context)).toBe('');
      expect(interpolate(undefined as any, context)).toBe('');
    });
  });
});
