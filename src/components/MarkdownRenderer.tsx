import { defaultSchema } from 'hast-util-sanitize';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { composeProcessors } from '@/utils/markdownProcessors';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { detectDirection, annotateDirection } from '../utils/rtlDetect';
import 'highlight.js/styles/github-dark.css';
import { parseFrontMatter } from '@/utils/frontMatter';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  onFrontmatterParsed?: (data: Record<string, any>) => void;
  options?: {
    enableFrontmatter?: boolean;
    enableEmojis?: boolean;
    enableTaskLists?: boolean;
    enableEmbeds?: boolean;
    enableImageSizes?: boolean;
    enableInternalLinks?: boolean;
    enableTags?: boolean;
    enableCommentsRemoval?: boolean;
    githubRepo?: string;
    issueBaseUrl?: string;
    mentionsBaseUrl?: string;
    tagsBaseUrl?: string;
    autoDirection?: boolean;
    enableMermaid?: boolean;
    showLineNumbers?: boolean;
  };
}

export function MarkdownRenderer({ content, className = '', onFrontmatterParsed, options }: MarkdownRendererProps) {
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

    if (options?.autoDirection !== false) {
      annotateDirection(containerRef.current);
    }

    const headings = containerRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const used = new Map<string, number>();
    const slug = (s: string) =>
      s
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .trim()
        .replace(/\s+/g, '-');
    headings.forEach((heading) => {
      const text = heading.textContent || '';
      let base = slug(text);
      if (!base) base = 'section';
      const count = used.get(base) ?? 0;
      used.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;
      heading.id = id;
    });

    if (options?.enableMermaid !== false) {
      const mermaidBlocks = containerRef.current.querySelectorAll('.mermaid');
      if (mermaidBlocks.length > 0) {
        const scriptId = 'mermaid-js';
        let script = document.getElementById(scriptId) as HTMLScriptElement | null;
        const initWithTheme = () => {
          const anyWin = window as any;
          const isDark = document.documentElement.classList.contains('dark');
          if (anyWin.mermaid && typeof anyWin.mermaid.initialize === 'function') {
            anyWin.mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: isDark ? 'dark' : 'default' });
            anyWin.mermaid.init(undefined, mermaidBlocks as any);
          }
        };
        const ensureInit = () => {
          try {
            initWithTheme();
          } catch (_err) {
            void _err;
          }
        };
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
          script.crossOrigin = 'anonymous';
          script.onload = ensureInit;
          script.onerror = () => {};
          document.body.appendChild(script);
        } else {
          ensureInit();
        }
        const obs = new MutationObserver(() => {
          initWithTheme();
        });
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      }
    }

  }, [content, options?.autoDirection, options?.enableMermaid]);

  const processCallouts = (markdown: string): string => {
    const plainRegex = /\[!(note|tip|warning|danger|quote)\]([\s\S]*?)(?=\n\n|\n\[!|$)/gi;
    const withBlockquoteRegex = />\s*\[!(note|tip|warning|danger|quote)\][\s\S]*?(?:\n(?=>\s)|$)/gi;
    let result = markdown.replace(plainRegex, (_, type, content) => {
      return `<div class="callout callout-${String(type).toLowerCase()}"><div class="font-semibold mb-2 capitalize">${type}</div><div>${String(content).trim()}</div></div>`;
    });
    result = result.replace(withBlockquoteRegex, (match) => {
      const headerMatch = match.match(/>\s*\[!(note|tip|warning|danger|quote)\]/i);
      const type = headerMatch ? headerMatch[1] : 'note';
      const content = match.replace(/>\s*\[!(?:note|tip|warning|danger|quote)\]\s*/i, '').replace(/^>\s?/gm, '');
      return `<div class="callout callout-${String(type).toLowerCase()}"><div class="font-semibold mb-2 capitalize">${type}</div><div>${content.trim()}</div></div>`;
    });
    return result;
  };

  const processFootnotes = (markdown: string): string => {
    const defs = new Map<string, string>();
    const defRegex = /^\[\^(.+?)\]:\s+(.+)$/gm;
    let m: RegExpExecArray | null;
    while ((m = defRegex.exec(markdown)) !== null) {
      defs.set(m[1], m[2]);
    }
    let replaced = markdown.replace(/\[\^(.+?)\]/g, (_, id) => {
      const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, '');
      return `<sup id="ref-${safeId}"><a href="#footnote-${safeId}">[${safeId}]</a></sup>`;
    });
    if (defs.size > 0) {
      const list = Array.from(defs.entries())
        .map(([id, text]) => `<li id="footnote-${id}"><a href="#ref-${id}">^</a> ${text}</li>`)
        .join('');
      replaced += `\n\n<div class="my-6"><h4>Footnotes</h4><ol class="list-decimal list-inside">${list}</ol></div>`;
    }
    return replaced;
  };

  const processedContent = processFootnotes(processCallouts(content));

  const splitCodeBlocks = (md: string) => {
    const re = /```[\s\S]*?```/g;
    const parts: Array<{ text: string; code: boolean }> = [];
    let lastIndex = 0;
    for (const m of md.matchAll(re)) {
      const start = m.index || 0;
      parts.push({ text: md.slice(lastIndex, start), code: false });
      parts.push({ text: m[0], code: true });
      lastIndex = start + m[0].length;
    }
    parts.push({ text: md.slice(lastIndex), code: false });
    return parts;
  };

  const processInlineExtras = (md: string): string => {
    const parts = splitCodeBlocks(md);
    const out = parts
      .map((p) => {
        if (p.code) return p.text;
        let t = p.text;
        t = t.replace(/==([^=]+)==/g, '<mark>$1</mark>');
        t = t.replace(/(^|[^^])\^([^^]+)\^(?!\^)/g, (_m, pre, val) => `${pre}<sup>${val}</sup>`);
        t = t.replace(/(^|[^~])~([^~]+)~(?!~)/g, (_m, pre, val) => `${pre}<sub>${val}</sub>`);
        return t;
      })
      .join('');
    return out;
  };

  const processDefinitionLists = (md: string): string => {
    const parts = splitCodeBlocks(md);
    const out = parts
      .map((p) => {
        if (p.code) return p.text;
        return p.text.replace(/(^|\n)([^\n]+)\n((?::\s+.*(?:\n|$))+)/g, (_m, pre, term, defs) => {
          const dd = defs
            .split('\n')
            .filter((l) => l.trim().startsWith(':'))
            .map((l) => l.replace(/^:\s*/, '').trim())
            .filter(Boolean)
            .map((d) => `<dd>${d}</dd>`)
            .join('');
          return `${pre}<dl><dt>${term.trim()}</dt>${dd}</dl>`;
        });
      })
      .join('');
    return out;
  };

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const processAbbreviations = (md: string): string => {
    const defs: Record<string, string> = {};
    md.replace(/^\*\[([^\]]+)\]:\s+(.+)$/gm, (_m, abbr, full) => {
      defs[String(abbr)] = String(full);
      return '';
    });
    if (Object.keys(defs).length === 0) return md;
    const parts = splitCodeBlocks(md);
    const out = parts
      .map((p) => {
        if (p.code) return p.text;
        let t = p.text;
        for (const [abbr, full] of Object.entries(defs)) {
          const re = new RegExp(`(^|[^<])\\b${escapeRegExp(abbr)}\\b`, 'g');
          t = t.replace(re, (_mm, pre) => `${pre}<abbr title="${full}">${abbr}</abbr>`);
        }
        return t;
      })
      .join('');
    return out.replace(/^\*\[[^\]]+\]:\s+.+$/gm, '');
  };

  const enhancedContent = useMemo(() => {
    const useFM = options?.enableFrontmatter !== false;
    const parsed = useFM ? parseFrontMatter(content) : { data: {}, body: content };
    if (useFM && onFrontmatterParsed) onFrontmatterParsed(parsed.data);
    return composeProcessors(parsed.body, {
      enableEmojis: options?.enableEmojis,
      enableCommentsRemoval: options?.enableCommentsRemoval,
      enableTags: options?.enableTags,
      enableInternalLinks: options?.enableInternalLinks,
      enableEmbeds: options?.enableEmbeds,
      enableImageSizes: options?.enableImageSizes,
      githubRepo: options?.githubRepo,
      issueBaseUrl: options?.issueBaseUrl,
      mentionsBaseUrl: options?.mentionsBaseUrl,
      tagsBaseUrl: options?.tagsBaseUrl,
      spoilerClassName: undefined,
      emojiMapOverride: undefined,
      internalLinkBasePath: undefined,
    });
  }, [content, onFrontmatterParsed, options]);

  const sanitizeSchema = {
    ...defaultSchema,
    tagNames: [
      ...(defaultSchema.tagNames || []),
      'div',
      'span',
      'details',
      'summary',
      'mark',
      'del',
      'kbd',
      'dl',
      'dt',
      'dd',
      'abbr',
      'sub',
      'sup',
      'iframe',
      'video',
      'audio',
      'canvas',
    ],
    attributes: {
      ...(defaultSchema.attributes || {}),
      div: ['role', 'class'],
      span: ['class'],
      details: ['open'],
      summary: ['aria-label'],
      abbr: ['title'],
      iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'title'],
      video: ['src', 'width', 'height', 'controls', 'poster'],
      audio: ['src', 'controls'],
      canvas: ['width', 'height'],
    },
    protocols: {
      ...(defaultSchema as any).protocols,
      src: ['https'],
      href: ['https'],
    },
  } as any;

  return (
    <div ref={containerRef} className={`markdown-content prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ErrorBoundary fallback={<div className="text-[rgb(var(--color-text-muted))]">Failed to render content.</div>}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, sanitizeSchema],
          rehypeKatex,
          rehypeHighlight,
        ]}
        components={{
          h1: ({ node, children, ...props }) => {
            const getText = (c: any): string => {
              if (typeof c === 'string') return c;
              if (Array.isArray(c)) return c.map(getText).join('');
              if (c && c.props) return getText(c.props.children);
              return '';
            };
            const text = getText(children);
            const id = text
              .normalize('NFKD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .replace(/[^\p{L}\p{N}\s-]/gu, '')
              .trim()
              .replace(/\s+/g, '-') || 'section';
            return (
              <h1 id={id} className="scroll-m-20" {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ node, children, ...props }) => {
            const getText = (c: any): string => {
              if (typeof c === 'string') return c;
              if (Array.isArray(c)) return c.map(getText).join('');
              if (c && c.props) return getText(c.props.children);
              return '';
            };
            const text = getText(children);
            const id = text
              .normalize('NFKD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .replace(/[^\p{L}\p{N}\s-]/gu, '')
              .trim()
              .replace(/\s+/g, '-') || 'section';
            return (
              <h2 id={id} className="scroll-m-20 mt-10 mb-4 group" {...props}>
                {children}
                <a href={`#${id}`} aria-label="Copy link" className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">#</a>
              </h2>
            );
          },
          h3: ({ node, children, ...props }) => {
            const getText = (c: any): string => {
              if (typeof c === 'string') return c;
              if (Array.isArray(c)) return c.map(getText).join('');
              if (c && c.props) return getText(c.props.children);
              return '';
            };
            const text = getText(children);
            const id = text
              .normalize('NFKD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .replace(/[^\p{L}\p{N}\s-]/gu, '')
              .trim()
              .replace(/\s+/g, '-') || 'section';
            return (
              <h3 id={id} className="scroll-m-20 mt-8 mb-3 group" {...props}>
                {children}
                <a href={`#${id}`} aria-label="Copy link" className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">#</a>
              </h3>
            );
          },
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
          pre: ({ node, children, ...props }) => {
            const child = Array.isArray(children) ? (children as any[])[0] : (children as any);
            const isMermaid = child && child.props && /language-mermaid/.test(child.props.className || '');
            if (isMermaid) {
              if (options?.enableMermaid === false) return null;
              const text = String(child.props.children || '');
              return <div className="mermaid my-4">{text}</div>;
            }
            const getText = (c: any): string => {
              if (typeof c === 'string') return c;
              if (Array.isArray(c)) return c.map(getText).join('');
              if (c && c.props) return getText(c.props.children);
              return '';
            };
            const codeString = getText(children);
            const langMatch = child && child.props && /language-(\w+)/.exec(child.props.className || '');
            const langLabel = langMatch ? langMatch[1] : '';
            const [copied, setCopied] = useState(false);
            const onCopy = async () => {
              try {
                await navigator.clipboard.writeText(codeString);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch (_err) {
                void _err;
              }
            };
            const renderWithLineNumbers = (code: string) => {
              const lines = code.split('\n');
              return (
                <div className="grid grid-cols-[auto_1fr] gap-x-4">
                  <div className="text-[rgb(var(--color-text-muted))] text-right select-none pr-2">
                    {lines.map((_, i) => (
                      <div key={i} className="leading-6">{i + 1}</div>
                    ))}
                  </div>
                  <div>{children}</div>
                </div>
              );
            };
            return (
              <div className="relative group my-4">
                {langLabel && (
                  <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-[rgb(var(--color-bg-base))]/80 text-[rgb(var(--color-text-muted))]">
                    {langLabel}
                  </div>
                )}
                <pre className="bg-[rgb(var(--color-bg-muted))] p-4 rounded-lg overflow-x-auto" {...props}>
                  {options?.showLineNumbers ? renderWithLineNumbers(codeString) : children}
                </pre>
                {codeString && (
                  <button
                    className="copy-code-button absolute top-2 right-2 p-2 bg-[rgb(var(--color-bg-base))]/80 hover:bg-[rgb(var(--color-bg-base))] rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    onClick={onCopy}
                    aria-label="Copy code"
                  >
                    {copied ? (
                      <span className="text-xs">Copied!</span>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    )}
                  </button>
                )}
              </div>
            );
          },
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
            <th className="border border-[rgb(var(--color-border))] px-4 py-2 bg-[rgb(var(--color-bg-subtle))] font-semibold" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-[rgb(var(--color-border))] px-4 py-2" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="my-4 space-y-2 list-disc list-inside" {...props} />,
          ol: ({ node, ...props }) => <ol className="my-4 space-y-2 list-decimal list-inside" {...props} />,
          li: ({ node, ...props }) => <li className="ml-4 [&[dir='rtl']]:ml-0 [&[dir='rtl']]:mr-4" {...props} />,
          img: ({ node, title, ...props }) => {
            const altText = String((props as any).alt || '');
            const isFigureCaption = altText.startsWith('Figure: ');
            if (title || isFigureCaption) {
              return (
                <figure className="my-4">
                  <img className="rounded-lg max-w-full h-auto shadow-lg" loading="lazy" {...props} alt={props.alt || ''} />
                  <figcaption className="mt-2 text-sm text-[rgb(var(--color-text-muted))]">{isFigureCaption ? altText.replace(/^Figure:\s*/, '') : title}</figcaption>
                </figure>
              );
            }
            return <img className="rounded-lg my-4 max-w-full h-auto shadow-lg" loading="lazy" {...props} alt={props.alt || ''} />;
          },
          iframe: ({ node, src, ...props }) => {
            const allowed = ['https://www.youtube.com/', 'https://player.vimeo.com/'];
            const ok = typeof src === 'string' && allowed.some((d) => src.startsWith(d));
            if (!ok) return null;
            return (
              <div className="my-4 aspect-video">
                <iframe src={src} className="w-full h-full rounded-lg" {...props} />
              </div>
            );
          },
          hr: ({ node, ...props }) => <hr className="my-8 border-[rgb(var(--color-border))]" {...props} />,
          details: ({ node, ...props }) => (
            <details className="my-4 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-subtle))] p-4" {...props} />
          ),
          summary: ({ node, ...props }) => (
            <summary className="cursor-pointer font-semibold mb-2" {...props} />
          ),
          kbd: ({ node, ...props }) => (
            <kbd className="px-1.5 py-0.5 rounded border bg-[rgb(var(--color-bg-muted))] text-sm" {...props} />
          ),
          mark: ({ node, ...props }) => (
            <mark className="bg-yellow-200 dark:bg-yellow-900/40 px-1" {...props} />
          ),
          dl: ({ node, ...props }) => (
            <dl className="my-4" {...props} />
          ),
          dt: ({ node, ...props }) => (
            <dt className="font-semibold" {...props} />
          ),
          dd: ({ node, ...props }) => (
            <dd className="ml-4 [&[dir='rtl']]:ml-0 [&[dir='rtl']]:mr-4" {...props} />
          ),
          abbr: ({ node, ...props }) => (
            <abbr className="border-b border-dotted cursor-help" {...props} />
          ),
          sub: ({ node, ...props }) => <sub {...props} />, 
          sup: ({ node, ...props }) => <sup {...props} />, 
          input: ({ node, type, ...props }: any) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  className="mr-2 accent-[rgb(var(--color-primary))] [&[dir='rtl']]:mr-0 [&[dir='rtl']]:ml-2"
                  disabled
                  aria-readonly="true"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {enhancedContent?.trim() ? enhancedContent : 'بدون محتوا'}
      </ReactMarkdown>
      </ErrorBoundary>
    </div>
  );
}
