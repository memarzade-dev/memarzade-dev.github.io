import { motion, useScroll, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  estimatedReadTime?: number;
}

export function ProgressBar({ estimatedReadTime }: ProgressBarProps) {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateAria = () => {
      const progress = Math.round(scrollYProgress.get() * 100);
      const announcer = document.getElementById('progress-announcer');
      if (announcer && progress % 25 === 0 && progress > 0) {
        announcer.textContent = `Page ${progress}% scrolled`;
      }
    };

    const unsubscribe = scrollYProgress.on('change', updateAria);
    return () => unsubscribe();
  }, [scrollYProgress, mounted]);

  if (!mounted) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 h-1">
        <motion.div
          className="h-full bg-gradient-to-r from-[rgb(var(--color-primary))] via-[rgb(var(--color-secondary))] to-[rgb(var(--color-accent))] origin-left"
          style={{ scaleX }}
        />
      </div>

      {estimatedReadTime && (
        <motion.div
          className="fixed bottom-8 right-8 glass p-4 rounded-full shadow-lg hidden lg:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-center">
            <div className="font-semibold text-[rgb(var(--color-primary))]">
              {estimatedReadTime} min
            </div>
            <div className="text-xs text-[rgb(var(--color-text-muted))]">read time</div>
          </div>
        </motion.div>
      )}

      <div
        id="progress-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
    </>
  );
}
