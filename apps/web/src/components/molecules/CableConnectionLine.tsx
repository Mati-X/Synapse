import React from 'react';
import { ConnectionLineComponentProps, getBezierPath } from '@xyflow/react';

export const CableConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
  fromHandle,
}) => {
  // Cable enters the back of the plug (toX - 52), while the plug pin sits at toX
  const targetCableX = toX - 50;

  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: targetCableX,
    targetY: toY,
    targetPosition: toPosition,
  });

  const handleId = fromHandle?.id;
  const isTrue = handleId === 'true';
  const isFalse = handleId === 'false';

  const cableColor = isTrue ? '#10b981' : isFalse ? '#f43f5e' : '#38bdf8';
  const label = isTrue ? 'TRUE' : isFalse ? 'FALSE' : 'OUT';

  const plugBg = isTrue
    ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 border-emerald-400 text-emerald-100 shadow-[0_0_14px_rgba(16,185,129,0.5)]'
    : isFalse
    ? 'bg-gradient-to-r from-rose-600 to-rose-800 border-rose-400 text-rose-100 shadow-[0_0_14px_rgba(244,63,94,0.5)]'
    : 'bg-gradient-to-r from-sky-600 to-sky-800 border-sky-400 text-sky-100 shadow-[0_0_14px_rgba(56,189,248,0.5)]';

  const pinColor = isTrue ? 'bg-emerald-300' : isFalse ? 'bg-rose-300' : 'bg-amber-200';

  return (
    <g className="cable-connection-line">
      {/* 1. Neon Cable Outer Glow */}
      <path
        fill="none"
        stroke={cableColor}
        strokeWidth={6}
        strokeOpacity={0.25}
        d={edgePath}
      />
      {/* 2. Cable Core Wire */}
      <path
        fill="none"
        stroke={cableColor}
        strokeWidth={2.5}
        strokeDasharray="4 2"
        d={edgePath}
      />

      {/* 3. Vacuum-cleaner Plug Following Cursor (Pin at toX) */}
      <foreignObject
        x={toX - 52}
        y={toY - 11}
        width={56}
        height={24}
        className="overflow-visible pointer-events-none select-none"
      >
        <div
          className={`
            h-5 flex items-center justify-between gap-1 pl-1.5 pr-0.5 rounded-sm border text-[8px] font-mono font-bold tracking-wider uppercase
            shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]
            ${plugBg}
          `}
        >
          <span className="truncate">{label}</span>
          <div className={`w-1 h-3 rounded-xs border border-white/40 shadow-sm shrink-0 ${pinColor}`} />
        </div>
      </foreignObject>
    </g>
  );
};

export default CableConnectionLine;
