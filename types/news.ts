export type Language = 'en' | 'cn' | 'my';

export type NewsTag = {
  id: string;
  name: string;
  // Optional multilingual support if added later
  name_en?: string;
  name_cn?: string;
  name_my?: string;
};

export type NewsCategory = {
  id: string;
  name: string;
  // Optional multilingual support if added later
  name_en?: string;
  name_cn?: string;
  name_my?: string;
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
  sources: string[]; // URLs
  is_published: boolean;
  is_highlight: boolean;
  category_id?: string;
  category?: NewsCategory;
  tags?: NewsTag[];
};
