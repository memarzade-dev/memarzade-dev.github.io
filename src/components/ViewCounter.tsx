import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
  type: 'post' | 'project';
}

export function ViewCounter({ slug, type }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would fetch from an API
    const fetchViews = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get views from localStorage (for demo purposes)
        const storageKey = `views_${type}_${slug}`;
        const storedViews = localStorage.getItem(storageKey);
        let currentViews = storedViews ? parseInt(storedViews, 10) : Math.floor(Math.random() * 1000) + 100;
        
        // Increment view count
        currentViews += 1;
        localStorage.setItem(storageKey, currentViews.toString());
        
        setViews(currentViews);
      } catch (error) {
        console.error('Failed to fetch views:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchViews();
  }, [slug, type]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[rgb(var(--color-text-muted))]">
        <Eye className="w-4 h-4" />
        <span className="text-sm">---</span>
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center gap-2 text-[rgb(var(--color-text-muted))]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Eye className="w-4 h-4" />
      <motion.span
        className="text-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {views?.toLocaleString()} views
      </motion.span>
    </motion.div>
  );
}
