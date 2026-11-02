import React, { useRef, useState, useEffect } from 'react';

export interface LineSidebarItem {
  id: string;
  label: string;
  code?: string;
  variant?: 'sky' | 'amber' | 'emerald' | 'rose';
}

export interface LineSidebarProps {
  items: LineSidebarItem[];
  className?: string;
  proximityRadius?: number;
}

const pinColors = {
  sky: 'bg-sky-400 border-sky-300 shadow-[0_0_6px_rgba(56,189,248,0.8)]',
  amber: 'bg-amber-400 border-amber-300 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
  emerald: 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(16,185,129,0.8)]',
  rose: 'bg-rose-400 border-rose-300 shadow-[0_0_6px_rgba(244,63,94,0.8)]',
};

export const LineSidebar: React.FC<LineSidebarProps> = ({
  items,
  className = '',
  proximityRadius = 115,
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollMid = window.scrollY + window.innerHeight * 0.35;
      let current = items[0]?.id || '';

      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollMid >= top) {
            current = item.id;
          }
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMouseY(e.clientY);
  };

  const handleMouseLeave = () => {
    setMouseY(null);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <div
      ref={navRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`fixed left-0 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-1.5 py-3 pr-3 select-none ${className}`}
    >
      {items.map((item, idx) => {
        let proximity = 0;
        const btn = itemRefs.current[idx];
        if (mouseY !== null && btn) {
          const rect = btn.getBoundingClientRect();
          const itemCenterY = rect.top + rect.height / 2;
          const dist = Math.abs(mouseY - itemCenterY);
          if (dist < proximityRadius) {
            const norm = 1 - dist / proximityRadius;
            proximity = norm * norm * (3 - 2 * norm);
          }
        }

        const isActive = activeId === item.id;
        const variant = item.variant || 'sky';
        const translateX = Math.round((isActive ? 0 : -4) + proximity * 10);
        const lineWidth = Math.round((isActive ? 22 : 10) + proximity * 20);

        return (
          <button
            key={item.id}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            onClick={() => scrollToSection(item.id)}
            className="group relative flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
            style={{
              transform: `translateX(${translateX}px)`,
              transition:
                mouseY === null ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
            }}
          >
            <div
              className={`flex items-center justify-between h-[26px] pl-2.5 pr-1.5 rounded-r-lg border-y border-r border-l-0 bg-zinc-950/95 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] transition-colors ${
                isActive || proximity > 0.4 ? 'border-zinc-600/90' : 'border-zinc-800/90'
              }`}
            >
              <div className="flex items-center gap-2 pr-2">
                <span
                  className="h-[2px] rounded-full transition-all duration-150"
                  style={{
                    width: `${lineWidth}px`,
                    backgroundColor:
                      isActive || proximity > 0.45
                        ? '#38bdf8'
                        : proximity > 0.15
                        ? '#a1a1aa'
                        : '#3f3f46',
                  }}
                />
                <span
                  className={`text-[9px] font-mono font-bold tracking-wider uppercase ${
                    isActive || proximity > 0.4 ? 'text-zinc-100' : 'text-zinc-500'
                  }`}
                >
                  {item.code || `0${idx + 1}`}
                </span>
              </div>

              <div
                className={`w-1.5 h-3.5 rounded-xs border shrink-0 transition-opacity ${
                  isActive || proximity > 0.35
                    ? pinColors[variant]
                    : 'bg-zinc-800 border-zinc-700 opacity-50'
                }`}
              />
            </div>

            <span
              className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-200 bg-zinc-900/90 border border-zinc-700/70 px-2 py-0.5 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] pointer-events-none whitespace-nowrap"
              style={{
                opacity: isActive ? Math.max(0.85, proximity) : proximity > 0.2 ? proximity : 0,
                transform: `translateX(${Math.round(proximity * 4)}px)`,
                transition:
                  mouseY === null ? 'opacity 0.2s ease, transform 0.2s ease' : 'none',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
