import React from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

export const CableEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceHandleId,
  selected,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isTrue = sourceHandleId === 'true';
  const isFalse = sourceHandleId === 'false';

  const cableColor = isTrue ? '#10b981' : isFalse ? '#f43f5e' : '#38bdf8';

  return (
    <g className="cable-edge group">

      <path
        d={edgePath}
        fill="none"
        stroke={cableColor}
        strokeWidth={selected ? 8 : 6}
        strokeOpacity={selected ? 0.45 : 0.25}
      />

      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={cableColor}
        strokeWidth={2.5}
        strokeLinecap="round"
      />

      <path
        d={edgePath}
        fill="none"
        stroke="#ffffff"
        strokeWidth={1.5}
        strokeDasharray="4 16"
        strokeOpacity={0.7}
      />
    </g>
  );
};

export default CableEdge;
