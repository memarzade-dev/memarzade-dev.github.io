import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { useEffect, useRef } from 'react';
import { detectDirection } from '../utils/rtlDetect';
import { CopyCodeButton } from './CopyCodeButton';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load KaTeX CSS from CDN
    const katexLink = document.getElementById('katex-css');
    if (!katexLink) {
      const link = document.createElement('link');
      link.id = 'katex-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const blocks = containerRef.current.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote');
    blocks.forEach((block) => {
      const text = block.textContent || '';
      const dir = detectDirection(text);
      block.setAttribute('dir', dir);
      if (dir === 'rtl') {
        block.classList.add('rtl');
      }
    });

    // Add IDs to headings for table of contents
    const headings = containerRef.current.querySelectorAll('h1, h2, h3');
    headings.forEach((heading) => {
      const text = heading.textContent || '';
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      heading.id = id;
    });

    // Add copy buttons to code blocks
    const codeBlocks = containerRef.current.querySelectorAll('pre');
    codeBlocks.forEach((pre) => {
      const code = pre.querySelector('code');
      if (code && !pre.querySelector('.copy-code-button')) {
        const codeText = code.textContent || '';
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group';
        
        pre.parentNode?.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        
        const button = document.createElement('button');
        button.className = 'copy-code-button absolute top-2 right-2 p-2 bg-[rgb(var(--color-bg-base))]/80 hover:bg-[rgb(var(--color-bg-base))] rounded-lg transition-all opacity-0 group-hover:opacity-100';
        button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
        button.onclick = async () => {
          await navigator.clipboard.writeText(codeText);
          button.innerHTML = '<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
          setTimeout(() => {
            button.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
          }, 2000);
        };
        
        wrapper.appendChild(button);
      }
    });
  }, [content]);

  const processCallouts = (markdown: string): string => {
    const calloutRegex = /\[!(note|tip|warning|danger|quote)\]([\s\S]*?)(?=\n\n|\n\[!|$)/gi;
    return markdown.replace(calloutRegex, (_, type, content) => {
      return `<div class="callout callout-${type.toLowerCase()}">
        <div class="font-semibold mb-2 capitalize">${type}</div>
        <div>${content.trim()}</div>
      </div>`;
    });
  };

  const processedContent = processCallouts(content);

  return (
    <div ref={containerRef} className={`markdown-content prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSanitize,
          rehypeKatex,
          rehypeHighlight,
        ]}
        components={{
          h1: ({ node, ...props }) => <h1 className="scroll-m-20" {...props} />,
          h2: ({ node, ...props }) => <h2 className="scroll-m-20 mt-10 mb-4" {...props} />,
          h3: ({ node, ...props }) => <h3 className="scroll-m-20 mt-8 mb-3" {...props} />,
          h4: ({ node, ...props }) => <h4 className="scroll-m-20 mt-6 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          a: ({ node, href, ...props }) => (
            <a
              href={href}
              className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-secondary))] underline underline-offset-4 transition-colors"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code
                className="bg-[rgb(var(--color-bg-muted))] px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="bg-[rgb(var(--color-bg-muted))] p-4 rounded-lg overflow-x-auto my-4" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[rgb(var(--color-primary))] pl-4 italic my-4 text-[rgb(var(--color-text-muted))] [&[dir='rtl']]:border-l-0 [&[dir='rtl']]:border-r-4 [&[dir='rtl']]:pl-0 [&[dir='rtl']]:pr-4"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th className="border border-[rgb(var(--color-border))] px-4 py-2 bg-[rgb(var(--color-bg-subtle))] font-semibold text-left" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-[rgb(var(--color-border))] px-4 py-2" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="my-4 space-y-2 list-disc list-inside" {...props} />,
          ol: ({ node, ...props }) => <ol className="my-4 space-y-2 list-decimal list-inside" {...props} />,
          li: ({ node, ...props }) => <li className="ml-4 [&[dir='rtl']]:ml-0 [&[dir='rtl']]:mr-4" {...props} />,
          img: ({ node, ...props }) => (
            <img className="rounded-lg my-4 max-w-full h-auto shadow-lg" loading="lazy" {...props} alt={props.alt || ''} />
          ),
          hr: ({ node, ...props }) => <hr className="my-8 border-[rgb(var(--color-border))]" {...props} />,
          input: ({ node, type, ...props }: any) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  className="mr-2 accent-[rgb(var(--color-primary))] [&[dir='rtl']]:mr-0 [&[dir='rtl']]:ml-2"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}