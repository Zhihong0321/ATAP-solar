export type Language = 'en' | 'cn' | 'my';

export type NewsSource = {
  name: string;
  url?: string;
};

export type NewsTag = {
  id: string;
  name: string;
};

export type NewsCategory = {
  id: string;
  name: string;
  tags?: NewsTag[];
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
  image_url?: string;
  sources: NewsSource[];
  is_published: boolean;
  is_highlight: boolean;
  category_id?: string;
  category?: NewsCategory;
  tags?: NewsTag[];
};
