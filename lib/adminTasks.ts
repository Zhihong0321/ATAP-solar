const API_BASE = 'https://atap-api-production.up.railway.app';

export type NewsTask = {
  id: string;
  query: string;
  account_name?: string;
  collection_uuid?: string;
  created_at?: string;
  category_id?: string;
};

export type CreateTaskPayload = {
  query: string;
  account_name?: string;
  collection_uuid?: string;
  category_id: string;
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

export async function adminFetchTasks(token: string): Promise<NewsTask[]> {
  const data: any = await request<any>('/api/v1/news-tasks', {
    headers: authHeaders(token)
  });
  const items = data.data ?? data;
  return Array.isArray(items) ? items : [];
}

export async function adminCreateTask(token: string, payload: CreateTaskPayload): Promise<NewsTask> {
  const data: any = await request<any>('/api/v1/news-tasks', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
  return data.data ?? data;
}

export async function adminUpdateTask(
  token: string,
  id: string,
  payload: Partial<CreateTaskPayload>
): Promise<NewsTask> {
  const data: any = await request<any>(`/api/v1/news-tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
  return data.data ?? data;
}

export async function adminDeleteTask(token: string, id: string): Promise<void> {
  await request<void>(`/api/v1/news-tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
    body: JSON.stringify({})
  });
}

export async function adminRunTask(token: string, id: string): Promise<void> {
  await request<void>(`/api/v1/news-tasks/${id}/run`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({})
  });
}
