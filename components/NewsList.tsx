import Link from 'next/link';
import { NewsItem, Language } from '@/types/news';
import { format } from '@/utils/format';
import { FEATURED_TAG_NAME } from '@/lib/constants';
import { formatCategoryDisplay, formatTagDisplay } from '@/utils/categoryFormat';

type NewsListProps = {
  items: NewsItem[];
  language: Language;
};

export function NewsList({ items, language }: NewsListProps) {
  if (!items.length) return null;

  return (
    <section className="w-full px-4 pb-12">
      <div className="flex flex-col gap-8">
        {items.map((news) => (
          <Link 
            key={news.id} 
            href={`/news/${news.id}`}
            className="block"
          >
            <article
              className="flex flex-row items-start gap-4 md:gap-8 cursor-pointer group"
            >
              <div className="flex-1 space-y-3">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-text leading-snug group-hover:text-accent transition-colors"
                  dangerouslySetInnerHTML={{ __html: format.titleByLang(news, language) }}
                />
                <div className="text-sm text-textSecondary leading-relaxed line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: format.contentByLang(news, language) }}
                />
                <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
                  {news.category && (
                    <span className="text-accent bg-accent/10 px-2 py-0.5 rounded">
                      {formatCategoryDisplay(news.category, language)}
                    </span>
                  )}
                  {news.sources?.length > 0 && (
                     <span className="text-textSecondary bg-surface border border-border px-2 py-0.5 rounded flex items-center gap-1">
                       <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 12v.01"/><path d="M12 16v.01"/></svg>
                       {format.source(news.sources[0])}
                     </span>
                  )}
                  {news.tags?.filter(t => t.name !== FEATURED_TAG_NAME).map(tag => (
                    <span key={tag.id} className="text-subtle bg-surface border border-border px-2 py-0.5 rounded">
                      #{formatTagDisplay(tag, language)}
                    </span>
                  ))}
                  <span className="text-subtle py-0.5">
                     • 1 min ago
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}