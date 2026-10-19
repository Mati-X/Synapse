import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {kahnSort} from "@synapse/core";
import { db } from '../db/index.js';
import { workflows, workflowVersions } from '../db/schema.js';

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
    return { workflows: [] };
  });
};
