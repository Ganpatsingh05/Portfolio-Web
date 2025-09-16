"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/lib/admin/api';

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

  if (loading) return <div className="p-8">Loading projects...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button onClick={startAdd} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow">Add Project</button>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map(p => (
          <div key={p.id} className="bg-white border rounded-lg shadow-sm flex flex-col">
            <div className="p-5 flex-1 flex flex-col">
              <h2 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">{p.title}</h2>
              <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">{p.category || 'Uncategorized'}</p>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3 whitespace-pre-line">{p.description}</p>
              {p.technologies && p.technologies.length>0 && <p className="text-xs text-gray-500 mt-auto">{p.technologies.join(', ')}</p>}
            </div>
            <div className="px-5 pb-5 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                {p.demo_url && <a href={p.demo_url} target="_blank" className="text-xs text-blue-600 hover:text-blue-700">Demo</a>}
                {p.github_url && <a href={p.github_url} target="_blank" className="text-xs text-gray-700 hover:text-black">GitHub</a>}
              </div>
              <div className="flex gap-2">
                <button onClick={()=>startEdit(p)} className="text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50">Edit</button>
                <button onClick={()=>del(p)} className="text-xs px-2 py-1 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Project' : 'Add Project'}</h2>
              <button onClick={()=>setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-sm">Close</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required rows={4} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
                  <input value={form.technologies} onChange={e=>setForm(f=>({...f,technologies:e.target.value}))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
                  <input type="url" value={form.demo_url} onChange={e=>setForm(f=>({...f,demo_url:e.target.value}))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                  <input type="url" value={form.github_url} onChange={e=>setForm(f=>({...f,github_url:e.target.value}))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button onClick={()=>setShowForm(false)} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={save} className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
