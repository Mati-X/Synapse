import React from 'react';

export interface StarBorderProps {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'button',
  className = '',
  color = '#f59e0b',
  speed = '6s',
  children,
  onClick,
  ...rest
}) => {
  return (
    <Component
      onClick={onClick}
      className={`relative inline-block py-[1px] overflow-hidden rounded-xl group cursor-pointer ${className}`}
      {...rest}
    >
      <div
        className="absolute w-[300%] h-[50%] opacity-80 bottom-[-11px] right-[-250%] rounded-full animate-star-bottom pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 15%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-80 top-[-10px] left-[-250%] rounded-full animate-star-top pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 15%)`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </Component>
  );
};
