import React from 'react';
import { TopBar } from '../organisms/TopBar';
import { WorkflowCanvas } from '../organisms/WorkflowCanvas';
import { Inspector } from '../organisms/Inspector';
import { StatusBar } from '../organisms/StatusBar';

export interface StudioLayoutProps {
  onRunWorkflow?: () => void;
  onNavigateHome?: () => void;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({
  onRunWorkflow,
  onNavigateHome,
}) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#070709] text-zinc-100 select-none font-sans">
      <TopBar
        onRunWorkflow={onRunWorkflow}
        onNavigateHome={onNavigateHome}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <WorkflowCanvas />
        <Inspector />
      </div>
      <StatusBar />
    </div>
  );
};
