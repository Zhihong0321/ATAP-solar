const API_BASE = 'https://atap-api-production.up.railway.app';

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

export async function adminProcessRewrites(token: string): Promise<void> {
  await request<void>('/api/v1/news-leads/process-rewrites', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({})
  });
}
