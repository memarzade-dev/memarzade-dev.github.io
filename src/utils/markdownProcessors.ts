const codeFenceRegex = /```[\s\S]*?```/g;

export const splitCodeBlocks = (md: string) => {
  const parts: Array<{ text: string; code: boolean }> = [];
  let lastIndex = 0;
  for (const m of md.matchAll(codeFenceRegex)) {
    const start = m.index || 0;
    parts.push({ text: md.slice(lastIndex, start), code: false });
    parts.push({ text: m[0], code: true });
    lastIndex = start + m[0].length;
  }
  parts.push({ text: md.slice(lastIndex), code: false });
  return parts;
};

export const processCallouts = (markdown: string): string => {
  const plainRegex = /\[!(note|tip|warning|danger|quote)\](?:\s*([^\n]+))?([\s\S]*?)(?=\n\n|\n\[!|$)/gi;
  const withBlockquoteRegex = />\s*\[!(note|tip|warning|danger|quote)\](?:\s*([^\n]+))?[\s\S]*?(?:\n(?=>\s)|$)/gi;
  let result = markdown.replace(plainRegex, (_m, type, title, content) => {
    const header = title ? String(title).trim() : String(type);
    return `<div role="note" class="callout callout-${String(type).toLowerCase()}"><div class="font-semibold mb-2 capitalize">${header}</div><div>${String(content).trim()}</div></div>`;
  });
  result = result.replace(withBlockquoteRegex, (match) => {
    const headerMatch = match.match(/>\s*\[!(note|tip|warning|danger|quote)\](?:\s*([^\n]+))?/i);
    const type = headerMatch ? headerMatch[1] : 'note';
    const title = headerMatch && headerMatch[2] ? String(headerMatch[2]).trim() : '';
    const header = title || String(type);
    const content = match
      .replace(/>\s*\[!(?:note|tip|warning|danger|quote)\](?:\s*[^\n]+)?/i, '')
      .replace(/^>\s?/gm, '');
    return `<div role="note" class="callout callout-${String(type).toLowerCase()}"><div class="font-semibold mb-2 capitalize">${header}</div><div>${content.trim()}</div></div>`;
  });
  return result;
};

export const processFootnotes = (markdown: string): string => {
  const defs = new Map<string, string>();
  const defRegex = /^\[\^(.+?)\]:\s+(.+)$/gm;
  const usedIds = new Set<string>();
  const idMap: Record<string, string> = {};
  let m: RegExpExecArray | null;
  while ((m = defRegex.exec(markdown)) !== null) {
    const rawId = String(m[1]);
    const baseId = rawId.replace(/[^a-zA-Z0-9_-]/g, '');
    let assigned = baseId;
    let idx = 2;
    while (usedIds.has(assigned)) {
      assigned = `${baseId}-${idx++}`;
    }
    usedIds.add(assigned);
    defs.set(assigned, m[2]);
    if (!idMap[rawId]) idMap[rawId] = assigned;
  }
  let replaced = markdown.replace(/\[\^(.+?)\]/g, (_mm, id) => {
    const rawId = String(id);
    const assigned = idMap[rawId] || rawId.replace(/[^a-zA-Z0-9_-]/g, '');
    return `<sup id="ref-${assigned}"><a href="#footnote-${assigned}">[${assigned}]</a></sup>`;
  });
  if (defs.size > 0) {
    const list = Array.from(defs.entries())
      .map(([id, text]) => `<li id="footnote-${id}"><a href="#ref-${id}">^</a> ${text}</li>`)
      .join('');
    replaced += `\n\n<div class="my-6"><h4>Footnotes</h4><ol class="list-decimal list-inside">${list}</ol></div>`;
  }
  return replaced;
};

export const processInlineExtras = (md: string): string => {
  const parts = splitCodeBlocks(md);
  const out = parts
    .map((p) => {
      if (p.code) return p.text;
      let t = p.text;
      t = t.replace(/==([^=]+)==/g, '<mark>$1</mark>');
      t = t.replace(/(^|[^~])~([^~]+)~(?!~)/g, (_m, pre, val) => `${pre}<sub>${val}</sub>`);
      t = t.replace(/(^|[^^])\^([^^]+)\^(?!\^)/g, (_m, pre, val) => `${pre}<sup>${val}</sup>`);
      return t;
    })
    .join('');
  return out;
};

export const processDefinitionLists = (md: string): string => {
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

export const processAbbreviations = (md: string): string => {
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

const emojiMap: Record<string, string> = {
  smile: '😄',
  rocket: '🚀',
  fire: '🔥',
  star: '⭐',
  warning: '⚠️',
  info: 'ℹ️',
  tada: '🎉',
  '+1': '👍',
  '-1': '👎',
  heart: '❤️',
};

export const processEmojis = (md: string, override?: Record<string, string>): string => {
  const parts = splitCodeBlocks(md);
  const out = parts
    .map((p) => {
      if (p.code) return p.text;
      return p.text.replace(/:([a-z0-9_+-]+):/gi, (_m, name) => {
        const k = String(name).toLowerCase();
        const map = override ? { ...emojiMap, ...override } : emojiMap;
        return map[k] ? map[k] : _m;
      });
    })
    .join('');
  return out;
};

export const processSpoilers = (md: string, className = 'spoiler blur-[2px] hover:blur-0'): string => {
  const parts = splitCodeBlocks(md);
  const out = parts
    .map((p) => {
      if (p.code) return p.text;
      return p.text.replace(/>!([\s\S]*?)!</g, (_m, inner) => `<span class="${className}">${String(inner).trim()}</span>`);
    })
    .join('');
  return out;
};

export const processComments = (md: string): string => {
  const parts = splitCodeBlocks(md);
  const out = parts
    .map((p) => {
      if (p.code) return p.text;
      let t = p.text;
      t = t.replace(/\[\/\/:\s*#\s*\(([^)]*)\)\]/g, '');
      t = t.replace(/<!--([\s\S]*?)-->/g, '');
      return t;
    })
    .join('');
  return out;
};

export const processTags = (md: string, baseUrl?: string): string => {
  const parts = splitCodeBlocks(md);
  const out = parts
    .map((p) => {
      if (p.code) return p.text;
      return p.text.replace(/(^|\s)(#[a-z0-9][a-z0-9_-]*)\b/gi, (_m, pre, tag) => {
        const t = String(tag).slice(1);
        if (baseUrl) {
          const href = `${baseUrl}${encodeURIComponent(t)}`;
          return `${pre}<a href="${href}" class="tag inline-flex items-center rounded px-2 py-0.5 text-sm bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-muted))]">#${t}</a>`;
        }
        return `${pre}<span class="tag inline-flex items-center rounded px-2 py-0.5 text-sm bg-[rgb(var(--color-bg-muted))] text-[rgb(var(--color-text-muted))]">${tag}</span>`;
      });
    })
    .join('');
  return out;
};

const slug = (s: string) =>
  String(s)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');

export const processInternalLinks = (md: string, basePath?: string): string => {
  const parts = splitCodeBlocks(md);
  const out = parts
    .map((p) => {
      if (p.code) return p.text;
      return p.text.replace(/\[\[([^\]]+)\]\]/g, (_m, inner) => {
        const text = String(inner);
        const hashIdx = text.indexOf('#');
        if (hashIdx > -1) {
          const target = text.slice(hashIdx + 1);
          const id = slug(target);
          const label = text.slice(0, hashIdx) || target;
          const href = basePath ? `${basePath}#${id}` : `#${id}`;
          return `<a href="${href}">${label}</a>`;
        }
        const id = slug(text);
        const href = basePath ? `${basePath}#${id}` : `#${id}`;
        return `<a href="${href}">${text}</a>`;
      });
    })
    .join('');
  return out;
};

export const processEmbeds = (md: string): string => {
  const parts = splitCodeBlocks(md);
  const out = parts
    .map((p) => {
      if (p.code) return p.text;
      return p.text.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, path, opt) => {
        const src = String(path).trim();
        const option = typeof opt === 'string' ? String(opt).trim() : '';
        const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(src);
        if (isImage) {
          const width = /^\d+$/.test(option) ? option : '';
          const wAttr = width ? ` width="${width}"` : '';
          return `<img src="${src}"${wAttr} alt="" />`;
        }
        if (/\.(mp4|webm|ogg)$/i.test(src)) {
          const width = /^\d+$/.test(option) ? option : '';
          const wAttr = width ? ` width="${width}"` : '';
          return `<video controls src="${src}"${wAttr}></video>`;
        }
        if (/\.(mp3|wav|flac|m4a)$/i.test(src)) {
          return `<audio controls src="${src}"></audio>`;
        }
        return `<a href="${src}">${src}</a>`;
      });
    })
    .join('');
  return out;
};

export const processMentions = (md: string, baseUrl = 'https://github.com/'): string => {
  const parts = splitCodeBlocks(md);
  const out = parts
    .map((p) => {
      if (p.code) return p.text;
      return p.text.replace(/(^|\s)@([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38}))/g, (_m, pre, user) => `${pre}<a href="${baseUrl}${String(user)}">@${String(user)}</a>`);
    })
    .join('');
  return out;
};

export const processIssueLinks = (md: string, opts: { githubRepo?: string; issueBaseUrl?: string } = {}): string => {
  const repo = opts.githubRepo;
  const base = opts.issueBaseUrl || (repo ? `https://github.com/${repo}/issues/` : '');
  const parts = splitCodeBlocks(md);
  const out = parts
    .map((p) => {
      if (p.code) return p.text;
      let t = p.text;
      t = base
        ? t.replace(/(^|\s)#(\d+)\b/g, (_m, pre, num) => `${pre}<a href="${base}${String(num)}">#${String(num)}</a>`)
        : t;
      t = t.replace(/\b([\w.-]+\/[\w.-]+)#(\d+)\b/g, (_m, fullRepo, num) => `<a href="https://github.com/${String(fullRepo)}/issues/${String(num)}">${String(fullRepo)}#${String(num)}</a>`);
      return t;
    })
    .join('');
  return out;
};

export const processImageSizes = (md: string): string => {
  const parts = splitCodeBlocks(md);
  const out = parts
    .map((p) => {
      if (p.code) return p.text;
      return p.text.replace(/!\[([^\]]*)\]\(([^)\s]+)\s*=([0-9]+)x(\*|[0-9]+)?\)/g, (_m, alt, url, w, h) => {
        const width = String(w);
        const height = h && h !== '*' ? ` height="${String(h)}"` : '';
        return `<img src="${String(url)}" width="${width}"${height} alt="${String(alt)}" />`;
      });
    })
    .join('');
  return out;
};

export interface ProcessorOptions {
  enableCommentsRemoval?: boolean;
  enableTags?: boolean;
  enableInternalLinks?: boolean;
  enableEmbeds?: boolean;
  enableImageSizes?: boolean;
  enableEmojis?: boolean;
  githubRepo?: string;
  issueBaseUrl?: string;
  mentionsBaseUrl?: string;
  tagsBaseUrl?: string;
  spoilerClassName?: string;
  emojiMapOverride?: Record<string, string>;
  internalLinkBasePath?: string;
}

export const composeProcessors = (md: string, opts: ProcessorOptions = {}): string => {
  const p1 = processCallouts(md);
  const p2 = processFootnotes(p1);
  const p3 = processInlineExtras(p2);
  const p4 = processDefinitionLists(p3);
  const p5 = processAbbreviations(p4);
  const p6 = opts.enableEmojis === false ? p5 : processEmojis(p5, opts.emojiMapOverride);
  const p7 = processSpoilers(p6, opts.spoilerClassName);
  const p8 = opts.enableCommentsRemoval === false ? p7 : processComments(p7);
  const p9 = opts.enableTags === false ? p8 : processTags(p8, opts.tagsBaseUrl);
  const p10 = processIssueLinks(p9, { githubRepo: opts.githubRepo, issueBaseUrl: opts.issueBaseUrl });
  const p11 = processMentions(p10, opts.mentionsBaseUrl);
  const p12 = opts.enableInternalLinks === false ? p11 : processInternalLinks(p11, opts.internalLinkBasePath);
  const p13 = opts.enableEmbeds === false ? p12 : processEmbeds(p12);
  const p14 = opts.enableImageSizes === false ? p13 : processImageSizes(p13);
  return p14;
};
