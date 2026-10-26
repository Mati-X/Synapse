import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
                                                options,
                                                value,
                                                onChange,
                                                placeholder = 'Select...',
                                                className = '',
                                                disabled = false,
                                              }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange?.({ target: { value: val } });
    setIsOpen(false);
  };

  return (
      <div ref={containerRef} className={`relative w-full select-none ${className}`}>
        <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`
          w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium cursor-pointer
          transition-all duration-150 ease-out active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed
          bg-gradient-to-b from-zinc-800/90 to-zinc-900 
          hover:from-zinc-700/90 hover:to-zinc-800 
          text-zinc-200 border border-zinc-700/70 
          shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.4)]
          ${isOpen ? 'rounded-t-lg rounded-b-none border-b-zinc-800' : 'rounded-lg'}
        `}
        >
        <span className={selectedOption ? 'text-zinc-100 font-semibold' : 'text-zinc-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
          <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ease-out ${
                  isOpen ? 'rotate-180 text-indigo-400' : ''
              }`}
          />
        </button>

        <div
            className={`
          absolute top-full left-0 w-full z-50 overflow-hidden
          transition-all duration-200 ease-out origin-top
          ${isOpen
                ? 'max-h-60 opacity-100 translate-y-0 shadow-2xl'
                : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none'
            }
        `}
        >
          <div className="p-1 rounded-b-lg bg-zinc-900 border-x border-b border-zinc-700/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                  <div
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`
                  flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs
                  cursor-pointer transition-colors duration-100
                  ${isSelected
                          ? 'bg-indigo-600/25 text-indigo-300 font-semibold border border-indigo-500/30'
                          : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                      }
                `}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
              );
            })}
          </div>
        </div>
      </div>
  );
};