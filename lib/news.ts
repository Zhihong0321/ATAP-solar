import { NewsItem } from '@/types/news';

const API_BASE = 'https://atap-api-production.up.railway.app';

type FetchNewsParams = {
  published?: boolean;
  highlight?: boolean;
  limit?: number;
  offset?: number;
  content_status?: 'empty' | 'filled';
};

export async function fetchNews(params: FetchNewsParams = {}): Promise<NewsItem[]> {
  const url = new URL('/api/v1/news', API_BASE);
  if (params.published !== undefined) url.searchParams.set('published', String(params.published));
  if (params.highlight !== undefined) url.searchParams.set('highlight', String(params.highlight));
  if (params.limit !== undefined) url.searchParams.set('limit', String(params.limit));
  if (params.offset !== undefined) url.searchParams.set('offset', String(params.offset));
  if (params.content_status !== undefined) url.searchParams.set('content_status', params.content_status);

  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch news: ${res.status}`);
  }

  const data = await res.json();
  // API returns { data: NewsItem[] }
  const items = (data.data ?? data);
  return Array.isArray(items) ? items as NewsItem[] : [];
}

export async function fetchNewsById(id: string): Promise<NewsItem | null> {
  const url = new URL(`/api/v1/news/${id}`, API_BASE);
  try {
    const res = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch news item: ${res.status}`);
    }

    return (await res.json()) as NewsItem;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    return null;
  }
}
