import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Folder, FileText } from 'lucide-react';
import { useState } from 'react';

interface CategoryNode {
  name: string;
  slug: string;
  children?: CategoryNode[];
  postCount?: number;
}

interface SidebarProps {
  categories: CategoryNode[];
  activePath?: string;
}

function CategoryItem({ category, level = 0, activePath }: { category: CategoryNode; level?: number; activePath?: string }) {
  const [isOpen, setIsOpen] = useState(activePath?.includes(category.slug) || false);
  const hasChildren = category.children && category.children.length > 0;
  const isActive = activePath === category.slug;

  return (
    <div className="select-none">
      <motion.div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all group ${
          isActive
            ? 'bg-[rgb(var(--color-primary))] text-white'
            : 'hover:bg-[rgb(var(--color-bg-subtle))]'
        }`}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        whileHover={{ x: 2 }}
      >
        {hasChildren && (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        )}
        {!hasChildren && <div className="w-4" />}
        
        {hasChildren ? (
          <Folder className="w-4 h-4" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        
        <a
          href={`/categories/${category.slug}`}
          className="flex-1 text-sm no-underline"
          onClick={(e) => !hasChildren && e.stopPropagation()}
        >
          {category.name}
        </a>
        
        {category.postCount !== undefined && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isActive
              ? 'bg-white/20'
              : 'bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-muted))]'
          }`}>
            {category.postCount}
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {category.children?.map((child) => (
              <CategoryItem
                key={child.slug}
                category={child}
                level={level + 1}
                activePath={activePath}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar({ categories, activePath }: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-2">
        <h3 className="px-3 mb-4 font-semibold text-sm uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
          Categories
        </h3>
        <nav aria-label="Category navigation">
          {categories.map((category) => (
            <CategoryItem
              key={category.slug}
              category={category}
              activePath={activePath}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}
