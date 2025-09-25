"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';

interface PersonalInfo { id?: string; name?: string; title?: string; email?: string; phone?: string; location?: string; bio?: string; journey?: string; linkedin_url?: string; github_url?: string; twitter_url?: string; website_url?: string; resume_url?: string; profile_image_url?: string; degree?: string; university?: string; education_period?: string; }

export default function PersonalInfoPage() {
  const router = useRouter();
  const [info, setInfo] = useState<PersonalInfo>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => { try { setInfo(await adminApi.personal.get()); } catch(e:any){ if(e.status===401){router.replace('/admin/login');return;} setError(e.message);} finally { setLoading(false);} };
  useEffect(()=>{ if(!ensureAuthedClient()){ router.replace('/admin/login'); return;} load(); },[router]);

  const updateField = (k: keyof PersonalInfo, v: any) => setInfo(i => ({ ...i, [k]: v }));
  const save = async () => { setSaving(true); try { const updated = await adminApi.personal.update(info); setInfo(updated as PersonalInfo); alert('Saved personal info'); } catch(e:any){ alert(e.message||'Failed to save'); } finally { setSaving(false);} };
  const uploadResume = async (file: File) => {
    if(!file) return; try { const res = await adminApi.upload.resume(file); updateField('resume_url', res.url); } catch(e:any){ alert(e.message||'Upload failed'); } };

  if (loading) return <div className="p-8">Loading personal info...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-md text-sm font-medium shadow">{saving ? 'Saving...' : 'Save Changes'}</button>
      </header>

      <section className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput label="Name" value={info.name} onChange={v=>updateField('name', v)} required />
          <TextInput label="Title" value={info.title} onChange={v=>updateField('title', v)} required />
          <TextInput label="Email" type="email" value={info.email} onChange={v=>updateField('email', v)} required />
          <TextInput label="Phone" value={info.phone} onChange={v=>updateField('phone', v)} />
          <TextInput label="Location" value={info.location} onChange={v=>updateField('location', v)} />
          <TextInput label="Website" value={info.website_url} onChange={v=>updateField('website_url', v)} />
          <TextInput label="GitHub" value={info.github_url} onChange={v=>updateField('github_url', v)} />
          <TextInput label="LinkedIn" value={info.linkedin_url} onChange={v=>updateField('linkedin_url', v)} />
          <TextInput label="Twitter" value={info.twitter_url} onChange={v=>updateField('twitter_url', v)} />
          <TextInput label="Degree" value={info.degree} onChange={v=>updateField('degree', v)} />
          <TextInput label="University" value={info.university} onChange={v=>updateField('university', v)} />
          <TextInput label="Education Period" value={info.education_period} onChange={v=>updateField('education_period', v)} />
        </div>
        <div>
          <Label>Bio</Label>
          <textarea value={info.bio||''} onChange={e=>updateField('bio', e.target.value)} rows={4} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
        </div>
        <div>
          <Label>Journey</Label>
          <textarea value={info.journey||''} onChange={e=>updateField('journey', e.target.value)} rows={4} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
        </div>
      </section>

      <section className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Resume</h2>
        <div className="space-y-4">
          {info.resume_url ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-sm text-green-700 font-medium break-all">Current: <a href={info.resume_url} target="_blank" className="underline break-all">{info.resume_url}</a></p>
              <div className="flex items-center gap-3">
                <button onClick={()=>updateField('resume_url','')} className="text-sm px-3 py-1.5 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">Remove</button>
              </div>
            </div>
          ) : <p className="text-sm text-gray-500">No resume uploaded.</p>}
          <div>
            <input type="file" accept="application/pdf" onChange={e=>{ const f=e.target.files?.[0]; if(f) uploadResume(f); }} />
            <p className="text-xs text-gray-400 mt-1">PDF only, up to 10MB.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TextInput({ label, value, onChange, type='text', required=false }: { label: string; value?: any; onChange: (v:any)=>void; type?: string; required?: boolean }) {
  return (
    <div>
      <Label>{label}{required && <span className="text-red-500"> *</span>}</Label>
      <input type={type} value={value||''} required={required} onChange={e=>onChange(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) { return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>; }
