export const detectRTL = (text: string): boolean => {
  const rtlChars = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/g;
  const ltrChars = /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8]/g;
  const rtlCount = (text.match(rtlChars) || []).length;
  const ltrCount = (text.match(ltrChars) || []).length;
  return rtlCount > ltrCount;
};

export const detectDirection = (text: string): 'rtl' | 'ltr' | 'auto' => {
  const trimmed = text.trim();
  if (!trimmed) return 'auto';
  if (trimmed.length <= 2) return 'auto';
  const firstAlphaMatch = trimmed.match(/[\p{L}]/u);
  const firstAlpha = firstAlphaMatch ? firstAlphaMatch[0] : '';
  const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  if (firstAlpha && rtlRegex.test(firstAlpha)) return 'rtl';
  if (firstAlpha && /[A-Za-z]/.test(firstAlpha)) return 'ltr';
  return detectRTL(trimmed) ? 'rtl' : 'ltr';
};

export const wrapBidi = (text: string): string => {
  const dir = detectDirection(text);
  return dir === 'rtl' ? `<bdi dir="rtl">${text}</bdi>` : text;
};

export const getTextDirection = (element: HTMLElement | null): 'rtl' | 'ltr' => {
  if (!element) return 'ltr';
  const text = element.textContent || '';
  return detectRTL(text) ? 'rtl' : 'ltr';
};

export const annotateDirection = (root: HTMLElement) => {
  const blocks = root.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, blockquote, th, td, ul, ol');
  blocks.forEach((block) => {
    const text = block.textContent || '';
    const dir = detectDirection(text);
    block.setAttribute('dir', dir);
    if (dir === 'rtl') {
      block.classList.add('rtl');
    } else {
      block.classList.remove('rtl');
    }
  });
}
