import React from 'react';
import {Check, CircleAlert, Flag, GitFork, X, Zap} from "lucide-react";
export type BadgeVariant = 'trigger' | 'logic' | 'action' | 'success' | 'warning' | 'danger' | 'default';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantColor: Record<BadgeVariant, string> = {
  default: 'text-zinc-400 px-3',
  trigger: 'text-indigo-400',
  logic:   'text-cyan-400',
  action:  'text-sky-400',
  warning: 'text-amber-400',
  success: 'text-emerald-400',
  danger:  'text-rose-400',
};

const variantIcon: Record<BadgeVariant, React.ReactNode> = {
  default: undefined,
  trigger: <Zap/>,
  logic:   <GitFork />,
  action:  <Flag />,
  success: <Check />,
  warning: <CircleAlert />,
  danger:  <X />,
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
  }) => {
  const baseStyles = `
  inline-flex items-center px-2 py-0.5 gap-1.5 
  rounded-full text-[11px] font-semibold tracking-wide
  border border-current/25 
  bg-gradient-to-b from-current/15 to-current/5
  shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_3px_rgba(0,0,0,0.3)]
  backdrop-blur-sm select-none
  [&>svg]:size-3 [&>svg]:opacity-90
`;
  return (
      <span
          className={`${baseStyles} ${variantColor[variant]} ${className}`}
          {...props}
      >
           {variantIcon[variant]}
      {children}
    </span>
  );
};