export function parseFrontMatter(md: string) {
  const match = md.match(/^---\n([\s\S]*?)\n---\n?/);
  const data: Record<string, any> = {};
  if (match) {
    const lines = match[1].split('\n');
    let currentKey = '';
    for (const raw of lines) {
      if (!raw.trim()) continue;
      if (/^\s+/.test(raw) && currentKey) {
        const cont = raw.trim();
        if (Array.isArray(data[currentKey])) {
          const m = cont.match(/^[-*]\s*(.+)$/);
          if (m) (data[currentKey] as any[]).push(m[1]);
          else data[currentKey] = String(data[currentKey]).concat('\n', cont);
        } else {
          data[currentKey] = String(data[currentKey]).concat('\n', cont);
        }
        continue;
      }
      const idx = raw.indexOf(':');
      if (idx === -1) continue;
      const key = raw.slice(0, idx).trim();
      let val = raw.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith('\'') && val.endsWith('\''))) {
        val = val.slice(1, -1);
      }
      if (/^\[(.*)\]$/.test(val)) {
        const inner = val.slice(1, -1).trim();
        const arr = inner ? inner.split(',').map((s) => s.trim()).filter(Boolean) : [];
        data[key] = arr;
      } else if (key.toLowerCase() === 'tags' && /,/.test(val)) {
        data[key] = val.split(',').map((s) => s.trim()).filter(Boolean);
      } else {
        data[key] = val;
      }
      currentKey = key;
    }
  }
  const body = match ? md.slice(match[0].length) : md;
  return { data, body };
}
