"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';

interface Experience { id: string; title: string; company: string; period: string; type: 'experience' | 'education'; description?: string | string[]; created_at: string; }

export default function ExperiencesPage() {
  const router = useRouter();
  const toast = useToast();
  const { confirm } = useConfirm();
  const [items, setItems] = useState<Experience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState({ title: '', company: '', period: '', type: 'experience', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

  const load = async () => { try { setItems(await adminApi.experiences.list()); } catch(e:any){ if(e.status===401){router.replace('/admin/login');return;} setError(e.message);} finally{ setLoading(false);} };
  useEffect(()=>{ if(!ensureAuthedClient()){ router.replace('/admin/login'); return;} load(); },[router]);

  const startAdd = () => { setEditing(null); setForm({ title:'', company:'', period:'', type:'experience', description:'' }); setShowForm(true); };
  const startEdit = (x: Experience) => { setEditing(x); setForm({ title:x.title, company:x.company, period:x.period, type:x.type, description: Array.isArray(x.description) ? x.description.join('\n') : (x.description||'') }); setShowForm(true); };

  const save = async () => {
    const payload = { ...form, description: form.description.split('\n').map(l=>l.trim()).filter(Boolean) };
    setSaving(true);
    try { 
      if(editing) await adminApi.experiences.update(editing.id, payload); 
      else await adminApi.experiences.create(payload); 
      setShowForm(false); 
      load();
      toast.success(editing ? 'Updated!' : 'Added!', `Experience ${editing ? 'updated' : 'created'} successfully`);
    } catch(e:any){ 
      toast.error('Save Failed', e.message || 'Failed to save experience'); 
    } finally {
      setSaving(false);
    }
  };
  
  const del = async (x: Experience) => { 
    const confirmed = await confirm({
      title: 'Delete Experience?',
      message: `Are you sure you want to delete "${x.title}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if(!confirmed) return; 
    try { 
      await adminApi.experiences.delete(x.id); 
      load();
      toast.success('Deleted!', 'Experience removed successfully');
    } catch(e:any){ 
      toast.error('Delete Failed', e.message || 'Failed to delete experience'); 
    } 
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-gray-600 dark:text-gray-400">Loading experiences...</span>
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

  const workExperiences = items.filter(e => e.type === 'experience');
  const education = items.filter(e => e.type === 'education');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Experiences</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your work experience and education</p>
        </div>
        <button 
          onClick={startAdd} 
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Experience
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No experiences yet</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Add your work history and education</p>
          <button onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Experience
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Work Experience */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Work Experience</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{workExperiences.length} position{workExperiences.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {workExperiences.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No work experience added</p>
              ) : workExperiences.map(e => (
                <div key={e.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white">{e.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{e.company}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{e.period}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => startEdit(e)} 
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => del(e)} 
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {e.description && (
                    <ul className="mt-2 space-y-1">
                      {(Array.isArray(e.description) ? e.description : [e.description]).slice(0, 2).map((d, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span className="line-clamp-1">{d}</span>
                        </li>
                      ))}
                      {(Array.isArray(e.description) ? e.description : [e.description]).length > 2 && (
                        <li className="text-xs text-gray-500 dark:text-gray-500">+{(Array.isArray(e.description) ? e.description : [e.description]).length - 2} more</li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Education</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{education.length} degree{education.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {education.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No education added</p>
              ) : education.map(e => (
                <div key={e.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white">{e.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{e.company}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{e.period}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => startEdit(e)} 
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => del(e)} 
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {e.description && (
                    <ul className="mt-2 space-y-1">
                      {(Array.isArray(e.description) ? e.description : [e.description]).slice(0, 2).map((d, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span className="line-clamp-1">{d}</span>
                        </li>
                      ))}
                      {(Array.isArray(e.description) ? e.description : [e.description]).length > 2 && (
                        <li className="text-xs text-gray-500 dark:text-gray-500">+{(Array.isArray(e.description) ? e.description : [e.description]).length - 2} more</li>
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${form.type === 'experience' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                  {form.type === 'experience' ? (
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? 'Edit Experience' : 'Add Experience'}</h2>
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
            <div className="p-6 space-y-5 max-h-[calc(90vh-140px)] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title / Position</label>
                <input 
                  value={form.title} 
                  onChange={e => setForm(f => ({...f, title: e.target.value}))} 
                  required 
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition" 
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company / Institution</label>
                  <input 
                    value={form.company} 
                    onChange={e => setForm(f => ({...f, company: e.target.value}))} 
                    required 
                    placeholder="e.g. Google Inc."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Period</label>
                  <input 
                    value={form.period} 
                    onChange={e => setForm(f => ({...f, period: e.target.value}))} 
                    required 
                    placeholder="Jan 2024 - Present"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setForm(f => ({...f, type: 'experience'}))}
                    className={`p-3 rounded-lg border-2 transition flex items-center gap-3 ${form.type === 'experience' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Work Experience</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setForm(f => ({...f, type: 'education'}))}
                    className={`p-3 rounded-lg border-2 transition flex items-center gap-3 ${form.type === 'education' 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    <span className="font-medium">Education</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Description <span className="text-gray-400 font-normal">(one bullet point per line)</span>
                </label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm(f => ({...f, description: e.target.value}))} 
                  rows={5} 
                  placeholder="• Led development of key features&#10;• Improved system performance by 40%&#10;• Mentored junior developers"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition resize-none" 
                />
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
                {saving ? 'Saving...' : 'Save Experience'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
