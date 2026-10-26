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
    <div>
      <label>{label}</label>
      {children}
      {helperText && <span>{helperText}</span>}
    </div>
  );
};
