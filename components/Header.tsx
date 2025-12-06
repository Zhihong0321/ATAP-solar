import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo-v2.png';

type HeaderProps = {
  onLanguageChange?: (lang: 'en' | 'cn' | 'my') => void;
  currentLanguage: 'en' | 'cn' | 'my';
};

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'cn', label: '中文' },
  { code: 'my', label: 'MY' }
] as const;

export function Header({ onLanguageChange, currentLanguage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="block">
          <Image
            src={logo}
            alt="Malaysia Solar Atap News"
            width={150}
            height={50}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/settings"
            className="flex items-center gap-1 text-subtle hover:text-text transition-colors"
            title="Settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </Link>

          {/* Weather Widget Placeholder */}
          <div className="flex items-center gap-2 text-amber-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
            <span className="text-lg font-medium text-textSecondary">28°</span>
          </div>

          {/* Minimal Language Switcher */}
          <div className="flex items-center gap-2 text-sm">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange?.(lang.code)}
                className={`transition-colors ${
                  currentLanguage === lang.code
                    ? 'font-bold text-text'
                    : 'text-subtle hover:text-text'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
