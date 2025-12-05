import Image from 'next/image';
import Link from 'next/link';

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
            src="/logo.png"
            alt="Malaysia Solar Atap News"
            width={150}
            height={50}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        
        <div className="flex items-center gap-6">
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
