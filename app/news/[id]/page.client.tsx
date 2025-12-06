'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SocialShare } from '@/components/SocialShare';
import { FontSizeControls } from '@/components/FontSizeControls';
import { NewsItem, Language } from '@/types/news';
import { format } from '@/utils/format';
import { FEATURED_TAG_NAME } from '@/lib/constants';
import { getSettings, setSettings, FontSize, getFontSizeClass } from '@/utils/cookies';
import { formatCategoryDisplay, formatTagDisplay } from '@/utils/categoryFormat';

export function NewsDetailClient({ news: initialNews }: { news: NewsItem }) {
    const router = useRouter();

    const [language, setLanguage] = useState<Language>('en');
    const [fontSize, setFontSize] = useState<FontSize>('medium');
    const [news, setNews] = useState<NewsItem>(initialNews);

    useEffect(() => {
        setFontSize(getSettings().fontSize);
    }, []);

    // Normalize primary source to support string or object payloads from the API.
    const primarySource = news?.sources?.[0];
    const sourceUrl = typeof primarySource === 'string' ? primarySource : primarySource?.url;
    const sourceLabel = format.source(primarySource);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: news.title_en,
        description: news.content_en.substring(0, 160),
        datePublished: news.news_date,
        author: {
            '@type': 'Organization',
            name: 'Malaysia Solar Atap News',
        },
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header currentLanguage={language} onLanguageChange={setLanguage} />

            <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:py-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-subtle hover:text-text mb-6 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Back to News
                </Link>

                <article className="space-y-8 animate-fade-in">
                    <header className="space-y-4">
                        <h1
                            className="font-serif text-3xl md:text-5xl font-bold text-text leading-tight"
                            dangerouslySetInnerHTML={{ __html: format.titleByLang(news, language) }}
                        />

                        <div className="flex flex-wrap items-center gap-4 text-sm text-textSecondary">
                            <span className="font-medium text-accent">
                                {format.date(news.news_date)}
                            </span>
                            {news.category && (
                                <>
                                    <span className="text-subtle">•</span>
                                    <span className="font-medium text-text">{formatCategoryDisplay(news.category, language)}</span>
                                </>
                            )}
                            {primarySource && (
                                <>
                                    <span className="text-subtle">•</span>
                                    {sourceUrl ? (
                                        <a
                                            href={sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-accent hover:text-accent/80 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" /><path d="M8.5 8.5v.01" /><path d="M16 12v.01" /><path d="M12 16v.01" /></svg>
                                            {sourceLabel}
                                        </a>
                                    ) : (
                                        <span className="flex items-center gap-1 text-textSecondary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" /><path d="M8.5 8.5v.01" /><path d="M16 12v.01" /><path d="M12 16v.01" /></svg>
             
                                            {sourceLabel}
                                        </span>
                                    )}
                                </>
                            )}
                        </div>

                        {news.tags && news.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {news.tags.filter(t => t.name !== FEATURED_TAG_NAME).map(tag => (
                                    <span key={tag.id} className="text-xs font-medium text-subtle bg-surface border border-border px-2 py-1 rounded-full">
                                        #{formatTagDisplay(tag, language)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    <div className="flex items-center justify-between mb-6">
                        <FontSizeControls
                            onFontSizeChange={(newSize) => setFontSize(newSize)}
                        />
                        <Link
                            href="/settings"
                            className="text-sm text-accent hover:text-accent/80 transition-colors"
                        >
                            More Settings
                        </Link>
                    </div>

                    <div
                        className={`prose prose-lg prose-stone max-w-none text-text/90 leading-relaxed whitespace-pre-line ${getFontSizeClass(fontSize)}`}
                        dangerouslySetInnerHTML={{ __html: format.contentByLang(news, language) }}
                    />

                    <SocialShare
                        title={format.titleByLang(news, language)}
                        language={language}
                    />
                </article>
            </main>

            <Footer />
        </div>
    );
}
