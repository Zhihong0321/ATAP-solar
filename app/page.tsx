'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { HighlightCarousel } from '@/components/HighlightCarousel';
import { NewsList } from '@/components/NewsList';
import DateSelector from '@/components/DateSelector';
import { Footer } from '@/components/Footer';
import { StockTicker } from '@/components/StockTicker';
import { Language, NewsItem } from '@/types/news';
import { fetchNews } from '@/lib/news';
import { fetchCategories, Category } from '@/lib/categories';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [remoteNews, remoteCategories] = await Promise.all([
          fetchNews({ published: true }),
          fetchCategories().catch(() => []) // Silently fail if categories fail, just empty
        ]);
        
        if (remoteNews.length) {
          setNews(remoteNews);
        }
        setCategories(remoteCategories);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        // No fallback to mock data
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Logic for Main Category (Featured or First)
  const mainCategory = useMemo(() => {
    if (!categories.length) return null;
    return categories.find(c => c.name === 'Featured') || categories[0];
  }, [categories]);

  const otherCategories = useMemo(() => {
    if (!mainCategory) return [];
    return categories.filter(c => c.id !== mainCategory.id);
  }, [categories, mainCategory]);

  const mainNews = useMemo(() => {
    if (!mainCategory) return news; // If no categories, show all? Or show none? 
    // If we have categories, strictly filter. If we have no categories (backend issue), show all news to avoid empty page?
    // User requirement: "news in this category will be publish to news slot".
    // If categories exist, we filter.
    if (categories.length > 0) {
      return news.filter(n => n.category?.id === mainCategory.id);
    }
    return news;
  }, [news, mainCategory, categories]);

  const highlightedMain = useMemo(
    () =>
      mainNews
        .filter((n) => n.is_highlight)
        .sort((a, b) => new Date(b.news_date).getTime() - new Date(a.news_date).getTime()),
    [mainNews]
  );

  const sortedMainNews = useMemo(
    () => mainNews.sort((a, b) => new Date(b.news_date).getTime() - new Date(a.news_date).getTime()),
    [mainNews]
  );

  // Split other categories for layout
  const midIndex = Math.ceil(otherCategories.length / 2);
  const categoriesAbove = otherCategories.slice(0, midIndex);
  const categoriesBelow = otherCategories.slice(midIndex);

  const getNewsForCategory = (catId: string) => {
    return news
      .filter(n => n.category?.id === catId)
      .sort((a, b) => new Date(b.news_date).getTime() - new Date(a.news_date).getTime());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentLanguage={language} onLanguageChange={setLanguage} />
      
      <main className="mx-auto max-w-3xl flex flex-col gap-2 pb-10">
        
        {/* Main Category Section */}
        {mainCategory && categories.length > 0 && (
           <div className="px-4 py-2">
             <span className="text-xs font-bold tracking-wider text-accent uppercase">
               Featured Section
             </span>
             <h2 className="text-2xl font-bold text-text">{mainCategory.name}</h2>
           </div>
        )}

        {/* Featured Carousel (Main Category Only) */}
        <HighlightCarousel items={highlightedMain.length ? highlightedMain : sortedMainNews.slice(0, 5)} language={language} />
        
        {/* Date Timeline */}
        <DateSelector />
        
        {/* News Feed (Main Category) */}
        <NewsList items={sortedMainNews} language={language} />

        {/* Other Categories (Above Stock) */}
        <div className="flex flex-col gap-12 mt-8">
          {categoriesAbove.map(cat => {
            const catNews = getNewsForCategory(cat.id);
            if (!catNews.length) return null;
            return (
              <section key={cat.id} className="border-t border-border pt-8">
                <div className="px-4 mb-6">
                  <h2 className="text-2xl font-bold text-text">{cat.name}</h2>
                </div>
                <NewsList items={catNews} language={language} />
              </section>
            );
          })}
        </div>
      </main>

      <StockTicker />
      
      <main className="mx-auto max-w-3xl flex flex-col gap-2 pb-10">
        {/* Other Categories (Below Stock) */}
        <div className="flex flex-col gap-12 mt-8">
          {categoriesBelow.map(cat => {
            const catNews = getNewsForCategory(cat.id);
            if (!catNews.length) return null;
            return (
              <section key={cat.id} className="border-t border-border pt-8">
                <div className="px-4 mb-6">
                  <h2 className="text-2xl font-bold text-text">{cat.name}</h2>
                </div>
                <NewsList items={catNews} language={language} />
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}