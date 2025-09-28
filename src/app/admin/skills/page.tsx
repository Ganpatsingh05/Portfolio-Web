"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';

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

  if (loading) return <div className="p-8 text-gray-600 dark:text-gray-400">Loading skills...</div>;
  if (error) return <div className="p-8 text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h1>
        <button onClick={startAdd} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow transition">Add Skill</button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {skills.map(s => (
          <div key={s.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-5 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg truncate">{s.name}</h2>
                <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mt-1">{categoryLabel(s.category)}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">{s.level}%</span>
            </div>
            <div className="mt-3 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500" style={{ width: `${s.level}%` }} />
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={()=>startEdit(s)} className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition">Edit</button>
              <button onClick={()=>del(s)} className="text-xs px-2 py-1 rounded border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-2 border-blue-700 dark:border-blue-600">
            <div className="p-6 border-b border-blue-200 dark:border-gray-700 flex items-center justify-between bg-blue-50 dark:bg-gray-700">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
              <button onClick={()=>setShowForm(false)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition">Close</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label htmlFor="skill-name" className="text-sm font-medium text-gray-900 dark:text-white mb-1 block">Name<span className="text-red-500 dark:text-red-400"> *</span></label>
                <input id="skill-name" ref={firstFieldRef} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition" />
              </div>
              <div>
                <label htmlFor="skill-category" className="text-sm font-medium text-gray-900 dark:text-white mb-1 block">Category</label>
                <select 
                  id="skill-category" 
                  value={form.category} 
                  onChange={e=>setForm(f=>({...f,category:e.target.value}))} 
                  className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition"
                >
                  <option value="">Select a category...</option>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="tools">Tools & DevOps</option>
                  <option value="languages">Programming Languages</option>
                  <option value="frameworks">Frameworks & Libraries</option>
                  <option value="mobile">Mobile Development</option>
                  <option value="cloud">Cloud & Infrastructure</option>
                  <option value="ai-ml">AI & Machine Learning</option>
                  <option value="design">Design & UI/UX</option>
                  <option value="other">Other</option>
                  {/* Add existing categories from database that might not be in predefined list */}
                  {Array.from(new Set(skills.map(s=>s.category).filter(Boolean)))
                    .filter(c => !['frontend', 'backend', 'database', 'tools', 'languages', 'frameworks', 'mobile', 'cloud', 'ai-ml', 'design', 'other'].includes(c.toLowerCase()))
                    .map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="skill-level" className="text-sm font-medium text-gray-900 dark:text-white mb-1 flex items-center justify-between">Level <span className="text-xs text-blue-600 dark:text-blue-400">{form.level}%</span></label>
                <input aria-label="Skill level" id="skill-level" type="range" min={0} max={100} value={form.level} onChange={e=>setForm(f=>({...f,level:Number(e.target.value)}))} className="w-full accent-blue-600 dark:accent-blue-400" />
              </div>
              <div>
                <label htmlFor="skill-icon" className="text-sm font-medium text-gray-900 dark:text-white mb-1 block">Icon Name (optional)</label>
                <input id="skill-icon" value={form.icon_name} onChange={e=>setForm(f=>({...f,icon_name:e.target.value}))} className="w-full rounded-md border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-medium transition" />
              </div>
              {formError && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{formError}</p>}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-700">
              <button onClick={()=>setShowForm(false)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 rounded-md bg-blue-600 dark:bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-700 disabled:opacity-60 shadow transition">{saving ? 'Saving...' : (editing ? 'Update' : 'Save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
