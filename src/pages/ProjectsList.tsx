import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter } from 'lucide-react';
import { ProjectCard } from '../components/ProjectCard';
import { SEO } from '../components/SEO';

const allProjects = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution built with React, Node.js, and Stripe. Features include real-time inventory, payment processing, and admin dashboard.',
    image: 'https://images.unsplash.com/photo-1727407209320-1fa6ae60ee05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NjQ4NTk3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/memarzade-dev',
    date: '2024-11-01',
    slug: 'ecommerce-platform',
  },
  {
    title: 'AI Chat Assistant',
    description: 'Intelligent chatbot powered by GPT-4 API for customer support. Includes sentiment analysis, multi-language support, and conversation history.',
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDF8fHx8MTc2NDgzNzU4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Python', 'OpenAI', 'FastAPI', 'Redis'],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/memarzade-dev',
    date: '2024-10-15',
    slug: 'ai-chat-assistant',
  },
  {
    title: 'Blockchain DApp',
    description: 'Decentralized application for NFT marketplace with smart contracts on Ethereum. Features wallet integration and gas optimization.',
    image: 'https://images.unsplash.com/photo-1666816943035-15c29931e975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjQ4NTYwMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Solidity', 'Web3.js', 'React', 'IPFS'],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/memarzade-dev',
    date: '2024-09-20',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Real-time analytics platform with interactive visualizations. Built for monitoring business metrics and KPIs with customizable widgets.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2NDgzMjk5OHww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['React', 'D3.js', 'TypeScript', 'PostgreSQL'],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/memarzade-dev',
    date: '2024-08-10',
  },
  {
    title: 'Mobile Fitness App',
    description: 'Cross-platform fitness tracking app with workout plans, nutrition tracking, and social features. Built with React Native.',
    image: 'https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY0ODU3OTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['React Native', 'Firebase', 'Redux', 'Node.js'],
    demoUrl: 'https://example.com/demo',
    date: '2024-07-05',
  },
  {
    title: 'SaaS Web Builder',
    description: 'Drag-and-drop website builder with custom component library. Includes hosting, domain management, and SEO tools.',
    image: 'https://images.unsplash.com/photo-1677214467820-ab069619bbb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWIlMjBkZXNpZ258ZW58MXx8fHwxNzY0ODA3NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['React', 'Laravel', 'AWS', 'Docker'],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/memarzade-dev',
    date: '2024-06-12',
  },
  {
    title: 'Task Management System',
    description: 'Collaborative project management tool with kanban boards, time tracking, and team collaboration features.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXNrJTIwbWFuYWdlbWVudHxlbnwxfHx8fDE3NjQ4NTk3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Vue.js', 'Node.js', 'Socket.io', 'MongoDB'],
    demoUrl: 'https://example.com/demo',
    date: '2024-05-20',
  },
  {
    title: 'Weather Forecast App',
    description: 'Beautiful weather application with detailed forecasts, interactive maps, and weather alerts. Supports multiple locations.',
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWF0aGVyJTIwZm9yZWNhc3R8ZW58MXx8fHwxNzY0ODU5Nzg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['React', 'TypeScript', 'OpenWeather API', 'Mapbox'],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/memarzade-dev',
    date: '2024-04-15',
  },
  {
    title: 'Social Media Dashboard',
    description: 'Unified dashboard for managing multiple social media accounts. Schedule posts, track analytics, and engage with audience.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYXxlbnwxfHx8fDE3NjQ4NTk3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['React', 'Python', 'Twitter API', 'Facebook Graph'],
    demoUrl: 'https://example.com/demo',
    date: '2024-03-10',
  },
];

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
