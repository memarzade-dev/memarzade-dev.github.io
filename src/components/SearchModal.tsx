import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, FileText, Tag, Calendar, ArrowRight } from 'lucide-react';

interface SearchResult {
  type: 'post' | 'project' | 'tag';
  title: string;
  description?: string;
  url: string;
  tags?: string[];
  date?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock search data - in a real app, this would come from an API or search index
const mockSearchData: SearchResult[] = [
  {
    type: 'post',
    title: 'Building Scalable Web Applications with Laravel',
    description: 'Exploring best practices for creating maintainable and scalable Laravel applications...',
    url: '/blog/laravel-scalable-apps',
    tags: ['Laravel', 'PHP', 'Architecture'],
    date: '2024-12-01',
  },
  {
    type: 'post',
    title: 'AI-Powered Development: Using LLMs for Code Generation',
    description: 'How Large Language Models are transforming the way we write code...',
    url: '/blog/ai-code-generation',
    tags: ['AI', 'Python', 'LLM'],
    date: '2024-11-28',
  },
  {
    type: 'project',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with React, Node.js, and Stripe integration',
    url: '/projects/ecommerce-platform',
    tags: ['React', 'Node.js', 'Stripe'],
  },
  {
    type: 'project',
    title: 'AI Chat Assistant',
    description: 'Intelligent chatbot powered by GPT-4 for customer support',
    url: '/projects/ai-chat-assistant',
    tags: ['Python', 'AI', 'OpenAI'],
  },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = mockSearchData.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description?.toLowerCase().includes(lowercaseQuery) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );

    setResults(filtered);
    setSelectedIndex(0);
  }, []);

  // Handle search input
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, performSearch]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        window.location.href = results[selectedIndex].url;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <FileText className="w-5 h-5" />;
      case 'project':
        return <Tag className="w-5 h-5" />;
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-full max-w-2xl bg-[rgb(var(--color-bg-base))] rounded-2xl shadow-2xl border border-[rgb(var(--color-border))] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-4 p-6 border-b border-[rgb(var(--color-border))]">
                <Search className="w-6 h-6 text-[rgb(var(--color-text-muted))]" />
                <input
                  type="text"
                  placeholder="Search articles, projects, and more..."
                  className="flex-1 bg-transparent outline-none text-lg text-[rgb(var(--color-text-base))] placeholder:text-[rgb(var(--color-text-muted))]"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[rgb(var(--color-bg-subtle))] rounded-lg transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query && results.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[rgb(var(--color-bg-subtle))] mb-4">
                      <Search className="w-8 h-8 text-[rgb(var(--color-text-muted))]" />
                    </div>
                    <p className="text-[rgb(var(--color-text-muted))]">
                      No results found for "{query}"
                    </p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="py-2">
                    {results.map((result, index) => (
                      <motion.a
                        key={`${result.type}-${result.title}`}
                        href={result.url}
                        className={`flex items-start gap-4 p-4 mx-2 rounded-lg transition-colors group ${
                          index === selectedIndex
                            ? 'bg-[rgb(var(--color-bg-subtle))]'
                            : 'hover:bg-[rgb(var(--color-bg-subtle))]'
                        }`}
                        onMouseEnter={() => setSelectedIndex(index)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex-shrink-0 mt-1 text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-primary))] transition-colors">
                          {getResultIcon(result.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-[rgb(var(--color-text-base))] group-hover:text-[rgb(var(--color-primary))] transition-colors">
                              {result.title}
                            </h4>
                            {result.date && (
                              <span className="flex items-center gap-1 text-xs text-[rgb(var(--color-text-muted))]">
                                <Calendar className="w-3 h-3" />
                                {new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          
                          {result.description && (
                            <p className="text-sm text-[rgb(var(--color-text-muted))] line-clamp-1 mb-2">
                              {result.description}
                            </p>
                          )}
                          
                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {result.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-muted))] rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <ArrowRight className="flex-shrink-0 w-5 h-5 text-[rgb(var(--color-text-muted))] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[rgb(var(--color-bg-subtle))] mb-4">
                      <Search className="w-8 h-8 text-[rgb(var(--color-text-muted))]" />
                    </div>
                    <h3 className="mb-2">Search for content</h3>
                    <p className="text-[rgb(var(--color-text-muted))]">
                      Start typing to find articles, projects, and more
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-subtle))]">
                <div className="flex items-center gap-4 text-xs text-[rgb(var(--color-text-muted))]">
                  <kbd className="px-2 py-1 bg-[rgb(var(--color-bg-base))] rounded border border-[rgb(var(--color-border))]">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                  <kbd className="px-2 py-1 bg-[rgb(var(--color-bg-base))] rounded border border-[rgb(var(--color-border))]">
                    Enter
                  </kbd>
                  <span>Select</span>
                  <kbd className="px-2 py-1 bg-[rgb(var(--color-bg-base))] rounded border border-[rgb(var(--color-border))]">
                    Esc
                  </kbd>
                  <span>Close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
