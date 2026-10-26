import React from 'react';

export interface CycleAlertProps {
  message: string | null;
  onDismiss: () => void;
}

export const CycleAlert: React.FC<CycleAlertProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div>
      <span>{message}</span>
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
};
