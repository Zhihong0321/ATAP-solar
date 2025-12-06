import { NewsItem } from '@/types/news';

const API_BASE = 'https://atap-api-production.up.railway.app';

type BasePayload = {
  title_en: string;
  title_cn: string;
  title_my: string;
  content_en: string;
  content_cn: string;
  content_my: string;
  news_date: string;
  image_url?: string;
  sources?: { name: string; url?: string }[];
  is_published?: boolean;
  is_highlight?: boolean;
  category_id?: string | null;
  tag_ids?: string[];
};

async function request<T>(path: string, init: RequestInit = {}) {
  const url = new URL(path, API_BASE);
  const res = await fetch(url.toString(), init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  if (res.status === 204) return null as T;
  return (await res.json()) as T;
}

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export async function adminCreateNews(token: string, payload: BasePayload): Promise<NewsItem> {
  // Send both casing styles to ensure backend compatibility
  const dualPayload = {
    ...payload,
    categoryId: payload.category_id,
  };

  const data: any = await request<any>('/api/v1/news', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dualPayload)
  });
  return data.data ?? data;
}

export async function adminUpdateNews(
  token: string,
  id: string,
  payload: Partial<BasePayload>
): Promise<NewsItem> {
  // Send both casing styles to ensure backend compatibility
  const dualPayload = {
    ...payload,
    categoryId: payload.category_id,
  };
  
  const data: any = await request<any>(`/api/v1/news/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(dualPayload)
  });
  return data.data ?? data;
}

export async function adminPublishNews(
  token: string,
  id: string,
  payload: { is_published?: boolean; is_highlight?: boolean }
): Promise<NewsItem> {
  const data: any = await request<any>(`/api/v1/news/${id}/publish`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
  return data.data ?? data;
}

export async function adminDeleteNews(token: string, id: string): Promise<void> {
  await request<void>(`/api/v1/news/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
    body: JSON.stringify({})
  });
}
