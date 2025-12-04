import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Tag, ArrowLeft, ExternalLink, Github, CheckCircle } from 'lucide-react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { ShareButtons } from '../components/ShareButtons';
import { SEO } from '../components/SEO';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { ViewCounter } from '../components/ViewCounter';
import { TableOfContents } from '../components/TableOfContents';

interface ProjectDetailData {
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  date: string;
  longDescription: string;
  challenges: string[];
  solutions: string[];
  technologies: { name: string; purpose: string }[];
  features: string[];
  outcomes: { label: string; value: string }[];
  gallery?: string[];
}

// Sample project data
const projects: Record<string, ProjectDetailData> = {
  'ecommerce-platform': {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution built with React, Node.js, and Stripe.',
    image: 'https://images.unsplash.com/photo-1727407209320-1fa6ae60ee05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NjQ4NTk3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/memarzade-dev',
    date: '2024-11-01',
    longDescription: 'A comprehensive e-commerce platform designed to handle high-volume transactions with real-time inventory management, secure payment processing, and an intuitive admin dashboard. Built with modern web technologies and following best practices for scalability and security.',
    challenges: [
      'Handling concurrent transactions and inventory updates',
      'Implementing secure payment processing with PCI compliance',
      'Creating a responsive design that works across all devices',
      'Optimizing performance for large product catalogs',
    ],
    solutions: [
      'Implemented optimistic locking and transaction management',
      'Integrated Stripe with webhook handling for payment confirmations',
      'Used CSS Grid and Flexbox with mobile-first approach',
      'Added Redis caching and database indexing strategies',
    ],
    technologies: [
      { name: 'React', purpose: 'Frontend framework for building the user interface' },
      { name: 'Node.js & Express', purpose: 'Backend API and business logic' },
      { name: 'MongoDB', purpose: 'Document database for flexible product schemas' },
      { name: 'Stripe', purpose: 'Payment processing and subscription management' },
      { name: 'Redis', purpose: 'Caching and session management' },
      { name: 'AWS S3', purpose: 'Image storage and CDN delivery' },
    ],
    features: [
      'Real-time inventory tracking',
      'Secure payment processing with Stripe',
      'Advanced product filtering and search',
      'Shopping cart with persistent storage',
      'Order tracking and notifications',
      'Admin dashboard with analytics',
      'Customer reviews and ratings',
      'Wishlist functionality',
      'Multi-currency support',
      'Email notifications',
    ],
    outcomes: [
      { label: 'Performance Score', value: '95/100' },
      { label: 'Daily Transactions', value: '1000+' },
      { label: 'Page Load Time', value: '<2s' },
      { label: 'Uptime', value: '99.9%' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1727407209320-1fa6ae60ee05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY29tbWVyY2UlMjBzaG9wcGluZ3xlbnwxfHx8fDE3NjQ4NTk3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGNhcnR8ZW58MXx8fHwxNzY0ODU5Nzg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXltZW50JTIwY2FyZHxlbnwxfHx8fDE3NjQ4NTk3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
  },
  'ai-chat-assistant': {
    title: 'AI Chat Assistant',
    description: 'Intelligent chatbot powered by GPT-4 API for customer support.',
    image: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDF8fHx8MTc2NDgzNzU4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: ['Python', 'OpenAI', 'FastAPI', 'Redis'],
    demoUrl: 'https://example.com/demo',
    githubUrl: 'https://github.com/memarzade-dev',
    date: '2024-10-15',
    longDescription: 'An advanced AI-powered chatbot that provides intelligent customer support with natural language understanding, sentiment analysis, and multi-language support. Built with GPT-4 and modern Python frameworks.',
    challenges: [
      'Managing conversation context across multiple interactions',
      'Handling rate limits and API costs efficiently',
      'Ensuring response quality and relevance',
      'Supporting multiple languages seamlessly',
    ],
    solutions: [
      'Implemented Redis-based conversation memory with sliding windows',
      'Added intelligent caching and response streaming',
      'Created custom prompt engineering templates',
      'Integrated translation APIs and language detection',
    ],
    technologies: [
      { name: 'Python', purpose: 'Core programming language' },
      { name: 'FastAPI', purpose: 'High-performance web framework' },
      { name: 'OpenAI GPT-4', purpose: 'Natural language processing and generation' },
      { name: 'Redis', purpose: 'Conversation history and caching' },
      { name: 'PostgreSQL', purpose: 'Persistent data storage' },
      { name: 'Docker', purpose: 'Containerization and deployment' },
    ],
    features: [
      'Natural language understanding',
      'Contextual conversation memory',
      'Sentiment analysis',
      'Multi-language support (10+ languages)',
      'Custom knowledge base integration',
      'Conversation history and analytics',
      'Response streaming for better UX',
      'Fallback to human agents',
      'API integration capabilities',
      'Rate limiting and cost optimization',
    ],
    outcomes: [
      { label: 'Response Time', value: '<500ms' },
      { label: 'Accuracy', value: '92%' },
      { label: 'Languages Supported', value: '10+' },
      { label: 'Cost Reduction', value: '60%' },
    ],
  },
};

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (slug && projects[slug]) {
          setProject(projects[slug]);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage
          message={error || 'Project not found'}
          onRetry={() => navigate('/projects')}
          fullScreen
        />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${project.title} | Memarzade.Dev`}
        description={project.description}
      />

      <div className="min-h-screen bg-[rgb(var(--color-bg-base))] py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] mb-8 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </motion.button>

          {/* Hero Image */}
          <motion.div
            className="relative h-[400px] rounded-2xl overflow-hidden mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>

          {/* Header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="mb-4">{project.title}</h1>
            <p className="text-xl text-[rgb(var(--color-text-muted))] mb-6">
              {project.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-[rgb(var(--color-text-muted))]">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}</span>
              </div>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View Code
                </a>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-base))] rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="mb-4">Overview</h2>
                <p className="text-[rgb(var(--color-text-muted))] leading-relaxed">
                  {project.longDescription}
                </p>
              </motion.section>

              {/* Challenges & Solutions */}
              <motion.section
                className="grid md:grid-cols-2 gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div>
                  <h3 className="mb-4">Challenges</h3>
                  <ul className="space-y-3">
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className="flex gap-3 text-[rgb(var(--color-text-muted))]">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4">Solutions</h3>
                  <ul className="space-y-3">
                    {project.solutions.map((solution, index) => (
                      <li key={index} className="flex gap-3 text-[rgb(var(--color-text-muted))]">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.section>

              {/* Features */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="mb-4">Key Features</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {project.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-[rgb(var(--color-bg-subtle))] rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-[rgb(var(--color-primary))] flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="mb-4">Gallery</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.gallery.map((image, index) => (
                      <motion.div
                        key={index}
                        className="relative h-64 rounded-lg overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={image}
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Technologies */}
              <motion.div
                className="sticky top-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-[rgb(var(--color-bg-subtle))] rounded-xl p-6">
                  <h3 className="mb-4">Technologies</h3>
                  <div className="space-y-4">
                    {project.technologies.map((tech, index) => (
                      <div key={index}>
                        <h4 className="font-semibold text-[rgb(var(--color-text-base))] mb-1">
                          {tech.name}
                        </h4>
                        <p className="text-sm text-[rgb(var(--color-text-muted))]">
                          {tech.purpose}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div className="bg-[rgb(var(--color-bg-subtle))] rounded-xl p-6 mt-8">
                  <h3 className="mb-4">Outcomes</h3>
                  <div className="space-y-4">
                    {project.outcomes.map((outcome, index) => (
                      <div key={index} className="text-center p-4 bg-[rgb(var(--color-bg-base))] rounded-lg">
                        <div className="text-2xl font-bold gradient-text mb-1">
                          {outcome.value}
                        </div>
                        <div className="text-sm text-[rgb(var(--color-text-muted))]">
                          {outcome.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <ShareButtons
        url={`https://vaults.memarzade.dev/projects/${slug}`}
        title={project.title}
        description={project.description}
      />
    </>
  );
}