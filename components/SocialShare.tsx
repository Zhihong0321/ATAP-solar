'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faWhatsapp, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faLink, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type SocialShareProps = {
  title: string;
  language: string;
};

export function SocialShare({ title, language }: SocialShareProps) {
  const pathname = usePathname();
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Construct URL with language param if needed, or just current path
    // Requirement: maintain language selection when share
    // Since our app uses client-side state for language, we might need to append ?lang=xx
    // But currently the app doesn't seem to persist lang in URL params (based on my read of page.tsx).
    // Let's assume we want to pass it as a query param so the receiver opens it in that language if we implement that logic later.
    // For now, I will append ?lang={language} to the shared URL.
    
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        // Clean up any existing params first if we want strict control, or just set lang
        url.searchParams.set('lang', language);
        setCurrentUrl(url.toString());
    }
  }, [pathname, language]);

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Whatsapp',
      icon: faWhatsapp,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:text-green-500'
    },
    {
      name: 'Facebook',
      icon: faFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-blue-600'
    },
    {
      name: 'X (Twitter)',
      icon: faTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-black'
    },
    {
      name: 'LinkedIn',
      icon: faLinkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:text-blue-700'
    },
    {
        name: 'Email',
        icon: faEnvelope,
        url: `mailto:?subject=${encodedTitle}&body=Check this out: ${encodedUrl}`,
        color: 'hover:text-gray-600'
    }
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (!currentUrl) return null;

  return (
    <div className="flex flex-col gap-3 py-6 border-t border-border mt-8">
      <span className="text-sm font-semibold text-subtle uppercase tracking-wider">
        Share this story
      </span>
      <div className="flex items-center gap-4 flex-wrap">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-textSecondary transition-colors text-xl ${link.color}`}
            aria-label={`Share on ${link.name}`}
            title={`Share on ${link.name}`}
          >
            <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
          </a>
        ))}
        
        <button
          onClick={handleCopy}
          className="text-textSecondary hover:text-accent transition-colors text-xl relative group"
          aria-label="Copy Link"
          title="Copy Link"
        >
          <FontAwesomeIcon icon={faLink} className="w-5 h-5" />
          {copied && (
             <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded shadow-lg whitespace-nowrap animate-fade-in">
               Copied!
             </span>
          )}
        </button>
      </div>
    </div>
  );
}
