import React, { useRef, useState } from 'react';

export interface BorderGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  accentRgb?: string;
  glowRadius?: number;
  borderRadius?: string;
}

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  innerClassName = '',
  accentRgb = '56, 189, 248',
  glowRadius = 400,
  borderRadius = '1rem',
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative p-[1px] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 cursor-pointer select-none ${className}`}
      style={{
        borderRadius,
        background: 'rgba(63, 63, 70, 0.75)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7)',
      }}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          borderRadius,
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${glowRadius}px circle at ${coords.x}px ${coords.y}px, rgba(${accentRgb}, 0.75), rgba(${accentRgb}, 0.15) 45%, transparent 75%)`,
        }}
      />

      <div
        className={`relative z-10 h-full w-full bg-gradient-to-b from-zinc-900/85 via-zinc-900/90 to-zinc-950/95 backdrop-blur-2xl overflow-hidden ${innerClassName}`}
        style={{
          borderRadius: `calc(${borderRadius} - 1px)`,
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(${glowRadius * 1.15}px circle at ${coords.x}px ${coords.y}px, rgba(${accentRgb}, 0.08), transparent 70%)`,
          }}
        />
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  );
};
