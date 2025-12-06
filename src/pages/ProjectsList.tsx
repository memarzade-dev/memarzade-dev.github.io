import { Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import { ProjectCard } from '../components/ProjectCard';
import { SEO } from '../components/SEO';
import { parseFrontMatter } from '@/utils/frontMatter';

const files = import.meta.glob('../data/projects/*.md', { query: '?raw', import: 'default', eager: true });

const allProjects = Object.entries(files).map(([path, raw]) => {
  const slug = path.split('/').pop()!.replace('.md', '');
  const text = String(raw);
  const { data, body } = parseFrontMatter(text);
  const title = data.title || ((body.match(/^#\s+(.+)$/m) || [])[1] ?? slug);
  const description = data.description || body.split('\n').find((l) => l.trim() && !l.startsWith('#')) || '';
  return {
    title,
    description,
    image: data.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tags: (data.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    demoUrl: data.demoUrl,
    githubUrl: data.githubUrl,
    date: data.date || new Date().toISOString().slice(0, 10),
    slug,
  };
});

const allTags = Array.from(new Set(allProjects.flatMap(project => project.tags)));

export function ProjectsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || project.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <>
      <SEO
        title="Projects | Memarzade.Dev"
        description="Portfolio of web development projects including e-commerce platforms, AI applications, blockchain DApps, and more"
      />

      <div className="min-h-screen bg-[rgb(var(--color-bg-base))] py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="mb-4">Projects</h1>
            <p className="text-xl text-[rgb(var(--color-text-muted))]">
              A collection of my recent work and notable projects
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="max-w-4xl mx-auto mb-12 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--color-text-muted))]" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[rgb(var(--color-bg-subtle))] border border-[rgb(var(--color-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              />
            </div>

            {/* Tags Filter */}
            <div>
              <div className="flex items-center gap-2 mb-3 text-[rgb(var(--color-text-muted))]">
                <Filter className="w-4 h-4" />
                <span>Filter by technology:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    !selectedTag
                      ? 'bg-[rgb(var(--color-primary))] text-white'
                      : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-base))] hover:bg-[rgb(var(--color-border))]'
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${
                      selectedTag === tag
                        ? 'bg-[rgb(var(--color-primary))] text-white'
                        : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-base))] hover:bg-[rgb(var(--color-border))]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            className="max-w-4xl mx-auto mb-6 text-[rgb(var(--color-text-muted))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
          </motion.div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.title} {...project} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-xl text-[rgb(var(--color-text-muted))]">
                No projects found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
                className="btn-primary mt-6"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            className="max-w-2xl mx-auto mt-20 p-8 bg-gradient-to-br from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-secondary))]/10 rounded-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4">Have a Project in Mind?</h3>
            <p className="text-[rgb(var(--color-text-muted))] mb-6">
              Let's collaborate and bring your ideas to life. I'm always open to discussing new projects and opportunities.
            </p>
            <a href="/#contact" className="btn-primary">
              Get in Touch
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
}
