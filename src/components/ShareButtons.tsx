import { Share2, Twitter, Linkedin, Facebook, Link, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import { Tooltip } from './Tooltip';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description = '' }: ShareButtonsProps) {
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'hover:bg-sky-500',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-600',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-500',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-40 hidden lg:block">
      <div className="flex flex-col gap-2">
        <Tooltip content="Share" position="right">
          <motion.button
            onClick={() => setShowShare(!showShare)}
            className="p-3 rounded-full glass hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </Tooltip>

        {showShare && (
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {shareLinks.map((link, index) => (
              <Tooltip key={link.name} content={link.name} position="right">
                <motion.a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full glass ${link.color} hover:text-white transition-all`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Share on ${link.name}`}
                >
                  <link.icon className="w-5 h-5" />
                </motion.a>
              </Tooltip>
            ))}

            <Tooltip content={copied ? 'Copied!' : 'Copy link'} position="right">
              <motion.button
                onClick={copyToClipboard}
                className="p-3 rounded-full glass hover:bg-[rgb(var(--color-success))] hover:text-white transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: shareLinks.length * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Copy link"
              >
                {copied ? <Check className="w-5 h-5" /> : <Link className="w-5 h-5" />}
              </motion.button>
            </Tooltip>
          </motion.div>
        )}
      </div>
    </div>
  );
}
