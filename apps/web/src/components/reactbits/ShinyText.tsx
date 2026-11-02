import React from 'react';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  return (
    <span
      className={`inline-block text-transparent bg-clip-text bg-[linear-gradient(110deg,#d4d4d8,45%,#f59e0b,55%,#d4d4d8)] bg-[length:250%_100%] ${
        !disabled ? 'animate-shine' : ''
      } ${className}`}
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
};
