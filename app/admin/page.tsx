'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchNews, fetchNewsById } from '@/lib/news';
import {
  adminCreateNews,
  adminDeleteNews,
  adminPublishNews,
  adminUpdateNews
} from '@/lib/adminApi';
import {
  NewsTask,
  adminFetchTasks,
  adminCreateTask,
  adminUpdateTask,
  adminDeleteTask,
  adminRunTask
} from '@/lib/adminTasks';
import { adminProcessRewrites } from '@/lib/adminLeads';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { NewsItem, NewsCategory } from '@/types/news';
import { fetchCategories, Category } from '@/lib/categories';

// --- Types ---

type NewsFormState = {
  title_en: string;
  title_cn: string;
  title_my: string;
  content_en: string;
  content_cn: string;
  content_my: string;
  news_date: string;
  image_url: string;
  sources: string; // comma separated names
  is_published: boolean;
  is_highlight: boolean;
  category_id: string;
};

const emptyNewsForm: NewsFormState = {
  title_en: '',
  title_cn: '',
  title_my: '',
  content_en: '',
  content_cn: '',
  content_my: '',
  news_date: new Date().toISOString(),
  image_url: '',
  sources: '',
  is_published: true,
  is_highlight: false,
  category_id: ''
};

type TaskFormState = {
  query: string;
  account_name: string;
  collection_uuid: string;
};

const emptyTaskForm: TaskFormState = {
  query: '',
  account_name: '',
  collection_uuid: ''
};

// --- Helper Components ---

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [input, setInput] = useState('');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="glass gradient-border w-full max-w-md rounded-3xl border border-border/60 p-8 shadow-card text-center">
        <h2 className="mb-2 text-2xl font-semibold text-text">Admin Access</h2>
        <p className="mb-6 text-sm text-subtle">Enter your access token to continue</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(input);
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="password"
            placeholder="Access Token"
            className="w-full rounded-lg border border-border bg-surface/60 px-4 py-3 text-text focus:border-accent outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-surface shadow-card transition hover:bg-accentMuted"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ published, highlight }: { published: boolean; highlight: boolean }) {
  if (highlight) {
    return (
      <span className="rounded-full border border-accent bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
        Highlight
      </span>
    );
  }
  if (published) {
    return (
      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-400">
        Published
      </span>
    );
  }
  return (
    <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-subtle">
      Draft
    </span>
  );
}

// --- Main Page Component ---

