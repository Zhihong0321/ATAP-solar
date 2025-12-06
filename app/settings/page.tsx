'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getSettings, setSettings, FontSize, UserSettings } from '@/utils/cookies';
import { Language } from '@/types/news';

export default function SettingsPage() {
  const [language, setLanguage] = useState<Language>('en');
  const [settings, setSettingsState] = useState<UserSettings>({
    fontSize: 'medium'
  });

  useEffect(() => {
    setSettingsState(getSettings());
  }, []);

  const handleFontSizeChange = (fontSize: FontSize) => {
    const newSettings = { ...settings, fontSize };
    setSettingsState(newSettings);
    setSettings({ fontSize });
  };

  const getFontSizeLabel = (size: FontSize): string => {
    switch (size) {
      case 'small':
        return 'Small';
      case 'large':
        return 'Large';
      default:
        return 'Medium';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentLanguage={language} onLanguageChange={setLanguage} />
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8">
          <header>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-text leading-tight">
              Settings
            </h1>
            <p className="mt-2 text-subtle">
              Customize your reading experience
            </p>
          </header>

          <div className="space-y-6 bg-surface rounded-lg border border-border p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text">Reading Preferences</h2>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-text">Font Size</h3>
                <div className="flex flex-wrap gap-2">
                  {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFontSizeChange(size)}
                      className={`px-4 py-2 rounded-md border transition-colors ${
                        settings.fontSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-text border-border hover:bg-surface'
                      }`}
                    >
                      {getFontSizeLabel(size)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-subtle mt-2">
                  {settings.fontSize === 'small' && 'Compact text for faster reading'}
                  {settings.fontSize === 'medium' && 'Standard font size for comfortable reading'}
                  {settings.fontSize === 'large' && 'Larger text for improved readability'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-text mb-4">About These Settings</h2>
            <p className="text-sm text-subtle leading-relaxed">
              Your preferences are saved locally in your browser and will be remembered for future visits. 
              These settings only affect your reading experience and do not impact how content is displayed to other users.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
