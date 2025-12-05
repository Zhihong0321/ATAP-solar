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

export const format = {
  titleByLang,
  contentByLang,
  date
};
