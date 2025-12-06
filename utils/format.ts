import { Language, NewsItem } from '@/types/news';

function titleByLang(news: NewsItem, lang: Language) {
  switch (lang) {
    case 'cn':
      return news.title_cn;
    case 'my':
      return news.title_my;
    default:
      return news.title_en;
  }
}

function contentByLang(news: NewsItem, lang: Language) {
  switch (lang) {
    case 'cn':
      return news.content_cn;
    case 'my':
      return news.content_my;
    default:
      return news.content_en;
  }
}

function date(value: string) {
  const dt = new Date(value);
  return dt.toLocaleDateString('en-MY', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function source(raw: unknown) {
  if (!raw) return 'Source';

  // Strings: keep existing hostname extraction.
  if (typeof raw === 'string') {
    try {
      const { hostname } = new URL(raw);
      return hostname.replace('www.', '');
    } catch {
      return raw;
    }
  }

  // Objects from API: prefer name, then url hostname, then stringify safely.
  if (typeof raw === 'object') {
    const obj = raw as { name?: string; url?: string };
    if (obj.name) return obj.name;
    if (obj.url) {
      try {
        const { hostname } = new URL(obj.url);
        return hostname.replace('www.', '');
      } catch {
        return obj.url;
      }
    }
    return '[source]';
  }

  // Fallback for numbers/others.
  return String(raw);
}

export const format = {
  titleByLang,
  contentByLang,
  date,
  source
};
