import React, { useEffect, useState, useRef } from 'react';

export interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  animateOn?: 'view' | 'hover';
}

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+~|}{[]:;?><,./-=',
  className = '',
  parentClassName = '',
  animateOn = 'hover',
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const availableChars = useOriginalCharsOnly
    ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
    : characters.split('');

  const shuffleText = (originalText: string, currentRevealed: Set<number>) => {
    return originalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (currentRevealed.has(i)) return originalText[i];
        return availableChars[Math.floor(Math.random() * availableChars.length)];
      })
      .join('');
  };

  const getNextIndex = (revealedSet: Set<number>) => {
    const textLength = text.length;
    switch (revealDirection) {
      case 'start':
        return revealedSet.size;
      case 'end':
        return textLength - 1 - revealedSet.size;
      case 'center': {
        const middle = Math.floor(textLength / 2);
        const offset = Math.floor(revealedSet.size / 2);
        const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset;
        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
          return nextIndex;
        }
        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i;
        }
        return 0;
      }
      default:
        return revealedSet.size;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentIteration = 0;
    const revealed = new Set<number>();

    const shouldAnimate = animateOn === 'view' || (animateOn === 'hover' && isHovering);

    if (shouldAnimate) {
      interval = setInterval(() => {
        if (sequential) {
          if (revealed.size < text.length) {
            const nextIndex = getNextIndex(revealed);
            revealed.add(nextIndex);
            setDisplayText(shuffleText(text, revealed));
          } else {
            clearInterval(interval);
          }
        } else {
          setDisplayText(shuffleText(text, revealed));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            setDisplayText(text);
          }
        }
      }, speed);
    } else {
      setDisplayText(text);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, animateOn]);

  useEffect(() => {
    if (animateOn !== 'view') return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsHovering(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 0.1 });
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [animateOn]);

  return (
    <span
      ref={containerRef}
      className={`inline-block cursor-default ${parentClassName}`}
      onMouseEnter={() => animateOn === 'hover' && setIsHovering(true)}
      onMouseLeave={() => animateOn === 'hover' && setIsHovering(false)}
    >
      <span className={className}>{displayText}</span>
    </span>
  );
};
