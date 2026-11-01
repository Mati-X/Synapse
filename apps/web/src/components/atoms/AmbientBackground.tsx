import React from 'react';
import ambientMeshUrl from '../../assets/ambient-mesh.png';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 bg-[#070709]">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none opacity-50 transform-gpu blur-[24px] scale-105"
        style={{
          backgroundImage: `url(${ambientMeshUrl})`,
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
};
