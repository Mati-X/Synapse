# Synapse Engine

An event-driven workflow orchestration engine and visual DAG execution runtime built with TypeScript.

Synapse decouples visual workflow design from distributed, stateless execution. Workflows are modeled as Directed Acyclic Graphs (DAGs), validated in real-time, resolved deterministically, and executed through distributed task queues with live telemetry.

---

## Architectural Overview

Synapse is split into two primary layers: a reactive visual studio and an asynchronous distributed execution engine.

```
[ Synapse Studio (UI) ]
       │ React Flow (@xyflow/react) + Zustand
       │ In-flight Cycle Detection (DFS onConnect)
       ▼  HTTP POST /workflows/deploy
[ Synapse Runtime (API) ]
       │ Fastify / Zod validation
       │ Plugin Registry & Execution Context
       ├──► PostgreSQL (Workflows, Versions, Run History)
       │
       ▼  Enqueue Task
[ Redis & BullMQ (Distributed Queue) ]
       │ Exponential backoff, retries, rate limiting (429)
       │ Idempotent job handling
       ▼  Worker Dispatch
[ Execution Runner ]
       │ Kahn's Algorithm (Topological Sort & Parallel Layers)
       │ NodeExecutors (Strategy Pattern)
       └──► Server-Sent Events (SSE) ──► Live UI Telemetry
```

### Key Engineering Decisions

- **Deterministic DAG Resolution**: Workflows are topologically sorted using **Kahn’s algorithm**, allowing independent graph branches to execute concurrently while strictly respecting data dependencies.
- **In-flight Cycle Prevention**: While Kahn's algorithm validates acyclicity on the backend, the visual editor uses an in-flight **Depth-First Search (DFS)** during edge connections to prevent users from introducing cycles before deployment.
- **Pipes & Filters Execution**: Nodes implement a stateless `NodeExecutor` strategy contract. Context variables propagate immutably through an `ExecutionContext` with safe template interpolation (`{{trigger.body.field}}`).
- **Telemetry over SSE**: Server-Sent Events provide unidirectional real-time execution feedback to the studio UI without the socket connection overhead of full-duplex WebSockets.
- **Reliability & Backpressure**: Job execution is offloaded to Redis + BullMQ workers to decouple HTTP ingress from long-running node executions and ensure graceful backoff on rate limits.

---

## Monorepo Structure

```
synapse/
├── apps/
│   ├── api/             # Fastify REST API, BullMQ worker runtime & SSE gateway
│   └── web/             # Synapse Studio (React Flow, Zustand canvas editor)
├── packages/
│   └── core/            # Canonical models, DAG algorithms, executor contracts
├── docker-compose.yml   # Local PostgreSQL 16 & Redis 7 services
├── pnpm-workspace.yaml  # Workspace configuration
└── turbo.json           # Turborepo build pipeline
```

---

## Quick Start

### Prerequisites
- **Node.js** >= 20
- **pnpm** >= 9
- **Docker** & **Docker Compose**

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/synapse.git
cd synapse
pnpm install
```

### 2. Start Infrastructure
Start local PostgreSQL and Redis instances:
```bash
docker compose up -d
```

### 3. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env
```

### 4. Build & Run in Development
Run all workspace projects concurrently:
```bash
pnpm dev
```

Or build all packages:
```bash
pnpm build
```

---

## Canonical Workflow Schema Example

Workflows are serialized into declarative JSON documents:

```json
{
  "id": "wf_sys_001",
  "name": "Production Incident Remediation",
  "version": 1,
  "triggerNodeId": "node_webhook_in",
  "nodes": [
    {
      "id": "node_webhook_in",
      "type": "CORE_WEBHOOK",
      "position": { "x": 100, "y": 250 },
      "data": { "title": "Ingress Webhook", "config": {} }
    },
    {
      "id": "node_eval_severity",
      "type": "CORE_CONDITION",
      "position": { "x": 420, "y": 250 },
      "data": {
        "title": "Evaluate Severity",
        "config": {
          "field": "trigger.body.severity",
          "operator": "equals",
          "targetValue": "CRITICAL"
        }
      }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "node_webhook_in",
      "target": "node_eval_severity"
    }
  ]
}
```

---

## License
MIT
