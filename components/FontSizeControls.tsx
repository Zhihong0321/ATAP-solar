'use client';

import { FontSize, getSettings, setSettings } from '@/utils/cookies';
import { useState, useEffect } from 'react';

interface FontSizeControlsProps {
  showLabel?: boolean;
  onFontSizeChange?: (fontSize: FontSize) => void;
}

export function FontSizeControls({ showLabel = true, onFontSizeChange }: FontSizeControlsProps) {
  const [fontSize, setFontSize] = useState<FontSize>('medium');

  useEffect(() => {
    setFontSize(getSettings().fontSize);
  }, []);

  const handleDecrease = () => {
    const newSize = fontSize === 'large' ? 'medium' : fontSize === 'medium' ? 'small' : 'small';
    setFontSize(newSize);
    setSettings({ fontSize: newSize });
    onFontSizeChange?.(newSize);
  };

  const handleIncrease = () => {
    const newSize = fontSize === 'small' ? 'medium' : fontSize === 'medium' ? 'large' : 'large';
    setFontSize(newSize);
    setSettings({ fontSize: newSize });
    onFontSizeChange?.(newSize);
  };

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className="text-sm text-subtle">Font Size:</span>
      )}
      <div className="flex items-center gap-1">
        <button
          onClick={handleDecrease}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-surface hover:bg-surface/80 transition-colors"
          aria-label="Decrease font size"
          disabled={fontSize === 'small'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
          </svg>
        </button>
        <span className="text-sm font-medium text-text px-2 min-w-[60px] text-center">
          {fontSize === 'small' ? 'Small' : fontSize === 'large' ? 'Large' : 'Medium'}
        </span>
        <button
          onClick={handleIncrease}
          className="flex items-center justify-center w-8 h-8 rounded-md border border-border bg-surface hover:bg-surface/80 transition-colors"
          aria-label="Increase font size"
          disabled={fontSize === 'large'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14"/>
            <path d="M5 12h14"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
