"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';

interface Experience { id: string; title: string; company: string; period: string; type: 'experience' | 'education'; description?: string | string[]; created_at: string; }

export default function ExperiencesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Experience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState({ title: '', company: '', period: '', type: 'experience', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => { try { setItems(await adminApi.experiences.list()); } catch(e:any){ if(e.status===401){router.replace('/admin/login');return;} setError(e.message);} finally{ setLoading(false);} };
  useEffect(()=>{ if(!ensureAuthedClient()){ router.replace('/admin/login'); return;} load(); },[router]);

  const startAdd = () => { setEditing(null); setForm({ title:'', company:'', period:'', type:'experience', description:'' }); setShowForm(true); };
  const startEdit = (x: Experience) => { setEditing(x); setForm({ title:x.title, company:x.company, period:x.period, type:x.type, description: Array.isArray(x.description) ? x.description.join('\n') : (x.description||'') }); setShowForm(true); };

  const save = async () => {
    const payload = { ...form, description: form.description.split('\n').map(l=>l.trim()).filter(Boolean) };
    try { if(editing) await adminApi.experiences.update(editing.id, payload); else await adminApi.experiences.create(payload); setShowForm(false); load(); } catch(e:any){ alert(e.message||'Failed to save experience'); }
  };
  const del = async (x: Experience) => { if(!confirm(`Delete ${x.title}?`)) return; try { await adminApi.experiences.delete(x.id); load(); } catch(e:any){ alert(e.message||'Failed to delete'); } };

  if (loading) return <div className="p-8 text-gray-600 dark:text-gray-400">Loading experiences...</div>;
  if (error) return <div className="p-8 text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Experiences</h1>
        <button onClick={startAdd} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow transition">Add Experience</button>
      </header>

      <div className="space-y-4">
        {items.map(e => (
          <div key={e.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-gray-900 dark:text-white text-lg truncate">{e.title}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${e.type==='experience' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'}`}>{e.type==='experience' ? 'Work' : 'Education'}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{e.company} • {e.period}</p>
                {e.description && <ul className="mt-3 list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  {(Array.isArray(e.description) ? e.description : [e.description]).map((d,i)=>(<li key={i}>{d}</li>))}
                </ul>}
              </div>
              <div className="flex items-start gap-2">
                <button onClick={()=>startEdit(e)} className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition">Edit</button>
                <button onClick={()=>del(e)} className="text-xs px-2 py-1 rounded border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-blue-700 dark:border-blue-600">
            <div className="p-6 border-b border-blue-200 dark:border-gray-700 flex items-center justify-between bg-blue-50 dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
              <button onClick={()=>setShowForm(false)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition">Close</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Title</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Company / Institution</label>
                  <input value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} required className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Period</label>
                  <input value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))} required placeholder="Jan 2024 - Present" className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Type</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value as any}))} className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition">
                  <option value="experience">Work Experience</option>
                  <option value="education">Education</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Description (one bullet per line)</label>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={6} className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition resize-none" />
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
