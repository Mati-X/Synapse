import React from 'react';
import { NodeExecutionStatus } from '../../types/workflow';

export interface NodeHeaderProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    status?: NodeExecutionStatus;
    category?: string;
    className?: string;
}

export const NodeHeader: React.FC<NodeHeaderProps> = ({
                                                          title,
                                                          subtitle,
                                                          icon,
                                                          className = '',
                                                      }) => {
    return (
        <div className={`flex items-center gap-2.5 pb-2.5 mb-2.5 border-b  border-zinc-800/80 select-none ${className}`}>
            {icon && (
                <div className="w-8 h-8 rounded-md bg-zinc-950/80 border border-zinc-700/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 text-zinc-300 [&>svg]:size-4">
                    {icon}
                </div>
            )}

            <div className="flex flex-col min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-zinc-100 truncate tracking-tight">
                    {title}
                </h4>
                {subtitle && (
                    <span className="text-[10px] font-mono text-zinc-400 truncate opacity-80" title={subtitle}>
            {subtitle}
          </span>
                )}
            </div>
        </div>
    );
};