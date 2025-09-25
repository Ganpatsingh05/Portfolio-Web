"use client";
import React, { useEffect, useState } from 'react';
import { adminApi } from '@/app/lib/admin/api';
import { useRouter } from 'next/navigation';

interface SettingsData {
  maintenance_mode: boolean;
  show_analytics: boolean;
  featured_sections: string[];
  hero_headline?: string | null;
  hero_subheadline?: string | null;
}

const defaultSettings: SettingsData = {
  maintenance_mode: false,
  show_analytics: true,
  featured_sections: ['projects','skills','experiences'],
  hero_headline: '',
  hero_subheadline: ''
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await adminApi.settings.get();
        if (mounted) {
          setSettings({
            maintenance_mode: data.maintenance_mode ?? false,
            show_analytics: data.show_analytics ?? true,
            featured_sections: Array.isArray(data.featured_sections) ? data.featured_sections : ['projects','skills','experiences'],
            hero_headline: data.hero_headline || '',
            hero_subheadline: data.hero_subheadline || ''
          });
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load settings');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const update = (patch: Partial<SettingsData>) => {
    setSettings(prev => ({ ...prev, ...patch }));
    setDirty(true);
  };

  const toggleSection = (section: string) => {
    update({
      featured_sections: settings.featured_sections.includes(section)
        ? settings.featured_sections.filter(s => s !== section)
        : [...settings.featured_sections, section]
    });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: any = { ...settings };
      // Normalize empty strings to null for optional text fields
      if (!payload.hero_headline) payload.hero_headline = null;
      if (!payload.hero_subheadline) payload.hero_subheadline = null;
      await adminApi.settings.update(payload);
      setDirty(false);
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Site Settings</h1>
        <div className="flex items-center gap-3">
          {dirty && <span className="text-sm text-amber-600">Unsaved changes</span>}
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      {error && <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">{error}</div>}

      <section className="space-y-4">
        <h2 className="text-lg font-medium flex items-center gap-2">General</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 p-4 rounded border bg-white shadow-sm">
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={e => update({ maintenance_mode: e.target.checked })}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium">Maintenance Mode</span>
          </label>
          <label className="flex items-center gap-3 p-4 rounded border bg-white shadow-sm">
            <input
              type="checkbox"
              checked={settings.show_analytics}
              onChange={e => update({ show_analytics: e.target.checked })}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium">Show Analytics on Dashboard</span>
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Hero Section</h2>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input
              type="text"
              value={settings.hero_headline || ''}
              onChange={e => update({ hero_headline: e.target.value })}
              maxLength={200}
              placeholder="Custom hero headline (optional)"
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Up to 200 characters.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subheadline</label>
            <textarea
              value={settings.hero_subheadline || ''}
              onChange={e => update({ hero_subheadline: e.target.value })}
              maxLength={400}
              rows={3}
              placeholder="Short supporting text (optional)"
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Up to 400 characters.</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Featured Sections</h2>
        <p className="text-sm text-gray-600">Select which sections are highlighted on the public site.</p>
        <div className="flex flex-wrap gap-3">
          {['projects','skills','experiences','testimonials','blog'].map(section => {
            const active = settings.featured_sections.includes(section);
            return (
              <button
                key={section}
                type="button"
                onClick={() => toggleSection(section)}
                className={`px-4 py-2 rounded text-sm border transition ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-gray-50'}`}
              >
                {active ? '✓ ' : ''}{section}
              </button>
            );
          })}
        </div>
      </section>

      <div className="pt-6 border-t flex justify-end">
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="px-6 py-2 rounded bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
