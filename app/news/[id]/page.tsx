'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchNewsById } from '@/lib/news';
import { NewsItem, Language } from '@/types/news';
import { format } from '@/utils/format';
import { FEATURED_TAG_NAME } from '@/lib/constants';

export default function NewsDetail() {
  const { id } = useParams();
  const router = useRouter();
  
  const [language, setLanguage] = useState<Language>('en');
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const load = async () => {
      setLoading(true);
      try {
        const item = await fetchNewsById(id as string);
        if (item) {
          setNews(item);
        } else {
           setError(true);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header currentLanguage={language} onLanguageChange={setLanguage} />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-subtle">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header currentLanguage={language} onLanguageChange={setLanguage} />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <p className="text-textSecondary">News item not found.</p>
          <Link href="/" className="text-accent hover:underline">
            Return Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Placeholder logic consistent with NewsList
  const bgImage = news.image_url || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentLanguage={language} onLanguageChange={setLanguage} />
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-subtle hover:text-text mb-6 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Back to News
        </Link>

        <article className="space-y-8 animate-fade-in">
          <header className="space-y-4">
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-text leading-tight">
              {format.titleByLang(news, language)}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-textSecondary">
              <span className="font-medium text-accent">
                {format.date(news.news_date)}
              </span>
              {news.category && (
                <>
                  <span className="text-subtle">•</span>
                  <span className="font-medium text-text">{news.category.name}</span>
                </>
              )}
              {news.sources.length > 0 && (
                <>
                  <span className="text-subtle">•</span>
                  <span>{news.sources[0].name}</span>
                </>
              )}
            </div>
            
            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {news.tags.filter(t => t.name !== FEATURED_TAG_NAME).map(tag => (
                  <span key={tag.id} className="text-xs font-medium text-subtle bg-surface border border-border px-2 py-1 rounded-full">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
            <Image 
              src={bgImage} 
              alt={format.titleByLang(news, language)}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg prose-stone max-w-none text-text/90 leading-relaxed whitespace-pre-line">
            {format.contentByLang(news, language)}
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
