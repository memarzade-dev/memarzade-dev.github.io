export const detectRTL = (text: string): boolean => {
  const rtlChars = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  const ltrChars = /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8]/;
  
  const rtlCount = (text.match(rtlChars) || []).length;
  const ltrCount = (text.match(ltrChars) || []).length;
  
  return rtlCount > ltrCount;
};

export const detectDirection = (text: string): 'rtl' | 'ltr' | 'auto' => {
  const trimmed = text.trim();
  if (!trimmed) return 'auto';
  
  const firstChar = trimmed[0];
  const rtlRegex = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  
  if (rtlRegex.test(firstChar)) return 'rtl';
  if (/[A-Za-z]/.test(firstChar)) return 'ltr';
  
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
