import React from 'react';
import { TopBar } from '../organisms/TopBar';
import { WorkflowCanvas } from '../organisms/WorkflowCanvas';
import { Inspector } from '../organisms/Inspector';

export interface StudioLayoutProps {
  onRunWorkflow?: () => void;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({ onRunWorkflow }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      <TopBar onRunWorkflow={onRunWorkflow} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <WorkflowCanvas />
        <Inspector />
      </div>
    </div>
  );
};
