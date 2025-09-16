"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/lib/admin/api';

interface Skill { id: string; name: string; level: number; category: string; icon_name?: string; sort_order?: number; is_featured?: boolean; }

export default function SkillsPage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ name: '', level: 50, category: '', icon_name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const categoryLabel = (c: string) => c || 'uncategorized';
  const load = async () => {
    try {
      const list = await adminApi.skills.list();
      // Sort: category asc, level desc, name asc
      list.sort((a: Skill, b: Skill) => {
        const ca = (a.category||'').toLowerCase();
        const cb = (b.category||'').toLowerCase();
        if (ca < cb) return -1; if (ca > cb) return 1;
        if (b.level !== a.level) return b.level - a.level;
        const na = a.name.toLowerCase(); const nb = b.name.toLowerCase();
        if (na < nb) return -1; if (na > nb) return 1;
        return 0;
      });
      setSkills(list);
    } catch(e:any){
      if(e.status===401){router.replace('/admin/login');return;}
      setError(e.message);
    } finally { setLoading(false);} };
  useEffect(()=>{ if(!ensureAuthedClient()){ router.replace('/admin/login'); return;} load(); },[router]);

  const startAdd = () => { setEditing(null); setFormError(null); setForm({ name:'', level:50, category:'', icon_name:'' }); setShowForm(true); setTimeout(()=>firstFieldRef.current?.focus(), 0); };
  const startEdit = (s: Skill) => { setEditing(s); setFormError(null); setForm({ name:s.name, level:s.level, category:s.category, icon_name:s.icon_name||'' }); setShowForm(true); setTimeout(()=>firstFieldRef.current?.focus(), 0); };

  const save = async () => {
    setFormError(null);
    if (!form.name.trim()) { setFormError('Name is required'); return; }
    if (form.level < 0 || form.level > 100) { setFormError('Level must be between 0-100'); return; }
    const payload = { ...form };
    setSaving(true);
    try {
      if(editing) await adminApi.skills.update(editing.id, payload); else await adminApi.skills.create(payload);
      setShowForm(false); load();
    } catch(e:any){ setFormError(e.message||'Failed to save skill'); }
    finally { setSaving(false); }
  };
  const del = async (s: Skill) => {
    if(!confirm(`Delete skill ${s.name}?`)) return;
    try { await adminApi.skills.delete(s.id); load(); }
    catch(e:any){ alert(e.message||'Failed to delete'); }
  };

  if (loading) return <div className="p-8">Loading skills...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <button onClick={startAdd} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow">Add Skill</button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {skills.map(s => (
          <div key={s.id} className="bg-white border rounded-lg shadow-sm p-5 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900 text-lg truncate">{s.name}</h2>
                <p className="text-xs uppercase tracking-wide text-gray-400 mt-1">{categoryLabel(s.category)}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100">{s.level}%</span>
            </div>
            <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: `${s.level}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={()=>startEdit(s)} className="text-xs px-2 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50">Edit</button>
              <button onClick={()=>del(s)} className="text-xs px-2 py-1 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
              <button onClick={()=>setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-sm">Close</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label htmlFor="skill-name" className="text-sm font-medium text-gray-700 mb-1 block">Name<span className="text-red-500"> *</span></label>
                <input id="skill-name" ref={firstFieldRef} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>
              <div>
                <label htmlFor="skill-category" className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                <input list="skill-categories" id="skill-category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} placeholder="frontend, backend, tools..." className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <datalist id="skill-categories">
                  {Array.from(new Set(skills.map(s=>s.category).filter(Boolean))).map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
              <div>
                <label htmlFor="skill-level" className="text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">Level <span className="text-xs text-gray-500">{form.level}%</span></label>
                <input aria-label="Skill level" id="skill-level" type="range" min={0} max={100} value={form.level} onChange={e=>setForm(f=>({...f,level:Number(e.target.value)}))} className="w-full" />
              </div>
              <div>
                <label htmlFor="skill-icon" className="text-sm font-medium text-gray-700 mb-1 block">Icon Name (optional)</label>
                <input id="skill-icon" value={form.icon_name} onChange={e=>setForm(f=>({...f,icon_name:e.target.value}))} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>
              {formError && <p className="text-sm text-red-600" role="alert">{formError}</p>}
            </div>
            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button onClick={()=>setShowForm(false)} className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 shadow">{saving ? 'Saving...' : (editing ? 'Update' : 'Save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
