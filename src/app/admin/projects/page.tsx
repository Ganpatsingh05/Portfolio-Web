"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';

interface Project { id: string; title: string; description: string; category?: string; technologies?: string[]; demo_url?: string; github_url?: string; sort_order?: number; created_at: string; }

export default function ProjectsPage() {
  const router = useRouter();
  const toast = useToast();
  const { confirm } = useConfirm();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '', description: '', category: '', technologies: '', demo_url: '', github_url: '', sort_order: 0
  });

  const load = async () => {
    try { 
      const list = await adminApi.projects.list();
      // Sort by sort_order ascending, then by created_at descending
      list.sort((a: Project, b: Project) => {
        const orderA = a.sort_order ?? 999999;
        const orderB = b.sort_order ?? 999999;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setProjects(list);
    } catch (e: any) { if (e.status===401) { router.replace('/admin/login'); return;} setError(e.message); } finally { setLoading(false);} };
  useEffect(()=>{ if(!ensureAuthedClient()){router.replace('/admin/login');return;} load(); },[router]);

  const startAdd = () => { setEditing(null); setForm({ title:'', description:'', category:'', technologies:'', demo_url:'', github_url:'', sort_order: projects.length > 0 ? Math.max(...projects.map(p => p.sort_order || 0)) + 1 : 1 }); setShowForm(true);} ;
  const startEdit = (p: Project) => { setEditing(p); setForm({ title:p.title, description:p.description, category:p.category||'', technologies:(p.technologies||[]).join(', '), demo_url:p.demo_url||'', github_url:p.github_url||'', sort_order:p.sort_order||0}); setShowForm(true);} ;

  const save = async () => {
    setSaving(true);
    const payload = { ...form, technologies: form.technologies.split(',').map(t=>t.trim()).filter(Boolean), sort_order: Number(form.sort_order) || 0 };
    try {
      if (editing) await adminApi.projects.update(editing.id, payload); else await adminApi.projects.create(payload);
      setShowForm(false); load();
      toast.success(editing ? 'Updated!' : 'Created!', `Project ${editing ? 'updated' : 'created'} successfully`);
    } catch (e: any) { 
      toast.error('Save Failed', e.message || 'Failed to save project'); 
    } finally {
      setSaving(false);
    }
  };

  const del = async (p: Project) => { 
    const confirmed = await confirm({
      title: 'Delete Project?',
      message: `Are you sure you want to delete "${p.title}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if(!confirmed) return; 
    try { 
      await adminApi.projects.delete(p.id); 
      load();
      toast.success('Deleted!', 'Project removed successfully');
    } catch(e:any){ 
      toast.error('Delete Failed', e.message || 'Failed to delete project'); 
    } 
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm border border-red-200 dark:border-red-800 flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div><strong>Error:</strong> {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your portfolio projects</p>
        </div>
        <button 
          onClick={startAdd} 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No projects yet</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first project to showcase your work</p>
          <button onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition group">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-gray-900 dark:text-white text-lg truncate">{p.title}</h2>
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full" title={`Display order: ${p.sort_order ?? 0}`}>
                        {p.sort_order ?? 0}
                      </span>
                    </div>
                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded mt-1">
                      {p.category || 'Uncategorized'}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{p.description}</p>
                {p.technologies && p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.technologies.slice(0, 4).map((t, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        {t}
                      </span>
                    ))}
                    {p.technologies.length > 4 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                        +{p.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex gap-3">
                  {p.demo_url && (
                    <a href={p.demo_url} target="_blank" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Demo
                    </a>
                  )}
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEdit(p)} 
                    className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => del(p)} 
                    className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? 'Edit Project' : 'Add Project'}</h2>
              </div>
              <button 
                onClick={() => setShowForm(false)} 
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title</label>
                <input 
                  value={form.title} 
                  onChange={e => setForm(f => ({...f, title: e.target.value}))} 
                  required 
                  placeholder="My Awesome Project"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm(f => ({...f, description: e.target.value}))} 
                  required 
                  rows={4} 
                  placeholder="Describe your project..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition resize-none" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                  <select 
                    value={form.category} 
                    onChange={e => setForm(f => ({...f, category: e.target.value}))} 
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
                  >
                    <option value="">Select a category...</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="desktop-app">Desktop Application</option>
                    <option value="api-backend">API & Backend</option>
                    <option value="ai-ml">AI & Machine Learning</option>
                    <option value="data-analysis">Data Analysis</option>
                    <option value="e-commerce">E-commerce</option>
                    <option value="portfolio">Portfolio & Personal</option>
                    <option value="automation">Automation & Scripts</option>
                    <option value="game-development">Game Development</option>
                    <option value="blockchain">Blockchain & Web3</option>
                    <option value="iot">IoT & Hardware</option>
                    <option value="devops">DevOps & Infrastructure</option>
                    <option value="open-source">Open Source</option>
                    <option value="client-work">Client Work</option>
                    <option value="other">Other</option>
                    {Array.from(new Set(projects.map(p => p.category).filter(Boolean)))
                      .filter(c => typeof c === 'string' && !['web-development', 'mobile-app', 'desktop-app', 'api-backend', 'ai-ml', 'data-analysis', 'e-commerce', 'portfolio', 'automation', 'game-development', 'blockchain', 'iot', 'devops', 'open-source', 'client-work', 'other'].includes(c.toLowerCase()))
                      .map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Technologies</label>
                  <input 
                    value={form.technologies} 
                    onChange={e => setForm(f => ({...f, technologies: e.target.value}))} 
                    placeholder="React, Node.js, PostgreSQL"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition" 
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Comma separated</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Demo URL</label>
                  <input 
                    type="url" 
                    value={form.demo_url} 
                    onChange={e => setForm(f => ({...f, demo_url: e.target.value}))} 
                    placeholder="https://demo.example.com"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">GitHub URL</label>
                  <input 
                    type="url" 
                    value={form.github_url} 
                    onChange={e => setForm(f => ({...f, github_url: e.target.value}))} 
                    placeholder="https://github.com/user/repo"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Display Order</label>
                <input 
                  type="number" 
                  value={form.sort_order} 
                  onChange={e => setForm(f => ({...f, sort_order: parseInt(e.target.value) || 0}))} 
                  placeholder="0"
                  min="0"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition" 
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lower numbers appear first (0, 1, 2, 3...)</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
              <button 
                onClick={() => setShowForm(false)} 
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button 
                onClick={save} 
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                {saving && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {saving ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
