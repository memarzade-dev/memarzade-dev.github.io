import { useState, useEffect } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProgressBar } from './components/ProgressBar';
import { ShareButtons } from './components/ShareButtons';
import { ReadingModeToggle } from './components/ReadingModeToggle';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { SearchModal } from './components/SearchModal';
import { SEO } from './components/SEO';
import { BackToTop } from './components/BackToTop';
import { AnimatedCursor } from './components/AnimatedCursor';
import { SmoothScroll } from './components/SmoothScroll';
import { HomePage } from './pages/HomePage';
import { BlogList } from './pages/BlogList';
import { BlogPost } from './pages/BlogPost';
import { ProjectsList } from './pages/ProjectsList';
import { ProjectDetail } from './pages/ProjectDetail';
import { NotFound } from './pages/NotFound';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorMessage
          message={this.state.error?.message || 'Something went wrong'}
          onRetry={() => window.location.reload()}
          fullScreen
        />
      );
    }

    return this.props.children;
  }
}

function App() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', newTheme === 'dark');
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <SEO />
        <div className="min-h-screen bg-[rgb(var(--color-bg-base))] text-[rgb(var(--color-text-base))] transition-colors duration-300">
          <ProgressBar />
          
          <Header
            theme={theme}
            onThemeToggle={handleThemeToggle}
            onSearchOpen={() => setIsSearchOpen(true)}
          />

          <main className="pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/projects" element={<ProjectsList />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />

          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

          <ShareButtons
            url="https://vaults.memarzade.dev"
            title="Memarzade.Dev - Full-Stack Developer"
            description="A passionate Full-Stack Developer specializing in modern web technologies"
          />
          
          <ReadingModeToggle />
          <BackToTop />
          <AnimatedCursor />
          <SmoothScroll />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;