import { motion } from 'motion/react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 flex-wrap text-sm">
        <li>
          <motion.a
            href="/"
            className="flex items-center gap-1 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
            whileHover={{ scale: 1.05 }}
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </motion.a>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-[rgb(var(--color-text-muted))]" />
            {index === items.length - 1 ? (
              <span className="text-[rgb(var(--color-text-base))] font-medium">
                {item.label}
              </span>
            ) : (
              <motion.a
                href={item.href}
                className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
              </motion.a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
