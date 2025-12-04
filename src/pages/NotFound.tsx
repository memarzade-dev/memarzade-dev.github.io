import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { SEO } from '../components/SEO';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="404 - Page Not Found | Memarzade.Dev"
        description="The page you're looking for doesn't exist"
      />

      <div className="min-h-screen bg-[rgb(var(--color-bg-base))] flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Animation */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="text-[150px] md:text-[200px] font-bold gradient-text leading-none"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              404
            </motion.h1>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-4">Page Not Found</h2>
            <p className="text-lg text-[rgb(var(--color-text-muted))] mb-8">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => navigate('/')}
              className="btn-primary inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>

            <motion.button
              onClick={() => navigate(-1)}
              className="btn-ghost inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="mt-16 p-8 bg-[rgb(var(--color-bg-subtle))] rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6 text-[rgb(var(--color-text-muted))]">
              <Search className="w-5 h-5" />
              <span>Quick Links</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Home', path: '/' },
                { label: 'Blog', path: '/blog' },
                { label: 'Projects', path: '/projects' },
                { label: 'Contact', path: '/#contact' },
              ].map((link) => (
                <motion.button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="p-4 bg-[rgb(var(--color-bg-base))] rounded-lg hover:bg-[rgb(var(--color-primary))] hover:text-white transition-colors"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Animated Background Elements */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-64 h-64 bg-[rgb(var(--color-primary))]/5 rounded-full blur-3xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50, 0],
                  y: [0, Math.random() * 100 - 50, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
