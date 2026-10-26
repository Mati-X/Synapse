import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';

export const Inspector: React.FC = () => {
  const { nodes, selectedNodeId, selectNode, updateNodeConfig } = useWorkflowStore();

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <aside>
        <span>No Node Selected</span>
      </aside>
    );
  }

  const { data } = selectedNode;
  const config = data.config || {};

  return (
    <aside>
      <div>
        <span>{data.title}</span>
        <button onClick={() => selectNode(null)}>Close</button>
      </div>

      <div>
        {data.type === 'CORE_CONDITION' && (
          <>
            <FormField label="Field">
              <Input
                value={config.field || ''}
                onChange={(e) => updateNodeConfig(selectedNode.id, { field: e.target.value })}
              />
            </FormField>
            <FormField label="Operator">
              <Select
                value={config.operator || 'equals'}
                onChange={(e) => updateNodeConfig(selectedNode.id, { operator: e.target.value })}
                options={[
                  { label: 'equals', value: 'equals' },
                  { label: 'not_equals', value: 'not_equals' },
                  { label: 'contains', value: 'contains' },
                  { label: 'gt', value: 'gt' },
                  { label: 'lt', value: 'lt' },
                ]}
              />
            </FormField>
            <FormField label="Target Value">
              <Input
                value={config.targetValue ?? ''}
                onChange={(e) => updateNodeConfig(selectedNode.id, { targetValue: e.target.value })}
              />
            </FormField>
          </>
        )}

        {data.type === 'HTTP_REQUEST' && (
          <>
            <FormField label="Method">
              <Select
                value={config.method || 'GET'}
                onChange={(e) => updateNodeConfig(selectedNode.id, { method: e.target.value })}
                options={[
                  { label: 'GET', value: 'GET' },
                  { label: 'POST', value: 'POST' },
                  { label: 'PUT', value: 'PUT' },
                  { label: 'PATCH', value: 'PATCH' },
                  { label: 'DELETE', value: 'DELETE' },
                ]}
              />
            </FormField>
            <FormField label="URL">
              <Input
                value={config.url || ''}
                onChange={(e) => updateNodeConfig(selectedNode.id, { url: e.target.value })}
              />
            </FormField>
          </>
        )}
      </div>
    </aside>
  );
};
