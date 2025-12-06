const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'https://atap-api-production.up.railway.app';

export type NewsTask = {
  id: string;
  query: string;
  account_name?: string;
  collection_uuid?: string;
  created_at?: string;
};

export type CreateTaskPayload = {
  query: string;
  account_name?: string;
  collection_uuid?: string;
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
  return request<NewsTask[]>('/api/v1/news-tasks', {
    headers: authHeaders(token)
  });
}

export async function adminCreateTask(token: string, payload: CreateTaskPayload): Promise<NewsTask> {
  return request<NewsTask>('/api/v1/news-tasks', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function adminUpdateTask(
  token: string,
  id: string,
  payload: Partial<CreateTaskPayload>
): Promise<NewsTask> {
  return request<NewsTask>(`/api/v1/news-tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function adminDeleteTask(token: string, id: string): Promise<void> {
  await request<void>(`/api/v1/news-tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  });
}

export async function adminRunTask(token: string, id: string): Promise<void> {
  await request<void>(`/api/v1/news-tasks/${id}/run`, {
    method: 'POST',
    headers: authHeaders(token)
  });
}
