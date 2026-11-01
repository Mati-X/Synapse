import { db } from './index.js';
import { workflows, workflowVersions } from './schema.js';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';

export const initialSeedWorkflows = [
  {
    name: 'Payment Fraud Sentinel & VIP Router',
    description: 'Intercepts Stripe checkout events, performs threshold risk assessment, and routes VIP orders directly to an on-call Slack channel.',
    category: 'FINANCE',
    status: 'ACTIVE',
    definition: {
      nodes: [
        {
          id: 'trigger_1',
          type: 'triggerNode',
          position: { x: 80, y: 150 },
          data: {
            title: 'Stripe Ingress Webhook',
            type: 'TRIGGER',
            category: 'TRIGGER',
            config: {
              mockPayload: '{"amount": 1450, "currency": "USD", "customer": "cust_vip99", "risk_score": 12}',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'condition_1',
          type: 'conditionNode',
          position: { x: 420, y: 150 },
          data: {
            title: 'Evaluate Amount Threshold',
            type: 'CORE_CONDITION',
            category: 'LOGIC',
            config: {
              field: 'trigger.amount',
              operator: 'gt',
              targetValue: 1000,
            },
            status: 'IDLE',
          },
        },
        {
          id: 'http_vip',
          type: 'httpNode',
          position: { x: 820, y: 70 },
          data: {
            title: 'Alert VIP Slack Channel',
            type: 'HTTP_REQUEST',
            category: 'ACTION',
            config: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              body: '{"text": "🚨 VIP Transaction detected: ${{ trigger.amount }} for {{ trigger.customer }}"}',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'http_std',
          type: 'httpNode',
          position: { x: 820, y: 250 },
          data: {
            title: 'Standard CRM Order Sync',
            type: 'HTTP_REQUEST',
            category: 'ACTION',
            config: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              body: '{"amount": {{ trigger.amount }}, "status": "processed"}',
            },
            status: 'IDLE',
          },
        },
      ],
      edges: [
        { id: 'e1', source: 'trigger_1', sourceHandle: 'output', target: 'condition_1', targetHandle: 'input_a', type: 'cable' },
        { id: 'e2', source: 'condition_1', sourceHandle: 'true', target: 'http_vip', targetHandle: 'input', type: 'cable' },
        { id: 'e3', source: 'condition_1', sourceHandle: 'false', target: 'http_std', targetHandle: 'input', type: 'cable' },
      ],
    },
  },
  {
    name: 'Kubernetes Pod Auto-Healing & Incident Dispatch',
    description: 'Listens for Prometheus Alertmanager alerts, detects CrashLoopBackOff states, and triggers automatic pod eviction or pages engineering.',
    category: 'DEVOPS',
    status: 'ACTIVE',
    definition: {
      nodes: [
        {
          id: 'trigger_k8s',
          type: 'triggerNode',
          position: { x: 80, y: 150 },
          data: {
            title: 'Prometheus Alert Ingress',
            type: 'TRIGGER',
            category: 'TRIGGER',
            config: {
              mockPayload: '{"alertname": "PodCrashLoop", "severity": "critical", "pod": "api-gateway-7f8d", "namespace": "prod"}',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'condition_sev',
          type: 'conditionNode',
          position: { x: 420, y: 150 },
          data: {
            title: 'Check Severity Level',
            type: 'CORE_CONDITION',
            category: 'LOGIC',
            config: {
              field: 'trigger.severity',
              operator: 'equals',
              targetValue: 'critical',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'http_pager',
          type: 'httpNode',
          position: { x: 820, y: 70 },
          data: {
            title: 'PagerDuty Trigger Incident',
            type: 'HTTP_REQUEST',
            category: 'ACTION',
            config: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              body: '{"routing_key": "sec_k8s", "event_action": "trigger", "payload": {"summary": "Critical: {{ trigger.alertname }} in {{ trigger.namespace }}"}}',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'http_restart',
          type: 'httpNode',
          position: { x: 820, y: 250 },
          data: {
            title: 'Restart Pod Deployment',
            type: 'HTTP_REQUEST',
            category: 'ACTION',
            config: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              body: '{"pod": "{{ trigger.pod }}", "action": "graceful_restart"}',
            },
            status: 'IDLE',
          },
        },
      ],
      edges: [
        { id: 'ek1', source: 'trigger_k8s', sourceHandle: 'output', target: 'condition_sev', targetHandle: 'input_a', type: 'cable' },
        { id: 'ek2', source: 'condition_sev', sourceHandle: 'true', target: 'http_pager', targetHandle: 'input', type: 'cable' },
        { id: 'ek3', source: 'condition_sev', sourceHandle: 'false', target: 'http_restart', targetHandle: 'input', type: 'cable' },
      ],
    },
  },
  {
    name: 'Smart LLM Fallback & Token Cost Optimizer',
    description: 'Routes inbound conversational queries between deep reasoning models (Claude 3.5 Sonnet) and low-latency models (GPT-4o mini) based on token load.',
    category: 'AI & LLM',
    status: 'ACTIVE',
    definition: {
      nodes: [
        {
          id: 'trigger_ai',
          type: 'triggerNode',
          position: { x: 80, y: 150 },
          data: {
            title: 'User Prompt Gateway',
            type: 'TRIGGER',
            category: 'TRIGGER',
            config: {
              mockPayload: '{"query": "Calculate portfolio Sharpe ratio with Monte Carlo", "token_estimate": 1400, "is_vip": true}',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'condition_tokens',
          type: 'conditionNode',
          position: { x: 420, y: 150 },
          data: {
            title: 'Complex Reasoning Check',
            type: 'CORE_CONDITION',
            category: 'LOGIC',
            config: {
              field: 'trigger.token_estimate',
              operator: 'gt',
              targetValue: 1000,
            },
            status: 'IDLE',
          },
        },
        {
          id: 'http_claude',
          type: 'httpNode',
          position: { x: 820, y: 70 },
          data: {
            title: 'Claude 3.5 Sonnet Engine',
            type: 'HTTP_REQUEST',
            category: 'ACTION',
            config: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              body: '{"model": "claude-3-5-sonnet", "max_tokens": 4096, "messages": [{"role": "user", "content": "{{ trigger.query }}"}]}',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'http_gpt',
          type: 'httpNode',
          position: { x: 820, y: 250 },
          data: {
            title: 'GPT-4o Mini Fast Inference',
            type: 'HTTP_REQUEST',
            category: 'ACTION',
            config: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              body: '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "{{ trigger.query }}"}]}',
            },
            status: 'IDLE',
          },
        },
      ],
      edges: [
        { id: 'ea1', source: 'trigger_ai', sourceHandle: 'output', target: 'condition_tokens', targetHandle: 'input_a', type: 'cable' },
        { id: 'ea2', source: 'condition_tokens', sourceHandle: 'true', target: 'http_claude', targetHandle: 'input', type: 'cable' },
        { id: 'ea3', source: 'condition_tokens', sourceHandle: 'false', target: 'http_gpt', targetHandle: 'input', type: 'cable' },
      ],
    },
  },
  {
    name: 'GitHub CI/CD Release & Multi-Cloud Deploy',
    description: 'Triggers automated container builds and zero-downtime rolling deployments when signed tags are pushed to the main branch.',
    category: 'DEVOPS',
    status: 'ACTIVE',
    definition: {
      nodes: [
        {
          id: 'trigger_gh',
          type: 'triggerNode',
          position: { x: 80, y: 150 },
          data: {
            title: 'GitHub Webhook Release',
            type: 'TRIGGER',
            category: 'TRIGGER',
            config: {
              mockPayload: '{"action": "released", "tag_name": "v2.4.0", "branch": "main", "repository": "synapse-core"}',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'condition_branch',
          type: 'conditionNode',
          position: { x: 420, y: 150 },
          data: {
            title: 'Verify Production Branch',
            type: 'CORE_CONDITION',
            category: 'LOGIC',
            config: {
              field: 'trigger.branch',
              operator: 'equals',
              targetValue: 'main',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'http_aws',
          type: 'httpNode',
          position: { x: 820, y: 70 },
          data: {
            title: 'Trigger AWS ECS Production Deploy',
            type: 'HTTP_REQUEST',
            category: 'ACTION',
            config: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              body: '{"service": "synapse-backend", "tag": "{{ trigger.tag_name }}"}',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'http_discord',
          type: 'httpNode',
          position: { x: 820, y: 250 },
          data: {
            title: 'Broadcast Release Discord',
            type: 'HTTP_REQUEST',
            category: 'ACTION',
            config: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              body: '{"content": "🚀 New production release {{ trigger.tag_name }} deployed!"}',
            },
            status: 'IDLE',
          },
        },
      ],
      edges: [
        { id: 'eg1', source: 'trigger_gh', sourceHandle: 'output', target: 'condition_branch', targetHandle: 'input_a', type: 'cable' },
        { id: 'eg2', source: 'condition_branch', sourceHandle: 'true', target: 'http_aws', targetHandle: 'input', type: 'cable' },
        { id: 'eg3', source: 'condition_branch', sourceHandle: 'false', target: 'http_discord', targetHandle: 'input', type: 'cable' },
      ],
    },
  },
  {
    name: 'E-Commerce Real-Time Inventory Restock Trigger',
    description: 'Monitors warehouse stock level events and automatically places emergency replenishment Purchase Orders when inventory falls below 20 units.',
    category: 'ECOMMERCE',
    status: 'PAUSED',
    definition: {
      nodes: [
        {
          id: 'trigger_stock',
          type: 'triggerNode',
          position: { x: 80, y: 150 },
          data: {
            title: 'Shopify Inventory Change',
            type: 'TRIGGER',
            category: 'TRIGGER',
            config: {
              mockPayload: '{"sku": "SYN-PRO-4K", "stock_count": 8, "threshold": 20, "warehouse": "US-EAST-1"}',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'condition_stock',
          type: 'conditionNode',
          position: { x: 420, y: 150 },
          data: {
            title: 'Low Stock Level Guard',
            type: 'CORE_CONDITION',
            category: 'LOGIC',
            config: {
              field: 'trigger.stock_count',
              operator: 'lt',
              targetValue: 20,
            },
            status: 'IDLE',
          },
        },
        {
          id: 'http_po',
          type: 'httpNode',
          position: { x: 820, y: 70 },
          data: {
            title: 'ERP Supplier Auto-PO',
            type: 'HTTP_REQUEST',
            category: 'ACTION',
            config: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              body: '{"sku": "{{ trigger.sku }}", "quantity": 100, "priority": "urgent"}',
            },
            status: 'IDLE',
          },
        },
        {
          id: 'http_analytics',
          type: 'httpNode',
          position: { x: 820, y: 250 },
          data: {
            title: 'Log Normal Stock Event',
            type: 'HTTP_REQUEST',
            category: 'ACTION',
            config: {
              method: 'POST',
              url: 'https://httpbin.org/post',
              body: '{"sku": "{{ trigger.sku }}", "status": "nominal"}',
            },
            status: 'IDLE',
          },
        },
      ],
      edges: [
        { id: 'es1', source: 'trigger_stock', sourceHandle: 'output', target: 'condition_stock', targetHandle: 'input_a', type: 'cable' },
        { id: 'es2', source: 'condition_stock', sourceHandle: 'true', target: 'http_po', targetHandle: 'input', type: 'cable' },
        { id: 'es3', source: 'condition_stock', sourceHandle: 'false', target: 'http_analytics', targetHandle: 'input', type: 'cable' },
      ],
    },
  },
];

export async function seedInitialWorkflowsIfEmpty() {
  const existing = await db.select().from(workflows).limit(1);
  if (existing.length > 0) return;

  for (const item of initialSeedWorkflows) {
    const id = crypto.randomUUID();
    await db.transaction(async (tx) => {
      await tx.insert(workflows).values({
        id,
        name: item.name,
        description: item.description,
        category: item.category,
        status: item.status,
      });

      await tx.insert(workflowVersions).values({
        workflow_id: id,
        version_number: 1,
        definition: item.definition,
      });
    });
  }
}

export async function forceSeedAllWorkflows() {
  for (const item of initialSeedWorkflows) {
    const existing = await db.select().from(workflows).where(eq(workflows.name, item.name)).limit(1);
    if (existing.length === 0) {
      const id = crypto.randomUUID();
      await db.transaction(async (tx) => {
        await tx.insert(workflows).values({
          id,
          name: item.name,
          description: item.description,
          category: item.category,
          status: item.status,
        });

        await tx.insert(workflowVersions).values({
          workflow_id: id,
          version_number: 1,
          definition: item.definition,
        });
      });
    }
  }
}

if (process.argv[1] && process.argv[1].includes('seed')) {
  forceSeedAllWorkflows().then(() => {
    process.exit(0);
  });
}
