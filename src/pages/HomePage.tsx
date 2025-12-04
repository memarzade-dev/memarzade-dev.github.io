import { motion } from 'motion/react';
import { Hero } from '../components/Hero';
import { TagsCloud } from '../components/TagsCloud';
import { PostCard } from '../components/PostCard';
import { ProjectCard } from '../components/ProjectCard';
import { GraphView } from '../components/GraphView';
import { SkillsSection } from '../components/SkillsSection';
import { Timeline } from '../components/Timeline';
import { Testimonials } from '../components/Testimonials';
import { ContactForm } from '../components/ContactForm';

const titles = [
  'Full-Stack Developer',
  'Laravel Specialist',
  'Python and AI L.L.M Coder',
  'App Designer and Developer',
  'Project Manager',
  'Blockchain Developer',
  'Blockchain Enthusiast',
  'Nature Explorer',
];

const sampleTags = [
  { name: 'React', count: 24, slug: 'react' },
  { name: 'TypeScript', count: 20, slug: 'typescript' },
  { name: 'Laravel', count: 18, slug: 'laravel' },
  { name: 'Python', count: 16, slug: 'python' },
  { name: 'AI & ML', count: 15, slug: 'ai-ml' },
  { name: 'Blockchain', count: 12, slug: 'blockchain' },
  { name: 'Web3', count: 10, slug: 'web3' },
  { name: 'Node.js', count: 14, slug: 'nodejs' },
  { name: 'Docker', count: 8, slug: 'docker' },
  { name: 'AWS', count: 7, slug: 'aws' },
];

const samplePosts = [
  {
    title: 'Building Scalable Web Applications with Laravel',
    description: 'Exploring best practices for creating maintainable and scalable Laravel applications with modern architecture patterns.',
    date: '2024-12-01',
    readTime: 8,
    tags: ['Laravel', 'PHP', 'Architecture'],
    slug: 'laravel-scalable-apps',
  },
  {
    title: 'AI-Powered Development: Using LLMs for Code Generation',
    description: 'How Large Language Models are transforming the way we write code and boost developer productivity.',
    date: '2024-11-28',
    readTime: 12,
    tags: ['AI', 'Python', 'LLM'],
    slug: 'ai-code-generation',
  },
  {
    title: 'Understanding Blockchain Fundamentals',
    description: 'A comprehensive guide to blockchain technology, smart contracts, and decentralized applications.',
    date: '2024-11-25',
    readTime: 15,
    tags: ['Blockchain', 'Web3', 'Smart Contracts'],
    slug: 'blockchain-fundamentals',
  },
];

const sampleProjects = [
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
];

const graphData = {
  nodes: [
    { id: 'react', label: 'React', group: 'frontend' },
    { id: 'typescript', label: 'TypeScript', group: 'language' },
    { id: 'laravel', label: 'Laravel', group: 'backend' },
    { id: 'python', label: 'Python', group: 'language' },
    { id: 'ai', label: 'AI & ML', group: 'tech' },
    { id: 'blockchain', label: 'Blockchain', group: 'tech' },
    { id: 'nodejs', label: 'Node.js', group: 'backend' },
    { id: 'docker', label: 'Docker', group: 'devops' },
  ],
  edges: [
    { from: 'react', to: 'typescript' },
    { from: 'typescript', to: 'nodejs' },
    { from: 'laravel', to: 'python' },
    { from: 'python', to: 'ai' },
    { from: 'blockchain', to: 'nodejs' },
    { from: 'docker', to: 'nodejs' },
    { from: 'docker', to: 'laravel' },
  ],
};

export function HomePage() {
  return (
    <>
      <Hero
        name="Ali Memarzade"
        titles={titles}
        description="A passionate Full-Stack Developer specializing in modern web technologies. I build exceptional digital experiences that are fast, accessible, and visually appealing."
      />

      <section id="about" className="py-20 bg-[rgb(var(--color-bg-subtle))]">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6">About Me</h2>
            <p className="text-lg text-[rgb(var(--color-text-muted))] mb-8">
              I'm a versatile developer with expertise spanning full-stack web development, 
              blockchain technology, AI integration, and project management. With years of 
              experience in Laravel, Python, React, and emerging technologies, I bring ideas 
              to life through clean code and innovative solutions.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { number: '50+', label: 'Projects Completed' },
                { number: '5+', label: 'Years Experience' },
                { number: '20+', label: 'Technologies' },
                { number: '100%', label: 'Client Satisfaction' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="p-6 bg-[rgb(var(--color-bg-base))] rounded-xl shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-sm text-[rgb(var(--color-text-muted))]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <SkillsSection />

      <Timeline />

      <section id="blog" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4">Latest Articles</h2>
            <p className="text-lg text-[rgb(var(--color-text-muted))]">
              Thoughts, tutorials, and insights on web development and technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {samplePosts.map((post, index) => (
              <PostCard key={post.slug} {...post} index={index} />
            ))}
          </div>

          <div className="text-center">
            <motion.a
              href="/blog"
              className="btn-primary inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Articles
            </motion.a>
          </div>
        </div>
      </section>

      <TagsCloud tags={sampleTags} />

      <section id="knowledge-graph" className="py-20 bg-[rgb(var(--color-bg-subtle))]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4">Knowledge Graph</h2>
            <p className="text-lg text-[rgb(var(--color-text-muted))]">
              Explore the interconnected web of my technical expertise
            </p>
          </motion.div>

          <GraphView nodes={graphData.nodes} edges={graphData.edges} />
        </div>
      </section>

      <section id="projects" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4">Featured Projects</h2>
            <p className="text-lg text-[rgb(var(--color-text-muted))]">
              A selection of my recent and notable projects
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {sampleProjects.map((project, index) => (
              <ProjectCard key={project.title} {...project} index={index} />
            ))}
          </div>

          <div className="text-center">
            <motion.a
              href="/projects"
              className="btn-primary inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Projects
            </motion.a>
          </div>
        </div>
      </section>

      <Testimonials />

      <section id="contact" className="py-20 bg-[rgb(var(--color-bg-subtle))]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4">Get In Touch</h2>
            <p className="text-lg text-[rgb(var(--color-text-muted))] mb-8">
              Have a project in mind or want to collaborate? I'd love to hear from you!
            </p>
          </motion.div>

          <ContactForm />

          <motion.div
            className="flex flex-wrap gap-6 justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.a
              href="mailto:contact@memarzade.dev"
              className="btn-ghost inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Direct Email
            </motion.a>
            <motion.a
              href="https://github.com/memarzade-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              GitHub
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/ali-memarzade"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              LinkedIn
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
