import { motion } from 'motion/react';
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/memarzade-dev', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/memarzade', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com/memarzade', label: 'Twitter' },
    { icon: Mail, href: 'mailto:contact@memarzade.dev', label: 'Email' },
  ];

  return (
    <footer className="relative mt-20 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-subtle))]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--color-primary))] to-transparent" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold gradient-text">Memarzade.Dev</h3>
            <p className="text-[rgb(var(--color-text-muted))] text-sm">
              Building exceptional digital experiences with modern web technologies.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'About', 'Projects', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[rgb(var(--color-bg-base))] hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[rgb(var(--color-border))] text-center text-sm text-[rgb(var(--color-text-muted))]">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>© {currentYear} Ali Memarzade. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Made with{' '}
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </motion.span>{' '}
              using React & TypeScript
            </span>
          </p>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgb(var(--color-primary))] via-[rgb(var(--color-secondary))] to-[rgb(var(--color-accent))]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        viewport={{ once: true }}
      />
    </footer>
  );
}
