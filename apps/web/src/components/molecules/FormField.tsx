import React from 'react';

export interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  helperText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  helperText,
}) => {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-medium text-zinc-300">{label}</label>
      </div>
      <div>{children}</div>
      {helperText && <span className="text-[10px] font-mono text-zinc-500">{helperText}</span>}
    </div>
  );
};
