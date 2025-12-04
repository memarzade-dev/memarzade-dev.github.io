import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface HeroProps {
  name: string;
  titles: string[];
  description: string;
}

export function Hero({ name, titles, description }: HeroProps) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentTitle = titles[titleIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex < currentTitle.length) {
      const timeout = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && charIndex === currentTitle.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(currentTitle.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTitleIndex((titleIndex + 1) % titles.length);
    }
  }, [charIndex, isDeleting, titleIndex, titles]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20" />
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Hi, I'm <span className="gradient-text">{name}</span>{' '}
            <motion.span
              className="wave inline-block"
              animate={{
                rotate: [0, 14, -8, 14, -4, 10, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              👋
            </motion.span>
          </motion.h1>

          <div className="text-2xl md:text-3xl font-medium mb-8 h-10 flex items-center justify-center gap-2">
            <span className="text-[rgb(var(--color-text-base))]">{displayText}</span>
            <span className="typewriter-cursor" />
          </div>

          <motion.p
            className="text-lg text-[rgb(var(--color-text-muted))] mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {description}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.a
              href="#projects"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              className="btn-ghost"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-[rgb(var(--color-primary))] rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-[rgb(var(--color-primary))] rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
