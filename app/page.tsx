'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { HighlightCarousel } from '@/components/HighlightCarousel';
import { Countdown } from '@/components/Countdown';
import { NewsList } from '@/components/NewsList';
import { Footer } from '@/components/Footer';
import { StockTicker } from '@/components/StockTicker';
import { Language, NewsItem } from '@/types/news';
import { fetchNews } from '@/lib/news';
import { fetchCategories, Category } from '@/lib/categories';
import { FEATURED_TAG_NAME } from '@/lib/constants';

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
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Logic for Main Category (Featured or First)
  const mainCategory = useMemo(() => {
    if (!categories.length) return null;
    // Find category with the featured tag
    const featured = categories.find(c => c.tags?.some(t => t.name === FEATURED_TAG_NAME));
    if (featured) return featured;
    
    // Fallback: Try "Featured" name or first one
    return categories.find(c => c.name === 'Featured') || categories[0];
  }, [categories]);

  const otherCategories = useMemo(() => {
    if (!mainCategory) return [];
    return categories.filter(c => c.id !== mainCategory.id);
  }, [categories, mainCategory]);

  const mainNews = useMemo(() => {
    if (!mainCategory) return news.filter(n => n.is_published); // Fallback if no categories
    // If categories exist, we filter.
    if (categories.length > 0) {
      return news.filter(n => 
        n.is_published && (
          n.category?.id === mainCategory.id || 
          n.category_id === mainCategory.id
        )
      );
    }
    return news.filter(n => n.is_published);
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

  // Helper function to get news for a specific category
  const getNewsForCategory = (catId: string) => {
    return news
      .filter(n => 
        n.is_published && (
          n.category?.id === catId || 
          n.category_id === catId
        )
      )
      .sort((a, b) => new Date(b.news_date).getTime() - new Date(a.news_date).getTime());
  };

  // Identify news that didn't fit into Main or any specific Category sections
  const uncategorizedNews = useMemo(() => {
    const categorizedIds = new Set<string>();
    
    // Add Main Category News IDs
    mainNews.forEach(n => categorizedIds.add(n.id));
    
    // Add Other Categories News IDs
    otherCategories.forEach(cat => {
      // Re-use logic inline to satisfy linter or extract to useCallback
      // Since it's inside useMemo, we can just filter here directly to track IDs
      const catNews = news.filter(n => 
        n.is_published && (
          n.category?.id === cat.id || 
          n.category_id === cat.id
        )
      );
      catNews.forEach(n => categorizedIds.add(n.id));
    });

    // Return news not in the set
    return news
      .filter(n => n.is_published && !categorizedIds.has(n.id))
      .sort((a, b) => new Date(b.news_date).getTime() - new Date(a.news_date).getTime());
  }, [news, mainNews, otherCategories]);

  return (
    <div className="min-h-screen bg-background">
      <Header currentLanguage={language} onLanguageChange={setLanguage} />
      
      <main className="mx-auto max-w-3xl flex flex-col gap-2 pb-10">

        <Countdown />
        
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

        {/* Fallback: Uncategorized / Latest News */}
        {uncategorizedNews.length > 0 && (
          <section className="border-t border-border pt-8 mt-8">
            <div className="px-4 mb-6">
              <h2 className="text-2xl font-bold text-text">Latest News</h2>
            </div>
            <NewsList items={uncategorizedNews} language={language} />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}