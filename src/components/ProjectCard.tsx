import { motion } from 'motion/react';
import { ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link, useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  date?: string;
  index: number;
  slug?: string;
}

export function ProjectCard({
  title,
  description,
  image,
  tags,
  demoUrl,
  githubUrl,
  date,
  index,
  slug,
}: ProjectCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (slug) {
      navigate(`/projects/${slug}`);
    }
  };

  return (
    <motion.article
      className="group relative bg-[rgb(var(--color-bg-base))] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-[rgb(var(--color-border))] cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      onClick={handleCardClick}
    >
      <div className="relative h-56 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            {demoUrl && (
              <motion.a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-lg hover:bg-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Live Demo</span>
              </motion.a>
            )}
            {githubUrl && (
              <motion.a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-900/90 text-white rounded-lg hover:bg-gray-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-4 h-4" />
                <span className="text-sm font-medium">Code</span>
              </motion.a>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-3 group-hover:text-[rgb(var(--color-primary))] transition-colors">
          {title}
        </h3>
        
        <p className="text-[rgb(var(--color-text-muted))] mb-4 line-clamp-2">
          {description}
        </p>

        {date && (
          <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))] mb-4">
            <Calendar className="w-4 h-4" />
            <time dateTime={date}>{new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</time>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-base))] rounded-full hover:bg-[rgb(var(--color-primary))] hover:text-white transition-colors cursor-pointer"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--color-primary), 0.1) 0%, transparent 50%)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.article>
  );
}