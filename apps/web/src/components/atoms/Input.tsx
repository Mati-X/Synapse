import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
    error = false,
    className = '',
    disabled,
    ...props
  }) => {
  const baseStyles = `
    w-full px-3 py-1.5 rounded-lg text-xs font-mono
    bg-zinc-950/80 text-zinc-100 placeholder:text-zinc-600
    border transition-all duration-150 ease-out
    shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.6)]
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

  const stateStyles = error
      ? 'border-rose-500/80 text-rose-200 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/40'
      : 'border-zinc-800/80 hover:border-zinc-700 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/40 focus:shadow-[0_0_10px_rgba(99,102,241,0.2)]';

  return (
      <input
          className={`${baseStyles} ${stateStyles} ${className}`}
          disabled={disabled}
          {...props}
      />
  );
};