import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ConditionExecutor, HttpRequestExecutor, kahnSort, WorkflowRunner } from '@synapse/core';
import { db } from '../db/index.js';
import { executionLogs, executionRuns, workflows, workflowVersions } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { telemetryBroker } from '../telemetry/telemetryBroker.js';
import crypto from 'node:crypto';

export const workflowRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get('/', async () => {
    const list = await db.select().from(workflows).orderBy(desc(workflows.updated_at));

    const enriched = await Promise.all(
      list.map(async (wf) => {
        const [latestVersion] = await db
          .select()
          .from(workflowVersions)
          .where(eq(workflowVersions.workflow_id, wf.id))
          .orderBy(desc(workflowVersions.version_number))
          .limit(1);

        const [runsCount] = await db
          .select()
          .from(executionRuns)
          .where(eq(executionRuns.workflow_id, wf.id));

        const definition = (latestVersion?.definition as any) || { nodes: [], edges: [] };

        return {
          id: wf.id,
          name: wf.name,
          description: wf.description || '',
          category: wf.category || 'GENERAL',
          status: wf.status || 'ACTIVE',
          tags: [wf.category || 'GENERAL'],
          updatedAt: wf.updated_at ? new Date(wf.updated_at).toLocaleDateString() : 'recently',
          executionsCount: runsCount ? 1 : 0,
          version: latestVersion?.version_number ?? 1,
          nodes: definition.nodes || [],
          edges: definition.edges || [],
        };
      })
    );

    return { workflows: enriched };
  });

  app.post('/', async (request, reply) => {
    const body: any = request.body || {};

    try {
      kahnSort(body.nodes || [], body.edges || []);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }

    const workflowId = body.id && body.id.includes('-') ? body.id : crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(workflows).values({
        id: workflowId,
        name: body.name || 'Unnamed Pipeline',
        description: body.description || '',
        category: body.category || 'GENERAL',
        status: body.status || 'ACTIVE',
      });

      await tx.insert(workflowVersions).values({
        workflow_id: workflowId,
        version_number: 1,
        definition: {
          nodes: body.nodes || [],
          edges: body.edges || [],
        },
      });
    });

    return reply.status(201).send({
      id: workflowId,
      name: body.name || 'Unnamed Pipeline',
      version: 1,
      nodes: body.nodes || [],
      edges: body.edges || [],
    });
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    if (!workflow) {
      return reply.status(404).send({ error: `Workflow ${id} not found` });
    }

    const [latestVersion] = await db
      .select()
      .from(workflowVersions)
      .where(eq(workflowVersions.workflow_id, id))
      .orderBy(desc(workflowVersions.version_number))
      .limit(1);

    const definition = (latestVersion?.definition as any) || { nodes: [], edges: [] };

    return reply.send({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      category: workflow.category,
      status: workflow.status,
      version: latestVersion?.version_number ?? 1,
      nodes: definition.nodes,
      edges: definition.edges,
    });
  });

  app.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body: any = request.body || {};

    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    if (!workflow) {
      return reply.status(404).send({ error: `Workflow ${id} not found` });
    }

    if (body.nodes && body.edges) {
      try {
        kahnSort(body.nodes, body.edges);
      } catch (error: any) {
        return reply.status(400).send({ error: error.message });
      }
    }

    await db.transaction(async (tx) => {
      await tx
        .update(workflows)
        .set({
          name: body.name !== undefined ? body.name : workflow.name,
          description: body.description !== undefined ? body.description : workflow.description,
          category: body.category !== undefined ? body.category : workflow.category,
          status: body.status !== undefined ? body.status : workflow.status,
          updated_at: new Date(),
        })
        .where(eq(workflows.id, id));

      if (body.nodes && body.edges) {
        const [latestVersion] = await tx
          .select()
          .from(workflowVersions)
          .where(eq(workflowVersions.workflow_id, id))
          .orderBy(desc(workflowVersions.version_number))
          .limit(1);

        const nextVersion = (latestVersion?.version_number ?? 0) + 1;

        await tx.insert(workflowVersions).values({
          workflow_id: id,
          version_number: nextVersion,
          definition: {
            nodes: body.nodes,
            edges: body.edges,
          },
        });
      }
    });

    return reply.send({ success: true, id });
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    if (!workflow) {
      return reply.status(404).send({ error: `Workflow ${id} not found` });
    }

    await db.delete(workflows).where(eq(workflows.id, id));
    return reply.send({ success: true, id });
  });

  app.post('/:id/run', async (request, reply) => {
    const { id } = request.params as { id: string };

    const [workflow] = await db.select().from(workflows).where(eq(workflows.id, id));
    if (!workflow) {
      return reply.status(404).send({ error: `Workflow ${id} not found` });
    }

    const [latestVersion] = await db
      .select()
      .from(workflowVersions)
      .where(eq(workflowVersions.workflow_id, id))
      .orderBy(desc(workflowVersions.version_number))
      .limit(1);

    if (!latestVersion) {
      return reply.status(400).send({ error: 'Workflow has no valid version' });
    }

    const triggerExecutor = {
      async execute(config: any, ctx: any) {
        let payload = ctx.variables.trigger;
        if ((!payload || Object.keys(payload).length === 0) && config?.mockPayload) {
          try {
            payload = JSON.parse(config.mockPayload);
          } catch {
            payload = config.mockPayload;
          }
        }
        return {
          output: payload || {},
          nextHandle: 'output',
        };
      },
    };

    const conditionExecutor = new ConditionExecutor();
    const httpExecutor = new HttpRequestExecutor();

    const registry = new Map<string, any>();
    registry.set('TRIGGER', triggerExecutor);
    registry.set('triggerNode', triggerExecutor);
    registry.set('CORE_CONDITION', conditionExecutor);
    registry.set('conditionNode', conditionExecutor);
    registry.set('HTTP_REQUEST', httpExecutor);
    registry.set('httpNode', httpExecutor);

    const runner = new WorkflowRunner(registry);

    const definition = latestVersion.definition as any;
    const runId = crypto.randomUUID();

    const context = {
      runId,
      workflowId: id,
      variables: {
        trigger: request.body || {},
      },
      logger: {
        info: (m: any) => app.log.info(m),
        error: (m: any) => app.log.error(m),
      },
    };

    await db.insert(executionRuns).values({
      id: runId,
      workflow_id: id,
      version_id: latestVersion.id,
      status: 'RUNNING',
      context_state: context.variables,
    });

    try {
      const finalContext = await runner.run(definition, context, async (event) => {
        telemetryBroker.emit(event);

        if (event.type === 'NODE_COMPLETED') {
          try {
            await db.insert(executionLogs).values({
              run_id: runId,
              node_id: event.nodeId,
              status: 'COMPLETED',
              output: event.output || null,
              error: null,
            });
          } catch {}
        } else if (event.type === 'NODE_FAILED') {
          try {
            await db.insert(executionLogs).values({
              run_id: runId,
              node_id: event.nodeId,
              status: 'FAILED',
              output: null,
              error: { message: event.error },
            });
          } catch {}
        }
      });

      await db
        .update(executionRuns)
        .set({
          status: 'COMPLETED',
          context_state: finalContext.variables,
          finished_at: new Date(),
        })
        .where(eq(executionRuns.id, runId));

      return reply.send({
        runId,
        status: 'COMPLETED',
        variables: finalContext.variables,
      });
    } catch (err: any) {
      await db
        .update(executionRuns)
        .set({
          status: 'FAILED',
          error_details: { message: err.message },
          finished_at: new Date(),
        })
        .where(eq(executionRuns.id, runId));

      return reply.status(500).send({
        runId,
        status: 'FAILED',
        error: err.message,
      });
    }
  });
};
