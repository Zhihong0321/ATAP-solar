import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { NewsItem, Language } from '@/types/news';
import { format } from '@/utils/format';

type HighlightCarouselProps = {
  items: NewsItem[];
  language: Language;
};

const AUTO_PLAY_MS = 6000;

export function HighlightCarousel({ items, language }: HighlightCarouselProps) {
  const [index, setIndex] = useState(0);
  const slides = useMemo(() => items.slice(0, 5), [items]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const active = slides[index];
  if (!active) return null;

  return (
    <section className="relative w-full px-4 pt-2 pb-6">
      <Link href={`/news/${active.id}`} className="block w-full">
        <div className="relative aspect-[16/10] md:aspect-[2/1] w-full overflow-hidden rounded-3xl shadow-xl cursor-pointer group bg-surface">
          {/* Background Placeholder Gradient */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 group-hover:scale-105 transition-transform duration-700 ease-out" />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-2xl animate-fade-in">
                <h2 
                  className="font-serif text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg"
                  dangerouslySetInnerHTML={{ __html: format.titleByLang(active, language) }}
                />
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white font-medium">
                      Featured
                  </span>
                  {active.sources?.length > 0 && (
                     <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white/90 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 12v.01"/><path d="M12 16v.01"/></svg>
                        {format.source(active.sources[0])}
                     </span>
                  )}
                </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Indicators - simplified dots below */}
      <div className="flex justify-center mt-6 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === index ? 'w-8 bg-accent' : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}