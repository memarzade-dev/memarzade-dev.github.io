import { ReactNode, useEffect, useRef } from 'react';

import { detectDirection } from '../utils/rtlDetect';

interface TypographyProps {
  children: ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  autoDir?: boolean;
}

export function Typography({ children, variant = 'p', className = '', autoDir = true }: TypographyProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (autoDir && ref.current) {
      const text = ref.current.textContent || '';
      const dir = detectDirection(text);
      ref.current.setAttribute('dir', dir);
      if (dir === 'rtl') {
        ref.current.classList.add('rtl');
      } else {
        ref.current.classList.remove('rtl');
      }
    }
  }, [children, autoDir]);

  const Tag = variant;

  return (
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
