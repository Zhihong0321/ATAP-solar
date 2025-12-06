import Image from 'next/image';
import Link from 'next/link';
import { NewsItem, Language } from '@/types/news';
import { format } from '@/utils/format';

type NewsListProps = {
  items: NewsItem[];
  language: Language;
};

export function NewsList({ items, language }: NewsListProps) {
  if (!items.length) return null;

  // Placeholder image for list items
  const placeholderImg = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80';

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
                <h3 className="font-serif text-xl md:text-2xl font-bold text-text leading-snug group-hover:text-accent transition-colors">
                  {format.titleByLang(news, language)}
                </h3>
                <p className="text-sm text-textSecondary leading-relaxed line-clamp-2">
                  {format.contentByLang(news, language)}
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
                  {news.category && (
                    <span className="text-accent bg-accent/10 px-2 py-0.5 rounded">
                      {news.category.name}
                    </span>
                  )}
                  {news.tags?.map(tag => (
                    <span key={tag.id} className="text-subtle bg-surface border border-border px-2 py-0.5 rounded">
                      #{tag.name}
                    </span>
                  ))}
                  <span className="text-subtle py-0.5">
                     • 1 min ago
                  </span>
                </div>
              </div>
              
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                 {/* Ideally use news.image_url if available */}
                 <Image 
                   src={placeholderImg} 
                   alt=""
                   fill
                   className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                 />
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}