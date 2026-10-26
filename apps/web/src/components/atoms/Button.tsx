import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  shortcut?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-b from-indigo-500 to-indigo-600 
    hover:from-indigo-400 hover:to-indigo-500 
    text-white border border-indigo-400/30
    shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_12px_rgba(99,102,241,0.35)]
  `,
  secondary: `
    bg-gradient-to-b from-zinc-800/90 to-zinc-900 
    hover:from-zinc-700/90 hover:to-zinc-800 
    text-zinc-200 border border-zinc-700/70 
    shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.4)]
  `,
  ghost: `
    bg-transparent hover:bg-zinc-800/80 
    text-zinc-400 hover:text-zinc-100
  `,
  danger: `
    bg-gradient-to-b from-rose-500 to-rose-600 
    hover:from-rose-400 hover:to-rose-500 
    text-white border border-rose-400/30 
    shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_12px_rgba(244,63,94,0.3)]
  `,
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'secondary',
    shortcut,
    children,
    className = '',
    disabled,
    ...props
  }) => {
  const baseStyles = `
    group inline-flex items-center justify-center gap-1.5 px-3 py-1.5 
    rounded-lg text-xs font-medium cursor-pointer select-none
    transition-all duration-150 ease-out active:scale-[0.97]
    disabled:opacity-40 disabled:pointer-events-none
    [&>svg]:size-3.5 [&>svg]:transition-transform [&>svg]:duration-200
  `;

  return (
      <button
          className={`${baseStyles} ${variantStyles[variant]} ${className}`}
          disabled={disabled}
          {...props}
      >
        {children}
        {shortcut && (
            <kbd className="ml-1 px-1 py-0.2 text-[9px] font-mono rounded bg-black/30 border border-white/10 text-white/70">
              {shortcut}
            </kbd>
        )}
      </button>
  );
};