"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';

interface Project { id: string; title: string; description: string; category?: string; technologies?: string[]; demo_url?: string; github_url?: string; image_url?: string; timeline?: string; visible?: boolean; status?: 'completed' | 'in-progress' | 'planning'; end_date?: string; created_at: string; }

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
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    title: '', description: '', category: '', technologies: '', demo_url: '', github_url: '', image_url: '', timeline: '', status: 'completed' as 'completed' | 'in-progress' | 'planning', end_date: ''
  });

  const load = async () => {
    try {
      const list = await adminApi.projects.list();
      // Sort by end_date (completion date) descending (newest first), then by created_at descending
      list.sort((a: Project, b: Project) => {
        // If both have end_date, sort by end_date (most recent first)
        if (a.end_date && b.end_date) {
          return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
        }
        // If only a has end_date, a comes first
        if (a.end_date && !b.end_date) return -1;
        // If only b has end_date, b comes first
        if (!a.end_date && b.end_date) return 1;
        // If neither has end_date, sort by created_at (most recent first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setProjects(list);
    } catch (e: any) { if (e.status===401) { router.replace('/admin/login'); return;} setError(e.message); } finally { setLoading(false);} };
  useEffect(()=>{ if(!ensureAuthedClient()){router.replace('/admin/login');return;} load(); },[router]);

  const startAdd = () => { setEditing(null); setForm({ title:'', description:'', category:'', technologies:'', demo_url:'', github_url:'', image_url: '', timeline: '', status: 'completed', end_date: '' }); setImagePreview(null); setShowForm(true);} ;
  const startEdit = (p: Project) => { setEditing(p); setForm({ title:p.title, description:p.description, category:p.category||'', technologies:(p.technologies||[]).join(', '), demo_url:p.demo_url||'', github_url:p.github_url||'', image_url:p.image_url||'', timeline:p.timeline||'', status:p.status||'completed', end_date:p.end_date||''}); setImagePreview(p.image_url||null); setShowForm(true);} ;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Invalid File', 'Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('File Too Large', 'Image must be less than 5MB'); return; }
    setUploading(true);
    try {
      const result = await adminApi.upload.image(file);
      const url = result.url || result.publicUrl || '';
      setForm(f => ({ ...f, image_url: url }));
      setImagePreview(url);
    } catch (err: any) {
      toast.error('Upload Failed', err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const save = async () => {
    setSaving(true);
    const payload = { ...form, technologies: form.technologies.split(',').map(t=>t.trim()).filter(Boolean), image_url: form.image_url || null, timeline: form.timeline || null, status: form.status, end_date: form.end_date || null };
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

  const toggleVisibility = async (p: Project) => {
    const newVisible = !(p.visible !== false);
    try {
      await adminApi.projects.update(p.id, { visible: newVisible });
      setProjects(prev => prev.map(proj => proj.id === p.id ? { ...proj, visible: newVisible } : proj));
      toast.success(newVisible ? 'Visible' : 'Hidden', `Project is now ${newVisible ? 'visible' : 'hidden'} on the site`);
    } catch (e: any) {
      toast.error('Update Failed', e.message || 'Failed to update visibility');
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
            <div key={p.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition group ${p.visible === false ? 'border-gray-300 dark:border-gray-600 opacity-60' : 'border-gray-200 dark:border-gray-700'}`}>
              {p.visible === false && (
                <div className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                  <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Hidden from site</span>
                </div>
              )}
              {p.image_url && (
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-gray-900 dark:text-white text-lg truncate">{p.title}</h2>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                        {p.category || 'Uncategorized'}
                      </span>
                      {p.status && (
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                          p.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          p.status === 'in-progress' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                        }`}>
                          {p.status === 'in-progress' ? 'In Progress' : p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">{p.description}</p>
                {p.end_date && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Completed: {new Date(p.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
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
                    onClick={() => toggleVisibility(p)}
                    className={`p-1.5 rounded-lg transition ${p.visible === false ? 'hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400' : 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'}`}
                    title={p.visible === false ? 'Show on site' : 'Hide from site'}
                  >
                    {p.visible === false ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    )}
                  </button>
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
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Project Image <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex items-start gap-4">
                  {imagePreview ? (
                    <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(null); setForm(f => ({ ...f, image_url: '' })); }}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                      id="project-image-input"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          {imagePreview ? 'Change Image' : 'Upload Image'}
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPEG, PNG, GIF, WebP. Max 5MB.</p>
                  </div>
                </div>
              </div>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Timeline</label>
                <input
                  value={form.timeline}
                  onChange={e => setForm(f => ({...f, timeline: e.target.value}))}
                  placeholder="e.g. Jan 2024 - Mar 2024"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">e.g. "Jan 2024 - Mar 2024" or "2 weeks"</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({...f, status: e.target.value as 'completed' | 'in-progress' | 'planning'}))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="planning">Planning</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Completed On <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={e => setForm(f => ({...f, end_date: e.target.value}))}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
                  />
                </div>
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
