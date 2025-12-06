import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string[];
}

export function SEO({
  title = 'Memarzade.Dev - Full-Stack Developer | Laravel, React, AI & Blockchain',
  description = 'Professional Full-Stack Developer specializing in Laravel, React, Python, AI/ML, and Blockchain. Building exceptional digital experiences with modern web technologies.',
  image = 'https://vaults.memarzade.dev/og-image.png',
  url,
  type = 'website',
  keywords = ['Full-Stack Developer', 'Laravel', 'React', 'Python', 'AI', 'Blockchain', 'Web Development', 'TypeScript'],
}: SEOProps) {
  useEffect(() => {
    const computedUrl = typeof window !== 'undefined' ? window.location.href : (url || 'https://memarzade-dev.memarzade-dev.workers.dev');
    // Update page title
    document.title = title;

    // Update meta description
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords.join(', '));

    // Open Graph / Facebook
    updateMetaTag('property', 'og:type', type);
    updateMetaTag('property', 'og:url', computedUrl);
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', image);

    // Twitter
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:url', computedUrl);
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

    // Additional SEO tags
    updateMetaTag('name', 'author', 'Ali Memarzade');
    updateMetaTag('name', 'robots', 'index, follow');
    updateMetaTag('name', 'language', 'English');
    updateMetaTag('name', 'revisit-after', '7 days');

    // Canonical URL
    updateLinkTag('canonical', computedUrl);
  }, [title, description, image, url, type, keywords]);

  return null;
}

function updateMetaTag(attribute: string, key: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  
  element.setAttribute('href', href);
}
