import { Type, Minus, Plus, AlignLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

import { Tooltip } from './Tooltip';

interface ReadingModeSettings {
  fontFamily: 'sans' | 'serif';
  fontSize: number;
  lineHeight: number;
}

interface ReadingModeToggleProps {
  onChange?: (settings: ReadingModeSettings) => void;
}

export function ReadingModeToggle({ onChange }: ReadingModeToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<ReadingModeSettings>({
    fontFamily: 'sans',
    fontSize: 16,
    lineHeight: 1.7,
  });

  useEffect(() => {
    const saved = localStorage.getItem('readingMode');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      onChange?.(parsed);
    }
  }, []);

  const updateSettings = (newSettings: Partial<ReadingModeSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('readingMode', JSON.stringify(updated));
    onChange?.(updated);
  };

  return (
    <div className="fixed bottom-8 right-24 z-40 hidden lg:block">
      <Tooltip content="Reading Mode" position="left">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 rounded-full glass hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle reading mode settings"
        >
          <Type className="w-5 h-5" />
        </motion.button>
      </Tooltip>

      {isOpen && (
        <motion.div
          className="absolute bottom-full right-0 mb-2 p-4 glass rounded-lg shadow-xl min-w-[240px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Font Family</label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSettings({ fontFamily: 'sans' })}
                  className={`flex-1 px-3 py-2 rounded text-sm transition-all ${
                    settings.fontFamily === 'sans'
                      ? 'bg-[rgb(var(--color-primary))] text-white'
                      : 'bg-[rgb(var(--color-bg-subtle))]'
                  }`}
                >
                  Sans
                </button>
                <button
                  onClick={() => updateSettings({ fontFamily: 'serif' })}
                  className={`flex-1 px-3 py-2 rounded text-sm transition-all ${
                    settings.fontFamily === 'serif'
                      ? 'bg-[rgb(var(--color-primary))] text-white'
                      : 'bg-[rgb(var(--color-bg-subtle))]'
                  }`}
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Serif
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Font Size</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateSettings({ fontSize: Math.max(12, settings.fontSize - 1) })
                  }
                  className="p-2 rounded bg-[rgb(var(--color-bg-subtle))] hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all"
                  aria-label="Decrease font size"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center text-sm">{settings.fontSize}px</span>
                <button
                  onClick={() =>
                    updateSettings({ fontSize: Math.min(24, settings.fontSize + 1) })
                  }
                  className="p-2 rounded bg-[rgb(var(--color-bg-subtle))] hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all"
                  aria-label="Increase font size"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Line Height</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateSettings({ lineHeight: Math.max(1.2, settings.lineHeight - 0.1) })
                  }
                  className="p-2 rounded bg-[rgb(var(--color-bg-subtle))] hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all"
                  aria-label="Decrease line height"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center text-sm">
                  {settings.lineHeight.toFixed(1)}
                </span>
                <button
                  onClick={() =>
                    updateSettings({ lineHeight: Math.min(2.5, settings.lineHeight + 0.1) })
                  }
                  className="p-2 rounded bg-[rgb(var(--color-bg-subtle))] hover:bg-[rgb(var(--color-primary))] hover:text-white transition-all"
                  aria-label="Increase line height"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
