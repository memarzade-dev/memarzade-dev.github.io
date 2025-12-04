import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { List } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    
    const extractedHeadings = matches.map((match, index) => {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      return { id, text, level };
    });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      }
    );

    const elements = headings.map((heading) => document.getElementById(heading.id));
    elements.forEach((el) => el && observer.observe(el));

    return () => {
      elements.forEach((el) => el && observer.unobserve(el));
    };
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile Toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-24 right-8 z-40 p-4 bg-[rgb(var(--color-bg-subtle))] border border-[rgb(var(--color-border))] rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Table of contents"
      >
        <List className="w-6 h-6" />
      </motion.button>

      {/* Desktop TOC */}
      <motion.aside
        className={`fixed top-32 right-8 w-64 max-h-[calc(100vh-200px)] overflow-y-auto z-30 ${
          isOpen ? 'block' : 'hidden lg:block'
        }`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-[rgb(var(--color-bg-subtle))] border border-[rgb(var(--color-border))] rounded-xl p-6 shadow-lg">
          <h4 className="mb-4 text-sm uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
            On This Page
          </h4>
          <nav>
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}>
                  <button
                    onClick={() => handleClick(heading.id)}
                    className={`text-left text-sm transition-colors hover:text-[rgb(var(--color-primary))] ${
                      activeId === heading.id
                        ? 'text-[rgb(var(--color-primary))] font-semibold'
                        : 'text-[rgb(var(--color-text-muted))]'
                    }`}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
