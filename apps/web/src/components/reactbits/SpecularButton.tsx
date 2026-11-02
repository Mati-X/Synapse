import React, { useRef, useState } from 'react';

export interface SpecularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'emerald';
  ledColor?: 'amber' | 'sky' | 'emerald' | 'rose';
  shortcut?: string;
  className?: string;
}

const ledStyles = {
  amber: 'bg-amber-400 border-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
  sky: 'bg-sky-400 border-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.8)]',
  emerald: 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.8)]',
  rose: 'bg-rose-400 border-rose-300 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
};

const variantBorders = {
  primary: 'rgba(245, 158, 11, 0.75)',
  emerald: 'rgba(16, 185, 129, 0.75)',
  secondary: 'rgba(56, 189, 248, 0.7)',
};

export const SpecularButton: React.FC<SpecularButtonProps> = ({
  children,
  variant = 'primary',
  ledColor,
  shortcut,
  className = '',
  ...props
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const resolvedLed =
    ledColor || (variant === 'primary' ? 'amber' : variant === 'emerald' ? 'emerald' : 'sky');

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`relative inline-flex items-center justify-center rounded-xl p-[1px] transition-all duration-200 select-none cursor-pointer group ${
        isPressed ? 'scale-[0.97]' : 'hover:-translate-y-0.5'
      } ${className}`}
      style={{
        background: 'rgba(63, 63, 70, 0.75)',
        boxShadow: isHovered
          ? '0 6px 18px rgba(0, 0, 0, 0.75)'
          : '0 4px 12px rgba(0, 0, 0, 0.65)',
      }}
      {...props}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(110px circle at ${coords.x}px ${coords.y}px, ${variantBorders[variant]}, transparent 75%)`,
        }}
      />

      <div
        className={`relative z-10 flex items-center justify-center gap-2.5 rounded-[11px] px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase overflow-hidden transition-colors duration-200 ${
          variant === 'primary'
            ? 'bg-gradient-to-b from-zinc-800 via-zinc-900 to-zinc-950 text-zinc-100'
            : variant === 'emerald'
            ? 'bg-gradient-to-r from-emerald-900 to-emerald-950 text-emerald-100'
            : 'bg-gradient-to-b from-zinc-800/90 to-zinc-950 text-zinc-200'
        }`}
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.12 : 0,
            background: `radial-gradient(90px circle at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.9), transparent 70%)`,
          }}
        />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        {shortcut && (
          <kbd className="relative z-10 px-1.5 py-0.5 text-[9px] font-mono rounded bg-zinc-950/90 border border-zinc-700/80 text-zinc-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
            {shortcut}
          </kbd>
        )}
        <div className={`relative z-10 w-1.5 h-3.5 rounded-xs border shrink-0 ${ledStyles[resolvedLed]}`} />
      </div>
    </button>
  );
};
