"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';
import { useToast } from '../components/Toast';

interface PersonalInfo { id?: string; name?: string; title?: string; email?: string; phone?: string; location?: string; bio?: string; footer_bio?: string; journey?: string; linkedin_url?: string; github_url?: string; twitter_url?: string; website_url?: string; resume_url?: string; profile_image_url?: string; degree?: string; university?: string; education_period?: string; leetcode_url?: string; }

export default function PersonalInfoPage() {
  const router = useRouter();
  const toast = useToast();
  const [info, setInfo] = useState<PersonalInfo>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingResume, setSavingResume] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => { try { setInfo(await adminApi.personal.get()); } catch(e:any){ if(e.status===401){router.replace('/admin/login');return;} setError(e.message);} finally { setLoading(false);} };
  useEffect(()=>{ if(!ensureAuthedClient()){ router.replace('/admin/login'); return;} load(); },[router]);

  const updateField = (k: keyof PersonalInfo, v: any) => { setInfo(i => ({ ...i, [k]: v })); setDirty(true); };
  const save = async () => {
    setSaving(true);
    try {
      const dataToSave = Object.fromEntries(
        Object.entries(info).filter(([_, v]) => v !== undefined && v !== '')
      );
      const updated = await adminApi.personal.update(dataToSave);
      setInfo(updated as PersonalInfo);
      setDirty(false);
      toast.success('Saved!', 'Personal info updated successfully');
    } catch (e: any) {
      toast.error('Save Failed', e.message || 'Failed to save personal info');
    } finally {
      setSaving(false);
    }
  };
  const uploadResume = async (file: File) => {
    if(!file) return;
    setUploading(true);
    try {
      const res = await adminApi.upload.resume(file);
      updateField('resume_url', res.url);
      toast.success('Resume Uploaded!', 'Click "Save Resume" to finalize the upload');
    } catch(e:any){
      toast.error('Upload Failed', e.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const saveResume = async () => {
    setSavingResume(true);
    try {
      const updated = await adminApi.personal.update({ resume_url: info.resume_url });
      setInfo(i => ({ ...i, resume_url: (updated as any).resume_url }));
      toast.success('Resume Saved!', 'Your resume has been updated');
    } catch (e: any) {
      toast.error('Save Failed', e.message || 'Failed to save resume');
    } finally {
      setSavingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading personal info...</p>
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
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personal Information</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal details and contact information</p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && (
            <span className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
          <button 
            onClick={save} 
            disabled={saving} 
            className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition font-medium"
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Basic Information */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Basic Information
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your name, title, and contact details</p>
        </div>
        <div className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput label="Name" value={info.name} onChange={v=>updateField('name', v)} required />
            <TextInput label="Title" value={info.title} onChange={v=>updateField('title', v)} required placeholder="e.g., Full Stack Developer" />
            <TextInput label="Email" type="email" value={info.email} onChange={v=>updateField('email', v)} required />
            <TextInput label="Phone" value={info.phone} onChange={v=>updateField('phone', v)} placeholder="+1 (555) 123-4567" />
            <TextInput label="Location" value={info.location} onChange={v=>updateField('location', v)} placeholder="City, Country" />
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Social Links
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your social media and professional profiles</p>
        </div>
        <div className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput label="GitHub" value={info.github_url} onChange={v=>updateField('github_url', v)} placeholder="https://github.com/username" />
            <TextInput label="LinkedIn" value={info.linkedin_url} onChange={v=>updateField('linkedin_url', v)} placeholder="https://linkedin.com/in/username" />
            <TextInput label="Twitter" value={info.twitter_url} onChange={v=>updateField('twitter_url', v)} placeholder="https://twitter.com/username" />
            <TextInput label="LeetCode" value={info.leetcode_url} onChange={v=>updateField('leetcode_url', v)} placeholder="https://leetcode.com/username" />
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            Education
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your educational background</p>
        </div>
        <div className="p-6">
          <div className="grid gap-5 md:grid-cols-3">
            <TextInput label="Degree" value={info.degree} onChange={v=>updateField('degree', v)} placeholder="B.S. Computer Science" />
            <TextInput label="University" value={info.university} onChange={v=>updateField('university', v)} placeholder="University Name" />
            <TextInput label="Period" value={info.education_period} onChange={v=>updateField('education_period', v)} placeholder="2018 - 2022" />
          </div>
        </div>
      </section>

      {/* Bio & About */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Bio & About
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tell visitors about yourself</p>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Bio</label>
            <textarea 
              value={info.bio||''} 
              onChange={e=>updateField('bio', e.target.value)} 
              rows={4} 
              placeholder="Write a brief introduction about yourself..."
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition resize-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Journey</label>
            <textarea 
              value={info.journey||''} 
              onChange={e=>updateField('journey', e.target.value)} 
              rows={4} 
              placeholder="Describe your professional journey..."
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition resize-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Footer Bio</label>
            <textarea 
              value={info.footer_bio||''} 
              onChange={e=>updateField('footer_bio', e.target.value)} 
              rows={3} 
              placeholder="Short bio for the footer section..."
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition resize-none" 
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This will appear in your website&apos;s footer</p>
          </div>
        </div>
      </section>

      {/* Resume */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Upload your resume for visitors to download</p>
        </div>
        <div className="p-6">
          {info.resume_url ? (
            <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Resume uploaded</p>
                  <a href={info.resume_url} target="_blank" className="text-xs text-green-600 dark:text-green-500 underline hover:no-underline break-all">{info.resume_url}</a>
                </div>
              </div>
              <button 
                onClick={()=>updateField('resume_url','')} 
                className="text-sm px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 mb-1">No resume uploaded</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">PDF only, up to 10MB</p>
            </div>
          )}
          
          <div className="flex gap-3 mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) uploadResume(f);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium transition"
            >
              {uploading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Resume
                </>
              )}
            </button>
            {info.resume_url && (
              <button
                type="button"
                onClick={saveResume}
                disabled={savingResume}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium transition"
              >
                {savingResume ? 'Saving...' : 'Save Resume'}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function TextInput({ label, value, onChange, type='text', required=false, placeholder='' }: { label: string; value?: any; onChange: (v:any)=>void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
        {label}{required && <span className="text-red-500 dark:text-red-400"> *</span>}
      </label>
      <input 
        type={type} 
        value={value||''} 
        required={required} 
        placeholder={placeholder}
        onChange={e=>onChange(e.target.value)} 
        className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition" 
      />
    </div>
  );
}
