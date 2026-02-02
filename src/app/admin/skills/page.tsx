"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';

interface Skill { id: string; name: string; level: number; category: string; icon_name?: string; sort_order?: number; is_featured?: boolean; }

export default function SkillsPage() {
  const router = useRouter();
  const toast = useToast();
  const { confirm } = useConfirm();
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
      toast.success(editing ? 'Updated!' : 'Added!', `Skill ${editing ? 'updated' : 'created'} successfully`);
    } catch(e:any){ setFormError(e.message||'Failed to save skill'); }
    finally { setSaving(false); }
  };
  
  const del = async (s: Skill) => {
    const confirmed = await confirm({
      title: 'Delete Skill?',
      message: `Are you sure you want to delete "${s.name}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if(!confirmed) return;
    try { 
      await adminApi.skills.delete(s.id); 
      load();
      toast.success('Deleted!', 'Skill removed successfully');
    }
    catch(e:any){ 
      toast.error('Delete Failed', e.message || 'Failed to delete skill'); 
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-gray-600 dark:text-gray-400">Loading skills...</span>
      </div>
    </div>
  );
  if (error) return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
      </div>
    </div>
  );

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Skills</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your technical skills and proficiency levels</p>
        </div>
        <button 
          onClick={startAdd} 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Skill
        </button>
      </div>

      {/* Skills by Category */}
      {skills.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No skills yet</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first skill to showcase your expertise</p>
          <button onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Skill
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white capitalize">{category}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categorySkills.map(s => (
                    <div key={s.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition group">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{s.name}</h4>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">
                          {s.level}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mb-3">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300" 
                          style={{ width: `${s.level}%` }} 
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                        <button 
                          onClick={() => startEdit(s)} 
                          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => del(s)} 
                          className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? 'Edit Skill' : 'Add Skill'}</h2>
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
            <div className="p-6 space-y-5">
              <div>
                <label htmlFor="skill-name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Name <span className="text-red-500">*</span>
                </label>
                <input 
                  id="skill-name" 
                  ref={firstFieldRef} 
                  value={form.name} 
                  onChange={e => setForm(f => ({...f, name: e.target.value}))} 
                  required 
                  placeholder="e.g. React, Python, Docker"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition" 
                />
              </div>
              <div>
                <label htmlFor="skill-category" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Category</label>
                <select 
                  id="skill-category" 
                  value={form.category} 
                  onChange={e => setForm(f => ({...f, category: e.target.value}))} 
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
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
                  {Array.from(new Set(skills.map(s => s.category).filter(Boolean)))
                    .filter(c => !['frontend', 'backend', 'database', 'tools', 'languages', 'frameworks', 'mobile', 'cloud', 'ai-ml', 'design', 'other'].includes(c.toLowerCase()))
                    .map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="skill-level" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center justify-between">
                  Proficiency Level 
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{form.level}%</span>
                </label>
                <div className="relative pt-1">
                  <input 
                    aria-label="Skill level" 
                    id="skill-level" 
                    type="range" 
                    min={0} 
                    max={100} 
                    value={form.level} 
                    onChange={e => setForm(f => ({...f, level: Number(e.target.value)}))} 
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="skill-icon" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Icon Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input 
                  id="skill-icon" 
                  value={form.icon_name} 
                  onChange={e => setForm(f => ({...f, icon_name: e.target.value}))} 
                  placeholder="e.g. react, python, docker"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition" 
                />
              </div>
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600 dark:text-red-400" role="alert">{formError}</p>
                </div>
              )}
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
                {saving ? 'Saving...' : (editing ? 'Update Skill' : 'Save Skill')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
