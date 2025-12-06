import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

import { Typography } from './Typography';


interface PostCardProps {
  title: string;
  description: string;
  date: string;
  readTime?: number;
  tags?: string[];
  slug: string;
  index?: number;
}

export function PostCard({
  title,
  description,
  date,
  readTime,
  tags = [],
  slug,
  index = 0,
}: PostCardProps) {
  return (
    <motion.article
      className="group relative bg-[rgb(var(--color-bg-base))] border border-[rgb(var(--color-border))] rounded-xl p-6 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(var(--color-primary))]/5 to-[rgb(var(--color-secondary))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 text-sm text-[rgb(var(--color-text-muted))] mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          {readTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </span>
          )}
        </div>

        <Typography variant="h3" className="mb-3 group-hover:gradient-text transition-all">
          <Link to={`/blog/${slug}`} className="no-underline">
            {title}
          </Link>
        </Typography>

        <Typography variant="p" className="text-[rgb(var(--color-text-muted))] mb-4 line-clamp-3">
          {description}
        </Typography>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[rgb(var(--color-bg-subtle))] rounded-full text-sm text-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all cursor-pointer"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 bg-[rgb(var(--color-bg-subtle))] rounded-full text-sm text-[rgb(var(--color-text-muted))]">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <motion.a
          href={`/blog/${slug}`}
          className="inline-flex items-center gap-2 text-[rgb(var(--color-primary))] font-medium group/link"
          whileHover={{ x: 4 }}
        >
          Read more
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </motion.a>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[rgb(var(--color-primary))]/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
    </motion.article>
  );
}