export default function AdminPage() {
  const [token, setToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Data State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [tasks, setTasks] = useState<NewsTask[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);

  // UI State
  const [activeTab, setActiveTab] = useState<'pipeline' | 'sources' | 'categories'>('sources');
  const [newsFilter, setNewsFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forms
  const [newsForm, setNewsForm] = useState<NewsFormState>(emptyNewsForm);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState<TaskFormState>(emptyTaskForm);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Auth & Init
  useEffect(() => {
    const envToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
    const storedToken = window.localStorage.getItem('admin_token');

    if (envToken) {
      handleLogin(envToken);
    } else if (storedToken) {
      handleLogin(storedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogin(t: string) {
    setToken(t);
    setIsAuthenticated(true);
    window.localStorage.setItem('admin_token', t);
    loadData(t);
  }

  async function loadData(authToken: string) {
    setLoading(true);
    setError(null);
    try {
      const [newsData, tasksData, pendingBatch, categoriesData] = await Promise.all([
        fetchNews({ limit: 100, offset: 0, content_status: 'filled' }).catch((e) => {
          console.error('Failed to fetch filled news:', e);
          return [];
        }),
        adminFetchTasks(authToken).catch((e) => {
          console.error('Failed to fetch tasks:', e);
          return [];
        }),
        fetchNews({ limit: 100, content_status: 'empty' }).catch((e) => {
          console.error('Failed to fetch empty news:', e);
          return [];
        }),
        fetchCategories().catch((e) => {
          console.error('Failed to fetch categories:', e);
          return [];
        })
      ]);
      setNews(newsData);
      setTasks(tasksData);
      setPendingCount(pendingBatch.length);
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data. API might be unreachable or token invalid.');
    } finally {
      setLoading(false);
    }
  }

  // --- Actions: Tasks ---

  async function handleTaskSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTaskId) {
        const updated = await adminUpdateTask(token, editingTaskId, taskForm);
        setTasks((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          return list.map((t) => (t.id === updated.id ? updated : t));
        });
      } else {
        const created = await adminCreateTask(token, taskForm);
        setTasks((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          return [created, ...list];
        });
      }
      setEditingTaskId(null);
      setTaskForm(emptyTaskForm);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleTaskDelete(id: string) {
    if (!confirm('Delete this task?')) return;
    setSaving(true);
    try {
      await adminDeleteTask(token, id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleTaskRun(id: string) {
    setSaving(true);
    try {
      await adminRunTask(token, id);
      alert('Discovery task started.');
      // Refresh pending count after a brief delay
      setTimeout(() => loadData(token), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // --- Actions: Pipeline ---

  async function handleProcessRewrites() {
    setSaving(true);
    try {
      await adminProcessRewrites(token);
      alert('Batch processing triggered. Results will appear in the Drafts list shortly.');
      // Refresh data
      setTimeout(() => loadData(token), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // --- Actions: News Management ---

  async function handleNewsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...newsForm,
      sources: newsForm.sources.split(',').map((s) => ({ name: s.trim() })).filter((s) => s.name),
      category_id: newsForm.category_id || null // Ensure null if empty string
    };
    try {
      if (editingNewsId) {
        const updated = await adminUpdateNews(token, editingNewsId, payload);
        // Update news list but also update the category object if API didn't return it populated
        setNews((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          return list.map((n) => {
            if (n.id === updated.id) {
              // Optimistically update category if available locally but not in response
              if (payload.category_id && !updated.category) {
                const cat = categories.find(c => c.id === payload.category_id);
                if (cat) return { ...updated, category: cat };
              }
              return updated;
            }
            return n;
          });
        });
      } else {
        const created = await adminCreateNews(token, payload);
        setNews((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          return [created, ...list];
        });
      }
      setEditingNewsId(null);
      setNewsForm(emptyNewsForm);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleNewsPublish(item: NewsItem, key: 'is_published' | 'is_highlight') {
    setSaving(true);
    try {
      const updated = await adminPublishNews(token, item.id, { [key]: !item[key] });
      setNews((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.map((n) => (n.id === updated.id ? updated : n));
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleNewsDelete(id: string) {
    if (!confirm('Delete this news item?')) return;
    setSaving(true);
    try {
      await adminDeleteNews(token, id);
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRefreshItem(id: string) {
    setSaving(true);
    try {
      const fresh = await fetchNewsById(id);
      if (fresh) {
        setNews((prev) => prev.map((n) => (n.id === id ? fresh : n)));
        alert(`Refreshed: ${fresh.title_en}\nCategory: ${fresh.category?.name || 'None'}\nImage: ${fresh.image_url ? 'Found' : 'Missing'}`);
      } else {
        alert('Failed to fetch fresh data.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  // --- Rendering ---

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Header currentLanguage="en" />
        <LoginScreen onLogin={handleLogin} />
        <Footer />
      </div>
    );
  }

  const filteredNews = (Array.isArray(news) ? news : [])
    .filter((n) => {
      if (newsFilter === 'published') return n.is_published;
      if (newsFilter === 'draft') return !n.is_published;
      return true;
    })
    .sort((a, b) => new Date(b.news_date).getTime() - new Date(a.news_date).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Header currentLanguage="en" />
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-12 pt-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text">Newsroom</h1>
            <p className="text-subtle">Manage sources, ingestion, and editorial content.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(token)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-subtle hover:border-accent/60 hover:text-text"
            >
              {loading ? 'Syncing...' : 'Sync Data'}
            </button>
            <button
              onClick={() => {
                setToken('');
                setIsAuthenticated(false);
                window.localStorage.removeItem('admin_token');
              }}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('sources')}
            className={`mr-8 pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'sources'
                ? 'border-b-2 border-accent text-accent'
                : 'text-subtle hover:text-text'
            }`}
          >
            Sources & Discovery
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`mr-8 pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'pipeline'
                ? 'border-b-2 border-accent text-accent'
                : 'text-subtle hover:text-text'
            }`}
          >
            Editorial Pipeline
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'categories'
                ? 'border-b-2 border-accent text-accent'
                : 'text-subtle hover:text-text'
            }`}
          >
            Categories & Tags
          </button>
        </div>

        {/* View A: Sources & Discovery */}
        {activeTab === 'sources' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Col: Task Manager */}
            <div className="lg:col-span-2 space-y-6">
              <section className="glass gradient-border rounded-3xl border border-border/60 p-6 shadow-card">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text">Query Tasks</h2>
                  <span className="rounded-full bg-surface px-2 py-1 text-xs font-bold text-subtle border border-border">
                    {tasks.length} Active
                  </span>
                </div>
                
                <div className="space-y-3">
                  {Array.isArray(tasks) && tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-surface/50 p-4 transition md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <h3 className="font-semibold text-text">{task.query}</h3>
                        <div className="flex gap-3 text-xs text-subtle mt-1">
                          {task.account_name && <span>ACCT: {task.account_name}</span>}
                          {task.collection_uuid && <span>COLL: {task.collection_uuid}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTaskRun(task.id)}
                          disabled={saving}
                          className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400 hover:bg-green-500/20"
                        >
                          Run Discovery
                        </button>
                        <button
                          onClick={() => {
                            setEditingTaskId(task.id);
                            setTaskForm({
                              query: task.query,
                              account_name: task.account_name || '',
                              collection_uuid: task.collection_uuid || ''
                            });
                          }}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs text-subtle hover:text-text"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleTaskDelete(task.id)}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                     <p className="text-center text-sm text-subtle py-8">No query tasks found.</p>
                  )}
                </div>
              </section>
            </div>

            {/* Right Col: Create Task */}
            <div>
              <section className="glass gradient-border rounded-3xl border border-border/60 p-6 shadow-card sticky top-6">
                <h2 className="mb-4 text-lg font-semibold text-text">
                  {editingTaskId ? 'Edit Task' : 'New Query Task'}
                </h2>
                <form onSubmit={handleTaskSubmit} className="flex flex-col gap-3">
                  <input
                    placeholder="Search Query (e.g., Solar Malaysia)"
                    className="rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-text focus:border-accent outline-none"
                    value={taskForm.query}
                    onChange={(e) => setTaskForm({ ...taskForm, query: e.target.value })}
                    required
                  />
                  <input
                    placeholder="Account Name (Optional)"
                    className="rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-text focus:border-accent outline-none"
                    value={taskForm.account_name}
                    onChange={(e) => setTaskForm({ ...taskForm, account_name: e.target.value })}
                  />
                  <input
                    placeholder="Collection UUID (Optional)"
                    className="rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-text focus:border-accent outline-none"
                    value={taskForm.collection_uuid}
                    onChange={(e) => setTaskForm({ ...taskForm, collection_uuid: e.target.value })}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface shadow-card transition hover:bg-accentMuted"
                    >
                      {saving ? 'Saving...' : editingTaskId ? 'Update' : 'Create Task'}
                    </button>
                    {editingTaskId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTaskId(null);
                          setTaskForm(emptyTaskForm);
                        }}
                        className="rounded-lg border border-border px-3 py-2 text-sm text-subtle hover:text-text"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </section>
            </div>
          </div>
        )}

        {/* View B: Editorial Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="space-y-8">
            {/* 1. Ingestion Queue */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass gradient-border rounded-3xl border border-border/60 p-6 shadow-card flex flex-col justify-between gap-4">
                 <div>
                    <h2 className="text-lg font-semibold text-text">Ingestion Queue</h2>
                    <p className="text-sm text-subtle">Raw leads waiting for AI rewriting.</p>
                 </div>
                 <div className="flex items-end justify-between">
                    <div>
                       <span className="text-4xl font-bold text-text">{pendingCount}</span>
                       <span className="ml-2 text-sm text-subtle">pending</span>
                    </div>
                    <button
                       onClick={handleProcessRewrites}
                       disabled={saving || pendingCount === 0}
                       className="rounded-lg bg-accent px-6 py-2 text-sm font-semibold text-surface shadow-card transition hover:bg-accentMuted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       {saving ? 'Processing...' : 'Process Batch (10)'}
                    </button>
                 </div>
              </div>
              
              <div className="glass gradient-border rounded-3xl border border-border/60 p-6 shadow-card flex flex-col justify-center">
                 <div className="flex items-center gap-4 text-subtle text-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border">1</div>
                    <p>Tasks find raw leads</p>
                 </div>
                 <div className="my-2 ml-5 h-4 w-0.5 bg-border/50"></div>
                 <div className="flex items-center gap-4 text-text font-medium text-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-surface shadow-lg">2</div>
                    <p>Process Batch (AI Rewrites)</p>
                 </div>
                 <div className="my-2 ml-5 h-4 w-0.5 bg-border/50"></div>
                 <div className="flex items-center gap-4 text-subtle text-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border">3</div>
                    <p>Editor reviews & publishes</p>
                 </div>
              </div>
            </section>

            {/* 2. Editorial Desk */}
            <section className="glass gradient-border rounded-3xl border border-border/60 p-6 shadow-card">
               <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                     <h2 className="text-lg font-semibold text-text">Editorial Desk</h2>
                     <div className="mt-2 flex gap-1 bg-surface/50 p-1 rounded-lg border border-border w-fit">
                        {['all', 'draft', 'published'].map((filter) => (
                           <button
                              key={filter}
                              onClick={() => setNewsFilter(filter as any)}
                              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ${
                                 newsFilter === filter
                                    ? 'bg-accent text-surface shadow-sm'
                                    : 'text-subtle hover:text-text'
                              }`}
                           >
                              {filter}
                           </button>
                        ))}
                     </div>
                  </div>
                  <button
                     onClick={() => {
                        setEditingNewsId(null);
                        setNewsForm(emptyNewsForm);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                     }}
                     className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface"
                  >
                     + New Article
                  </button>
               </div>

               {/* Editor Form (Conditional) */}
               {(editingNewsId || newsForm.title_en) && (
                  <div className="mb-8 rounded-xl border border-border bg-surface/30 p-6">
                     <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-text">{editingNewsId ? 'Edit Article' : 'Create Article'}</h3>
                        <button 
                           onClick={() => { setEditingNewsId(null); setNewsForm(emptyNewsForm); }}
                           className="text-xs text-subtle hover:text-red-400"
                        >
                           Close Editor
                        </button>
                     </div>
                     <form onSubmit={handleNewsSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                           placeholder="Title (EN)"
                           value={newsForm.title_en}
                           onChange={e => setNewsForm({...newsForm, title_en: e.target.value})}
                           className="col-span-2 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-text"
                           required
                        />
                        
                        <select
                          value={newsForm.category_id}
                          onChange={e => setNewsForm({...newsForm, category_id: e.target.value})}
                          className="col-span-2 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-text"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>

                        <input
                           placeholder="Image URL"
                           value={newsForm.image_url}
                           onChange={e => setNewsForm({...newsForm, image_url: e.target.value})}
                           className="col-span-2 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-text"
                        />

                        <div className="col-span-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="is_highlight"
                            checked={newsForm.is_highlight}
                            onChange={e => setNewsForm({...newsForm, is_highlight: e.target.checked})}
                            className="rounded border-border text-accent focus:ring-accent"
                          />
                          <label htmlFor="is_highlight" className="text-sm text-text">
                            Mark as Highlight (Featured Carousel)
                          </label>
                        </div>

                         <textarea
                           placeholder="Content (EN)"
                           value={newsForm.content_en}
                           onChange={e => setNewsForm({...newsForm, content_en: e.target.value})}
                           className="col-span-2 rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-text"
                           rows={4}
                           required
                        />
                        {/* Simplified Fields for Demo - Expansion possible */}
                        <div className="col-span-2 flex justify-end gap-2">
                           <button type="submit" disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface">
                              {saving ? 'Saving...' : 'Save Article'}
                           </button>
                        </div>
                     </form>
                  </div>
               )}

               {/* Article List */}
               <div className="space-y-2">
                  {filteredNews.map((item) => (
                     <div
                        key={item.id}
                        className="group flex flex-col gap-3 rounded-xl border border-border/50 bg-surface/20 p-4 transition hover:bg-surface/40 hover:border-accent/30 md:flex-row md:items-start md:justify-between"
                     >
                        <div className="flex-1 space-y-1">
                           <div className="flex items-center gap-2 mb-1">
                              <StatusBadge published={item.is_published} highlight={item.is_highlight} />
                              {(item.category || (item.category_id && categories.find(c => c.id === item.category_id))) && (
                                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-text">
                                  {item.category?.name || categories.find(c => c.id === item.category_id)?.name}
                                </span>
                              )}
                              <span className="text-[10px] text-subtle uppercase tracking-wide">
                                 {new Date(item.news_date).toLocaleDateString()}
                              </span>
                           </div>
                           <h3 className="font-medium text-text">{item.title_en}</h3>
                           <p className="line-clamp-1 text-xs text-subtle">{item.content_en}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                           <button
                              onClick={() => handleNewsPublish(item, 'is_highlight')}
                              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                 item.is_highlight 
                                    ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20' 
                                    : 'bg-surface border border-border text-subtle hover:text-text'
                              }`}
                           >
                              {item.is_highlight ? 'Unhighlight' : 'Highlight'}
                           </button>
                           <button
                              onClick={() => handleNewsPublish(item, 'is_published')}
                              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                 item.is_published 
                                    ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20' 
                                    : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                              }`}
                           >
                              {item.is_published ? 'Unpublish' : 'Publish'}
                           </button>
                           <button
                              onClick={() => {
                                 setEditingNewsId(item.id);
                                 setNewsForm({
                                    title_en: item.title_en,
                                    title_cn: item.title_cn,
                                    title_my: item.title_my,
                                    content_en: item.content_en,
                                    content_cn: item.content_cn,
                                    content_my: item.content_my,
                                    news_date: item.news_date,
                                    image_url: item.image_url || '',
                                    sources: (item.sources || []).map(s => s.name).join(', '),
                                    is_published: item.is_published,
                                    is_highlight: item.is_highlight,
                                    category_id: item.category?.id || item.category_id || ''
                                 });
                                 window.scrollTo({ top: 300, behavior: 'smooth' });
                              }}
                              className="rounded-lg border border-border px-3 py-1.5 text-xs text-subtle hover:bg-surface hover:text-text"
                           >
                              Edit
                           </button>
                           <button
                              onClick={() => handleNewsDelete(item.id)}
                              className="rounded-lg px-2 py-1.5 text-xs text-subtle hover:text-red-400"
                           >
                              ×
                           </button>
                           <button
                              onClick={() => handleRefreshItem(item.id)}
                              className="rounded-lg px-2 py-1.5 text-xs text-subtle hover:text-accent"
                              title="Refresh from DB"
                           >
                              ↻
                           </button>
                        </div>
                     </div>
                  ))}
                  {filteredNews.length === 0 && (
                     <div className="py-12 text-center text-sm text-subtle">
                        No articles found in this filter.
                     </div>
                  )}
               </div>
            </section>
          </div>
        )}
        {/* View C: Categories */}
        {activeTab === 'categories' && (
          <div className="max-w-4xl mx-auto">
            <section className="glass gradient-border rounded-3xl border border-border/60 p-6 shadow-card">
              <CategoryManager token={token} />
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
