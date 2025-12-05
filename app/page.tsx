'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { HighlightCarousel } from '@/components/HighlightCarousel';
import { NewsList } from '@/components/NewsList';
import DateSelector from '@/components/DateSelector';
import { Footer } from '@/components/Footer';
import { StockTicker } from '@/components/StockTicker';
import { mockNews } from '@/data/mockNews';
import { Language, NewsItem } from '@/types/news';
import { fetchNews } from '@/lib/news';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const remote = await fetchNews({ published: true });
        if (remote.length) {
          setNews(remote);
        }
      } catch (err) {
        console.warn('Falling back to mock data', err);
        setNews(mockNews);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const publishedNews = useMemo(
    () =>
      news
        .filter((n) => n.is_published)
        .sort((a, b) => new Date(b.news_date).getTime() - new Date(a.news_date).getTime()),
    [news]
  );

  const highlighted = useMemo(
    () =>
      publishedNews
        .filter((n) => n.is_highlight)
        .sort((a, b) => new Date(b.news_date).getTime() - new Date(a.news_date).getTime()),
    [publishedNews]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header currentLanguage={language} onLanguageChange={setLanguage} />
      
      <main className="mx-auto max-w-3xl flex flex-col gap-2 pb-10">
        {/* Featured Carousel */}
        <HighlightCarousel items={highlighted.length ? highlighted : publishedNews.slice(0, 5)} language={language} />
        
        {/* Date Timeline */}
        <DateSelector />
        
        {/* News Feed */}
        <NewsList items={publishedNews} language={language} />
      </main>
      <StockTicker />
      <Footer />
    </div>
  );
}