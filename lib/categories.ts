const API_BASE = 'https://atap-api-production.up.railway.app';

export type Tag = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
  tags?: Tag[];
};

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

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

// --- Categories ---

export async function fetchCategories(): Promise<Category[]> {
  const data = await request<any>('/api/v1/categories', {
    cache: 'no-store'
  });
  // Adjust based on actual API response structure (data.data or direct array)
  return (data.data ?? data) as Category[];
}

export async function createCategory(token: string, name: string): Promise<Category> {
  return request<Category>('/api/v1/categories', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ name })
  });
}

export async function deleteCategory(token: string, id: string): Promise<void> {
  await request<void>(`/api/v1/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  });
}

export async function updateCategory(token: string, id: string, name: string): Promise<Category> {
  return request<Category>(`/api/v1/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ name })
  });
}

// --- Tags ---

export async function createTag(token: string, categoryId: string, name: string): Promise<Tag> {
  return request<Tag>(`/api/v1/categories/${categoryId}/tags`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ name })
  });
}

export async function deleteTag(token: string, tagId: string): Promise<void> {
  await request<void>(`/api/v1/tags/${tagId}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  });
}
