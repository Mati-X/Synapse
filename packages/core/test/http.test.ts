import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpRequestExecutor } from '../src/executors/http.js';
import { ExecutionContext } from '../src/types/execution.js';

describe('HttpRequestExecutor (HTTP_REQUEST)', () => {
  const executor = new HttpRequestExecutor();

  const createMockContext = (variables: Record<string, any>): ExecutionContext => ({
    runId: 'test-run-123',
    workflowId: 'test-wf-456',
    variables,
    logger: {
      info: vi.fn(),
      error: vi.fn(),
    },
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('has correct type and category', () => {
    expect(executor.type).toBe('HTTP_REQUEST');
    expect(executor.category).toBe('ACTION');
  });

  it('performs a GET request with interpolated URL and headers', async () => {
    const mockResponseData = { id: 'usr_99', name: 'Mati' };
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponseData,
      text: async () => JSON.stringify(mockResponseData),
    });
    vi.stubGlobal('fetch', fetchMock);

    const context = createMockContext({
      userId: 'usr_99',
      apiKey: 'secret_123',
    });

    const result = await executor.execute(
      {
        url: 'https://api.example.com/users/{{ userId }}',
        method: 'GET',
        headers: {
          Authorization: 'Bearer {{ apiKey }}',
        },
      },
      context
    );

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/users/usr_99', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer secret_123',
      },
      body: undefined,
    });

    expect(result.output.status).toBe(200);
    expect(result.output.ok).toBe(true);
    expect(result.output.data).toEqual(mockResponseData);
  });

  it('performs a POST request with interpolated body template', async () => {
    const mockCreatedData = { issueId: 101, url: 'https://github.com/org/repo/issues/101' };
    const fetchMock = vi.fn().mockResolvedValue({
      status: 201,
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockCreatedData,
      text: async () => JSON.stringify(mockCreatedData),
    });
    vi.stubGlobal('fetch', fetchMock);

    const context = createMockContext({
      service: 'billing-api',
      message: 'DB pool exhausted',
    });

    const result = await executor.execute(
      {
        url: 'https://api.github.com/repos/org/repo/issues',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"title":"Alert in {{ service }}","body":"{{ message }}"}',
      },
      context
    );

    expect(fetchMock).toHaveBeenCalledWith('https://api.github.com/repos/org/repo/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{"title":"Alert in billing-api","body":"DB pool exhausted"}',
    });

    expect(result.output.status).toBe(201);
    expect(result.output.ok).toBe(true);
    expect(result.output.data).toEqual(mockCreatedData);
  });

  it('handles non-JSON text responses gracefully', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      headers: new Headers({ 'content-type': 'text/plain' }),
      json: async () => {
        throw new Error('Not JSON');
      },
      text: async () => 'OK PONG',
    });
    vi.stubGlobal('fetch', fetchMock);

    const context = createMockContext({});

    const result = await executor.execute(
      {
        url: 'https://api.example.com/ping',
        method: 'GET',
      },
      context
    );

    expect(result.output.status).toBe(200);
    expect(result.output.ok).toBe(true);
    expect(result.output.data).toBe('OK PONG');
  });

  it('captures error responses without throwing unhandled exceptions', async () => {
    const errorBody = { error: 'Not Found' };
    const fetchMock = vi.fn().mockResolvedValue({
      status: 404,
      ok: false,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => errorBody,
      text: async () => JSON.stringify(errorBody),
    });
    vi.stubGlobal('fetch', fetchMock);

    const context = createMockContext({});

    const result = await executor.execute(
      {
        url: 'https://api.example.com/missing',
        method: 'GET',
      },
      context
    );

    expect(result.output.status).toBe(404);
    expect(result.output.ok).toBe(false);
    expect(result.output.data).toEqual(errorBody);
  });
});
