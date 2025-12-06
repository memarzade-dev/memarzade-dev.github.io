import { Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface TagData {
  name: string;
  count: number;
  slug: string;
}

interface TagsCloudProps {
  tags: TagData[];
  maxTags?: number;
}

export function TagsCloud({ tags, maxTags = 30 }: TagsCloudProps) {
  const sortedTags = [...tags]
    .sort((a, b) => b.count - a.count)
    .slice(0, maxTags);

  const maxCount = Math.max(...sortedTags.map((t) => t.count));
  const minCount = Math.min(...sortedTags.map((t) => t.count));

  const getFontSize = (count: number) => {
    const ratio = (count - minCount) / (maxCount - minCount || 1);
    return 0.875 + ratio * 1.5;
  };

  const getColor = (count: number) => {
    const ratio = (count - minCount) / (maxCount - minCount || 1);
    const hue = 220 + ratio * 40;
    return `hsl(${hue}, 70%, 55%)`;
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="inline-flex items-center gap-2 mb-4">
            <Tag className="w-8 h-8 text-[rgb(var(--color-primary))]" />
            Popular Tags
          </h2>
          <p className="text-[rgb(var(--color-text-muted))]">
            Explore content by topic
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {sortedTags.map((tag, index) => (
            <motion.a
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="inline-block px-4 py-2 rounded-full bg-[rgb(var(--color-bg-subtle))] hover:shadow-lg transition-all relative group"
              style={{
                fontSize: `${getFontSize(tag.count)}rem`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{
                scale: 1.1,
                backgroundColor: getColor(tag.count),
                color: '#ffffff',
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">{tag.name}</span>
              <span className="ml-2 text-xs opacity-70">({tag.count})</span>
              
              <motion.div
                className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: getColor(tag.count) }}
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
