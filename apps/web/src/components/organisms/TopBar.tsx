import React from 'react';
import { Button } from '../atoms/Button';
import { useWorkflowStore } from '../../store/workflowStore';

export interface TopBarProps {
  onRunWorkflow?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onRunWorkflow }) => {
  const { workflowMeta, addNode, isExecuting, resetExecutionStatus } = useWorkflowStore();

  return (
    <header>
      <div>
        <h1>{workflowMeta.name}</h1>
      </div>
      <div>
        <Button onClick={() => addNode('TRIGGER')}>+ Webhook</Button>
        <Button onClick={() => addNode('CORE_CONDITION')}>+ Condition</Button>
        <Button onClick={() => addNode('HTTP_REQUEST')}>+ HTTP Request</Button>
        <Button onClick={resetExecutionStatus}>Reset</Button>
        <Button onClick={onRunWorkflow} disabled={isExecuting}>
          {isExecuting ? 'Running...' : 'Run Pipeline'}
        </Button>
      </div>
    </header>
  );
};
