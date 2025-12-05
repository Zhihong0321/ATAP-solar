export type Language = 'en' | 'cn' | 'my';

export type NewsSource = {
  name: string;
  url?: string;
};

export type NewsItem = {
  id: string;
  title_en: string;
  title_cn: string;
  title_my: string;
  content_en: string;
  content_cn: string;
  content_my: string;
  news_date: string;
  sources: NewsSource[];
  is_published: boolean;
  is_highlight: boolean;
};
