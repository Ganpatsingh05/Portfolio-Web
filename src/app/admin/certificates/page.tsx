"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  credential_id?: string;
  credential_url?: string;
  description?: string;
  image_url?: string;
  timeline?: string;
}

const emptyForm = { title: '', issuer: '', issue_date: '', credential_id: '', credential_url: '', description: '', image_url: '', timeline: '' };

export default function CertificatesPage() {
  const router = useRouter();
  const toast = useToast();
  const { confirm } = useConfirm();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const load = async () => {
    try {
      const list = await adminApi.certificates.list();
      setCertificates(list);
    } catch (e: any) {
      if (e.status === 401) { router.replace('/admin/login'); return; }
      setError(e.message);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!ensureAuthedClient()) { router.replace('/admin/login'); return; }
    load();
  }, [router]);

  const startAdd = () => {
    setEditing(null);
    setFormError(null);
    setForm(emptyForm);
    setImagePreview(null);
    setShowForm(true);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  };

  const startEdit = (c: Certificate) => {
    setEditing(c);
    setFormError(null);
    setForm({
      title: c.title,
      issuer: c.issuer,
      issue_date: c.issue_date || '',
      credential_id: c.credential_id || '',
      credential_url: c.credential_url || '',
      description: c.description || '',
      image_url: c.image_url || '',
      timeline: c.timeline || '',
    });
    setImagePreview(c.image_url || null);
    setShowForm(true);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file (JPEG, PNG, GIF, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image must be less than 5MB');
      return;
    }
    setUploading(true);
    setFormError(null);
    try {
      const result = await adminApi.upload.image(file);
      const url = result.url || result.publicUrl || '';
      setForm(f => ({ ...f, image_url: url }));
      setImagePreview(url);
    } catch (err: any) {
      setFormError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const save = async () => {
    setFormError(null);
    if (!form.title.trim()) { setFormError('Title is required'); return; }
    if (!form.issuer.trim()) { setFormError('Issuer is required'); return; }
    
    const payload: Record<string, any> = { title: form.title, issuer: form.issuer };
    if (form.issue_date) payload.issue_date = form.issue_date;
    if (form.credential_id) payload.credential_id = form.credential_id;
    if (form.credential_url) payload.credential_url = form.credential_url;
    if (form.description) payload.description = form.description;
    payload.image_url = form.image_url || null;
    payload.timeline = form.timeline || null;

    setSaving(true);
    try {
      if (editing) await adminApi.certificates.update(editing.id, payload);
      else await adminApi.certificates.create(payload);
      setShowForm(false);
      load();
      toast.success(editing ? 'Updated!' : 'Added!', `Certificate ${editing ? 'updated' : 'created'} successfully`);
    } catch (e: any) {
      setFormError(e.message || 'Failed to save certificate');
    } finally { setSaving(false); }
  };

  const del = async (c: Certificate) => {
    const confirmed = await confirm({
      title: 'Delete Certificate?',
      message: `Are you sure you want to delete "${c.title}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;
    try {
      await adminApi.certificates.delete(c.id);
      load();
      toast.success('Deleted!', 'Certificate removed successfully');
    } catch (e: any) {
      toast.error('Delete Failed', e.message || 'Failed to delete certificate');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-gray-600 dark:text-gray-400">Loading certificates...</span>
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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Certificates</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your certifications and credentials</p>
        </div>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Certificate
        </button>
      </div>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No certificates yet</p>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Add your first certificate to showcase your credentials</p>
          <button onClick={startAdd} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Certificate
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map(c => (
            <div key={c.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition group">
              {c.image_url && (
                <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{c.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{c.issuer}</p>
                  </div>
                </div>
              </div>

              {c.issue_date && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span className="font-medium">Issued:</span> {new Date(c.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </p>
              )}

              {c.credential_id && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                  <span className="font-medium">ID:</span> {c.credential_id}
                </p>
              )}

              {c.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{c.description}</p>
              )}

              {c.credential_url && (
                <a
                  href={c.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mb-3"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Credential
                </a>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => startEdit(c)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 transition"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => del(c)}
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? 'Edit Certificate' : 'Add Certificate'}</h2>
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
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Thumbnail Image <span className="text-gray-400 font-normal">(optional)</span>
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
                      id="cert-image-input"
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
                <label htmlFor="cert-title" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="cert-title"
                  ref={firstFieldRef}
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                  placeholder="e.g. AWS Solutions Architect"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
                />
              </div>
              <div>
                <label htmlFor="cert-issuer" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Issuer <span className="text-red-500">*</span>
                </label>
                <input
                  id="cert-issuer"
                  value={form.issuer}
                  onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))}
                  required
                  placeholder="e.g. Amazon Web Services"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
                />
              </div>
              <div>
                <label htmlFor="cert-date" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Issue Date <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="cert-date"
                  type="date"
                  value={form.issue_date}
                  onChange={e => setForm(f => ({ ...f, issue_date: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
                />
              </div>
              <div>
                <label htmlFor="cert-cred-id" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Credential ID <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="cert-cred-id"
                  value={form.credential_id}
                  onChange={e => setForm(f => ({ ...f, credential_id: e.target.value }))}
                  placeholder="e.g. ABC123XYZ"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
                />
              </div>
              <div>
                <label htmlFor="cert-url" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Credential URL <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="cert-url"
                  type="url"
                  value={form.credential_url}
                  onChange={e => setForm(f => ({ ...f, credential_url: e.target.value }))}
                  placeholder="https://verify.example.com/cert/..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
                />
              </div>
              <div>
                <label htmlFor="cert-desc" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="cert-desc"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Brief description of the certification..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition resize-none"
                />
              </div>
              <div>
                <label htmlFor="cert-timeline" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Timeline <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="cert-timeline"
                  value={form.timeline}
                  onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))}
                  placeholder="e.g. Jan 2024 - Mar 2024"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 px-3 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 transition"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">e.g. "Jan 2024 - Mar 2024" or "3 months"</p>
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
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-800/50 shrink-0">
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
                {saving ? 'Saving...' : (editing ? 'Update Certificate' : 'Save Certificate')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
