"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/lib/admin/api';

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

  if (loading) return <div className="p-8">Loading experiences...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Experiences</h1>
        <button onClick={startAdd} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow">Add Experience</button>
      </header>

      <div className="space-y-4">
        {items.map(e => (
          <div key={e.id} className="bg-white border rounded-lg shadow-sm p-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-gray-900 text-lg truncate">{e.title}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${e.type==='experience' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{e.type==='experience' ? 'Work' : 'Education'}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{e.company} • {e.period}</p>
                {e.description && <ul className="mt-3 list-disc list-inside space-y-1 text-sm text-gray-700">
                  {(Array.isArray(e.description) ? e.description : [e.description]).map((d,i)=>(<li key={i}>{d}</li>))}
                </ul>}
              </div>
              <div className="flex items-start gap-2">
                <button onClick={()=>startEdit(e)} className="text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50">Edit</button>
                <button onClick={()=>del(e)} className="text-xs px-2 py-1 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
              <button onClick={()=>setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-sm">Close</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company / Institution</label>
                  <input value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} required className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                  <input value={form.period} onChange={e=>setForm(f=>({...f,period:e.target.value}))} required placeholder="Jan 2024 - Present" className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value as any}))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                  <option value="experience">Work Experience</option>
                  <option value="education">Education</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (one bullet per line)</label>
                <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={6} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
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
