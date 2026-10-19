import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {ConditionExecutor, HttpRequestExecutor, kahnSort, WorkflowDefinition, WorkflowRunner} from "@synapse/core";
import { db } from '../db/index.js';
import {executionRuns, workflows, workflowVersions} from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

/**
 * Workflow management routes:
 *
 * 1. POST /api/workflows
 *    - Tworzy workflow i pierwszą wersję w bazie
 *    - Waliduje acykliczność za pomocą kahnSort(nodes, edges) z @synapse/core
 *    - Jeśli wykryto cykl -> 400 Bad Request
 *    - Zwraca 201 z id utworzonego workflow
 *
 * 2. GET /api/workflows
 *    - Zwraca listę wszystkich aktywnych workflow z tabeli workflows
 *
 * 3. GET /api/workflows/:id
 *    - Zwraca pojedynczy workflow wraz z najnowszą definicją grafu
 *
 * 4. POST /api/workflows/:id/run
 *    - Uruchamia workflow przez WorkflowRunner z @synapse/core
 *    - Zapisuje przebieg do execution_runs ze statusem COMPLETED / FAILED
 *    - Zwraca wynik wykonania (context.variables)
 */
export const workflowRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.post('/', async (request, reply) => {
    const body : any = request.body;

    try {
      kahnSort(body.nodes || [], body.edges || []);
    } catch (error : any) {
       return reply.status(400).send({error: error.message});
    }

    const workflowId = body.id || `wf_${Date.now()}`;
    await db.transaction(async (tx) => {

      await tx.insert(workflows).values({
        id: workflowId,
        name: body.name,
      });

      await tx.insert(workflowVersions).values({
        workflow_id: workflowId,
        version_number: 1,
        definition: {
          nodes: body.nodes,
          edges: body.edges,
        },
      });
    });

    return reply.status(201).send({
      id: workflowId,
      name: body.name,
      version: 1,
    });

  })

  app.get('/', async () => {
    const list = await db.select().from(workflows);
    return { workflows: list };
  });

  async function getWorkflowWithLatestVersion(id: string) {
    const [workflow] = await db
        .select()
        .from(workflows)
        .where(eq(workflows.id, id));

    if (!workflow) return null;

    const [latestVersion] = await db
        .select()
        .from(workflowVersions)
        .where(eq(workflowVersions.workflow_id, id))
        .orderBy(desc(workflowVersions.version_number))
        .limit(1);

    return { workflow, latestVersion };
  }


  app.get ('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const result = await getWorkflowWithLatestVersion(id);
    if (!result || !result.latestVersion) {
      return reply.status(404).send({ error: `Workflow ${id} not found` });
    }
    const { workflow, latestVersion } = result;

    return {
      ...workflow,
      version: latestVersion?.version_number ?? 1,
      definition: latestVersion?.definition ?? { nodes: [], edges: [] },
    };
  });

  app.post('/:id/run', async (request,reply) => {
    const { id } = request.params as { id: string };
    const body =  request.body as { inputs: Record<string, unknown> } || {};

    const result = await getWorkflowWithLatestVersion(id);
    if (!result || !result.latestVersion) {
      return reply.status(404).send({ error: `Workflow ${id} not found` });
    }
    const { workflow, latestVersion } = result;

    const registry = new Map();
    registry.set('CORE_CONDITION', new ConditionExecutor());
    registry.set('HTTP_REQUEST', new HttpRequestExecutor());
    const runner = new WorkflowRunner(registry);

    const definition = latestVersion.definition as any;

    const context = {
      runId: crypto.randomUUID(),
      workflowId: id,
      variables: {
        trigger: request.body || {}
      },
      logger: {
        info: (m: any) => app.log.info(m),
        error: (m: any) => app.log.error(m)
      }
    }

    try {
      const finalContext = await runner.run(definition, context);

      await db.transaction(async (tx) => {
        await db.insert(executionRuns).values({
          id: context.runId,
          workflow_id: id,
          version_id: latestVersion.id,
          status: 'COMPLETED',
          context_state: finalContext.variables,
          finished_at: new Date(),
        });
      });

      const  runId = context.runId;

      return reply.send({
        runId,
        status: 'COMPLETED',
        variables: finalContext.variables,
      });
    } catch  (err: any) {
      await db.transaction(async (tx) => {
        await db.insert(executionRuns).values({
          id: context.runId,
          workflow_id: id,
          version_id: latestVersion.id,
          status: 'FAILED',
          context_state: context.variables,
          error_details: { message: err.message },
          finished_at: new Date(),
        });
      });

      return reply.status(500).send({ error: err.message });
    }
  })

};
