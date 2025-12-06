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
import { FEATURED_TAG_NAME } from '@/lib/constants';
import { formatCategoryDisplay, formatTagDisplay } from '@/utils/categoryFormat';

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

  // Error boundary to prevent crashes during category operations
  const handleDeleteCategorySafe = async (id: string) => {
    if (!confirm('Delete this category? ALL tags inside it will be lost.')) return;
    setLoading(true);
    try {
      await deleteCategory(token, id);
      setCategories(prev => prev.filter(c => c.id !== id));
      if (expandedCategoryId === id) setExpandedCategoryId(null);
    } catch (err: any) {
      console.error('Category deletion error:', err);
      setError(`Deletion failed: ${err.message}. This may be due to database schema issues.`);
      
      // Refresh categories to ensure list is still usable
      loadCategories().catch(() => {});
    } finally {
      setLoading(false);
    }
  };

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

  async function handleSetFeatured(targetCatId: string) {
    setLoading(true);
    try {
      // 1. Find existing featured tag across all categories
      for (const cat of categories) {
        const featuredTag = cat.tags?.find(t => t.name === FEATURED_TAG_NAME);
        if (featuredTag) {
          await deleteTag(token, featuredTag.id);
        }
      }
      
      // 2. Create new featured tag in target category
      await createTag(token, targetCatId, FEATURED_TAG_NAME);
      
      // 3. Refresh
      await loadCategories();
    } catch (err: any) {
      setError(err.message);
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
      console.error('Category deletion error:', err);
      setError(`Deletion failed: ${err.message}. This may be due to database schema issues.`);
      
      // Refresh categories to ensure list is still usable
      loadCategories().catch(() => {});
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
             Select a category to be the <strong>Featured Section</strong> on the homepage.
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
        {categories.map(cat => {
          const isFeatured = cat.tags?.some(t => t.name === FEATURED_TAG_NAME);
          return (
          <div 
            key={cat.id} 
            className={`border rounded-xl p-4 transition-all ${
              isFeatured 
                ? 'border-accent bg-accent/5 ring-1 ring-accent/20' 
                : 'border-border bg-surface/30 hover:border-accent/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text">{formatCategoryDisplay(cat, 'en')}</h3>
                {isFeatured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-accent text-surface px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!isFeatured && (
                  <button
                    onClick={() => handleSetFeatured(cat.id)}
                    disabled={loading}
                    className="text-xs px-2 py-1 rounded border border-border text-accent hover:bg-accent/10 disabled:opacity-50"
                  >
                    Set as Featured
                  </button>
                )}
                <button
                  onClick={() => setExpandedCategoryId(expandedCategoryId === cat.id ? null : cat.id)}
                  className="text-xs px-2 py-1 rounded border border-border text-subtle hover:text-text hover:bg-surface"
                >
                  {expandedCategoryId === cat.id ? 'Done' : 'Manage Tags'}
                </button>
                <button
                  onClick={() => handleDeleteCategorySafe(cat.id)}
                  className="text-xs px-2 py-1 rounded border border-border text-red-400 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>

            {expandedCategoryId === cat.id && (
              <div className="mt-4 pt-4 border-t border-border/50 animate-fade-in">
                <h4 className="text-xs font-bold text-subtle uppercase tracking-wider mb-3">Tags</h4>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.tags && cat.tags.length > 0 ? (
                    cat.tags
                      .filter(tag => tag.name !== FEATURED_TAG_NAME)
                      .map(tag => (
                      <span key={tag.id} className="inline-flex items-center gap-1 text-xs bg-surface border border-border px-2 py-1 rounded-md text-textSecondary">
                        #{formatTagDisplay(tag, 'en')}
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
          );
        })}
      </div>
    </div>
  );
}
