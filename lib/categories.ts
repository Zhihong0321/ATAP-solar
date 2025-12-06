const API_BASE = 'https://atap-api-production.up.railway.app';

export type Tag = {
  id: string;
  name: string;
  // Optional multilingual support if added later
  name_en?: string;
  name_cn?: string;
  name_my?: string;
};

export type Category = {
  id: string;
  name: string;
  // Optional multilingual support if added later
  name_en?: string;
  name_cn?: string;
  name_my?: string;
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
  try {
    const data = await request<any>('/api/v1/categories', {
      cache: 'no-store'
    });
    // Adjust based on actual API response structure (data.data or direct array)
    return (data.data ?? data) as Category[];
  } catch (error: any) {
    console.error('Failed to fetch categories:', error);
    
    // Check if error is due to schema mismatch
    if (error.message?.includes('name_en') || error.message?.includes('name_cn') || error.message?.includes('name_my')) {
      console.warn('Database schema mismatch - using fallback categories');
      // Fallback to default categories when schema mismatch occurs
      return [
        { id: '1', name: 'Solar Policy', tags: [] },
        { id: '2', name: 'Renewable Energy', tags: [] },
        { id: '3', name: 'Industry News', tags: [] },
        { id: '4', name: 'ATAP Updates', tags: [] }
      ];
    }
    
    // Fallback to default categories in case API is down
    return [
      { id: '1', name: 'Solar Policy', tags: [] },
      { id: '2', name: 'Renewable Energy', tags: [] },
      { id: '3', name: 'Industry News', tags: [] },
      { id: '4', name: 'ATAP Updates', tags: [] }
    ];
  }
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
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      // Custom header to indicate client expects base schema only
      'X-Schema-Version': 'base-name-only'
    },
    body: JSON.stringify({})
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
    headers: authHeaders(token),
    body: JSON.stringify({})
  });
}
