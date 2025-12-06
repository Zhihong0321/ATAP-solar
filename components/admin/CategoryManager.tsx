'use client';

import { useState, useEffect } from 'react';
import { 
  Category, 
  Tag, 
  fetchCategories, 
  createCategory, 
  deleteCategory, 
  createTag, 
  deleteTag 
} from '@/lib/categories';

type CategoryManagerProps = {
  token: string;
};

export function CategoryManager({ token }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [tagLoading, setTagLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      const created = await createCategory(token, newCategoryName);
      setCategories(prev => [...prev, created]);
      setNewCategoryName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Delete this category? ALL tags inside it will be lost.')) return;
    setLoading(true);
    try {
      await deleteCategory(token, id);
      setCategories(prev => prev.filter(c => c.id !== id));
      if (expandedCategoryId === id) setExpandedCategoryId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault();
    if (!expandedCategoryId || !newTagName.trim()) return;
    setTagLoading(true);
    try {
      const created = await createTag(token, expandedCategoryId, newTagName);
      // Update local state
      setCategories(prev => prev.map(c => {
        if (c.id === expandedCategoryId) {
          return { ...c, tags: [...(c.tags || []), created] };
        }
        return c;
      }));
      setNewTagName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTagLoading(false);
    }
  }

  async function handleDeleteTag(tagId: string) {
    if (!confirm('Delete this tag?')) return;
    setTagLoading(true);
    try {
      await deleteTag(token, tagId);
       setCategories(prev => prev.map(c => {
        if (c.id === expandedCategoryId) {
          return { ...c, tags: (c.tags || []).filter(t => t.id !== tagId) };
        }
        return c;
      }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTagLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text">Categories & Tags</h2>
          <p className="text-xs text-subtle mt-1">
             Tip: Name a category <strong>&quot;Featured&quot;</strong> to display it in the main news slot on the homepage.
          </p>
        </div>
        <button 
          onClick={loadCategories} 
          className="text-sm text-subtle hover:text-text"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Create Category */}
      <form onSubmit={handleCreateCategory} className="flex gap-2">
        <input
          placeholder="New Category Name"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-surface/60 px-4 py-2 text-sm text-text focus:border-accent outline-none"
        />
        <button
          type="submit"
          disabled={loading || !newCategoryName.trim()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-surface disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            className={`border rounded-xl p-4 transition-all ${
              expandedCategoryId === cat.id 
                ? 'border-accent bg-accent/5 ring-1 ring-accent/20' 
                : 'border-border bg-surface/30 hover:border-accent/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-text">{cat.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setExpandedCategoryId(expandedCategoryId === cat.id ? null : cat.id)}
                  className="text-xs px-2 py-1 rounded border border-border text-subtle hover:text-text hover:bg-surface"
                >
                  {expandedCategoryId === cat.id ? 'Done' : 'Manage Tags'}
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="text-xs px-2 py-1 rounded border border-border text-red-400 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Tags Section */}
            {expandedCategoryId === cat.id && (
              <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
                <h4 className="text-xs font-bold text-subtle uppercase tracking-wider mb-3">Tags</h4>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.tags && cat.tags.length > 0 ? (
                    cat.tags.map(tag => (
                      <span key={tag.id} className="inline-flex items-center gap-1 text-xs bg-surface border border-border px-2 py-1 rounded-md text-textSecondary">
                        #{tag.name}
                        <button 
                          onClick={() => handleDeleteTag(tag.id)}
                          className="hover:text-red-400 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-subtle italic">No tags yet.</span>
                  )}
                </div>

                <form onSubmit={handleCreateTag} className="flex gap-2">
                  <input
                    placeholder="New Tag Name"
                    value={newTagName}
                    onChange={e => setNewTagName(e.target.value)}
                    className="flex-1 rounded border border-border bg-surface px-3 py-1.5 text-xs text-text focus:border-accent outline-none"
                  />
                  <button
                    type="submit"
                    disabled={tagLoading || !newTagName.trim()}
                    className="rounded bg-accent/10 border border-accent/20 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 disabled:opacity-50"
                  >
                    Add Tag
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
