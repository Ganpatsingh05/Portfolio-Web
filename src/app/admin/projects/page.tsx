"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';

interface Project { id: string; title: string; description: string; category?: string; technologies?: string[]; demo_url?: string; github_url?: string; created_at: string; }

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '', description: '', category: '', technologies: '', demo_url: '', github_url: ''
  });

  const load = async () => {
    try { setProjects(await adminApi.projects.list()); } catch (e: any) { if (e.status===401) { router.replace('/admin/login'); return;} setError(e.message); } finally { setLoading(false);} };
  useEffect(()=>{ if(!ensureAuthedClient()){router.replace('/admin/login');return;} load(); },[router]);

  const startAdd = () => { setEditing(null); setForm({ title:'', description:'', category:'', technologies:'', demo_url:'', github_url:'' }); setShowForm(true);} ;
  const startEdit = (p: Project) => { setEditing(p); setForm({ title:p.title, description:p.description, category:p.category||'', technologies:(p.technologies||[]).join(', '), demo_url:p.demo_url||'', github_url:p.github_url||''}); setShowForm(true);} ;

  const save = async () => {
    const payload = { ...form, technologies: form.technologies.split(',').map(t=>t.trim()).filter(Boolean) };
    try {
      if (editing) await adminApi.projects.update(editing.id, payload); else await adminApi.projects.create(payload);
      setShowForm(false); load();
    } catch (e: any) { alert(e.message || 'Failed to save'); }
  };

  const del = async (p: Project) => { if(!confirm(`Delete project "${p.title}"?`)) return; try { await adminApi.projects.delete(p.id); load(); } catch(e:any){ alert(e.message||'Delete failed'); } };

  if (loading) return <div className="p-8 text-gray-600 dark:text-gray-400">Loading projects...</div>;
  if (error) return <div className="p-8 text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <button onClick={startAdd} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow transition">Add Project</button>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex flex-col">
            <div className="p-5 flex-1 flex flex-col">
              <h2 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">{p.title}</h2>
              <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">{p.category || 'Uncategorized'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3 whitespace-pre-line">{p.description}</p>
              {p.technologies && p.technologies.length>0 && <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto">{p.technologies.join(', ')}</p>}
            </div>
            <div className="px-5 pb-5 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                {p.demo_url && <a href={p.demo_url} target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition">Demo</a>}
                {p.github_url && <a href={p.github_url} target="_blank" className="text-xs text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition">GitHub</a>}
              </div>
              <div className="flex gap-2">
                <button onClick={()=>startEdit(p)} className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition">Edit</button>
                <button onClick={()=>del(p)} className="text-xs px-2 py-1 rounded border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto border-2 border-blue-700 dark:border-blue-600">
            <div className="p-6 border-b border-blue-200 dark:border-gray-700 flex items-center justify-between bg-blue-50 dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">{editing ? 'Edit Project' : 'Add Project'}</h2>
              <button onClick={()=>setShowForm(false)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition">Close</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Title</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Description</label>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required rows={4} className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Category</label>
                  <select 
                    value={form.category} 
                    onChange={e=>setForm(f=>({...f,category:e.target.value}))} 
                    className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition"
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
                    {/* Add existing categories from database that might not be in predefined list */}
                    {Array.from(new Set(projects.map(p=>p.category).filter(Boolean)))
                      .filter(c => typeof c === 'string' && !['web-development', 'mobile-app', 'desktop-app', 'api-backend', 'ai-ml', 'data-analysis', 'e-commerce', 'portfolio', 'automation', 'game-development', 'blockchain', 'iot', 'devops', 'open-source', 'client-work', 'other'].includes(c.toLowerCase()))
                      .map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Technologies (comma separated)</label>
                  <input value={form.technologies} onChange={e=>setForm(f=>({...f,technologies:e.target.value}))} className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Demo URL</label>
                  <input type="url" value={form.demo_url} onChange={e=>setForm(f=>({...f,demo_url:e.target.value}))} className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">GitHub URL</label>
                  <input type="url" value={form.github_url} onChange={e=>setForm(f=>({...f,github_url:e.target.value}))} className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-700">
              <button onClick={()=>setShowForm(false)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-md bg-blue-600 dark:bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-700 shadow transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
