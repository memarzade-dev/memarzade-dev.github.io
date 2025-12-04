import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Calendar, Clock } from 'lucide-react';
import { PostCard } from '../components/PostCard';
import { SEO } from '../components/SEO';

const allPosts = [
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
  {
    title: 'Modern React Patterns and Best Practices',
    description: 'Dive deep into React hooks, context, and composition patterns for building robust applications.',
    date: '2024-11-20',
    readTime: 10,
    tags: ['React', 'TypeScript', 'Frontend'],
    slug: 'modern-react-patterns',
  },
  {
    title: 'Mastering Project Management in Tech',
    description: 'Essential strategies and tools for managing software development projects effectively.',
    date: '2024-11-15',
    readTime: 7,
    tags: ['Project Management', 'Agile', 'Leadership'],
    slug: 'project-management-tech',
  },
  {
    title: 'Python for Data Science and Machine Learning',
    description: 'An introduction to using Python libraries like NumPy, Pandas, and TensorFlow for ML projects.',
    date: '2024-11-10',
    readTime: 14,
    tags: ['Python', 'ML', 'Data Science'],
    slug: 'python-data-science',
  },
  {
    title: 'Building RESTful APIs with Node.js and Express',
    description: 'Learn how to create robust, scalable APIs using Node.js, Express, and best practices.',
    date: '2024-11-05',
    readTime: 9,
    tags: ['Node.js', 'Express', 'API'],
    slug: 'nodejs-rest-api',
  },
  {
    title: 'Docker for Developers: A Practical Guide',
    description: 'Master containerization with Docker for consistent development and deployment workflows.',
    date: '2024-10-30',
    readTime: 11,
    tags: ['Docker', 'DevOps', 'Containers'],
    slug: 'docker-practical-guide',
  },
  {
    title: 'TypeScript Advanced Types and Patterns',
    description: 'Explore advanced TypeScript features including generics, utility types, and type guards.',
    date: '2024-10-25',
    readTime: 13,
    tags: ['TypeScript', 'JavaScript', 'Types'],
    slug: 'typescript-advanced',
  },
];

const allTags = Array.from(new Set(allPosts.flatMap(post => post.tags)));

export function BlogList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'readTime'>('date');

  const filteredPosts = allPosts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.readTime - a.readTime;
      }
    });

  return (
    <>
      <SEO
        title="Blog | Memarzade.Dev"
        description="Articles, tutorials, and insights on web development, AI, blockchain, and modern technologies"
      />

      <div className="min-h-screen bg-[rgb(var(--color-bg-base))] py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="mb-4">Blog</h1>
            <p className="text-xl text-[rgb(var(--color-text-muted))]">
              Thoughts, tutorials, and insights on web development and technology
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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[rgb(var(--color-bg-subtle))] border border-[rgb(var(--color-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              />
            </div>

            {/* Tags Filter */}
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

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[rgb(var(--color-text-muted))]">
                <Filter className="w-4 h-4" />
                <span>Sort by:</span>
              </div>
              <button
                onClick={() => setSortBy('date')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  sortBy === 'date'
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-base))] hover:bg-[rgb(var(--color-border))]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Date
              </button>
              <button
                onClick={() => setSortBy('readTime')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                  sortBy === 'readTime'
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'bg-[rgb(var(--color-bg-subtle))] text-[rgb(var(--color-text-base))] hover:bg-[rgb(var(--color-border))]'
                }`}
              >
                <Clock className="w-4 h-4" />
                Read Time
              </button>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            className="max-w-4xl mx-auto mb-6 text-[rgb(var(--color-text-muted))]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
          </motion.div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <PostCard key={post.slug} {...post} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-xl text-[rgb(var(--color-text-muted))]">
                No articles found matching your criteria.
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

          {/* Newsletter CTA */}
          <motion.div
            className="max-w-2xl mx-auto mt-20 p-8 bg-gradient-to-br from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-secondary))]/10 rounded-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="mb-4">Stay Updated</h3>
            <p className="text-[rgb(var(--color-text-muted))] mb-6">
              Get notified when I publish new articles. No spam, unsubscribe anytime.
            </p>
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your.email@example.com"
                className="flex-1 px-4 py-3 bg-[rgb(var(--color-bg-base))] border border-[rgb(var(--color-border))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))]"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
