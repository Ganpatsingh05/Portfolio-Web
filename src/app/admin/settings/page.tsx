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
  const [success, setSuccess] = useState(false);
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
        if (mounted) {
          setError(e?.message || 'Failed to load settings');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const update = (patch: Partial<SettingsData>) => {
    setSettings(prev => ({ ...prev, ...patch }));
    setDirty(true);
    setSuccess(false);
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
      setSuccess(true);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings(defaultSettings);
      setDirty(true);
      setSuccess(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your portfolio configuration and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {dirty && (
            <span className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
          {success && (
            <span className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
              Settings saved successfully!
            </span>
          )}
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
          >
            Reset to Defaults
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition font-medium"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm border border-red-200 dark:border-red-800 flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* General Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            General Settings
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Core application settings and features</p>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-gray-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={settings.maintenance_mode}
                onChange={e => update({ maintenance_mode: e.target.checked })}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</span>
                  {settings.maintenance_mode && (
                    <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Temporarily disable public access to your portfolio
                </p>
              </div>
            </label>

            <label className="flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-gray-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={settings.show_analytics}
                onChange={e => update({ show_analytics: e.target.checked })}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Show Analytics on Dashboard</span>
                  {settings.show_analytics && (
                    <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                      Enabled
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Display visitor analytics and engagement metrics
                </p>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
            </svg>
            Hero Section Content
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Customize the main headline and description on your homepage</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Main Headline
            </label>
            <input
              type="text"
              value={settings.hero_headline || ''}
              onChange={e => update({ hero_headline: e.target.value })}
              maxLength={200}
              placeholder="Enter your main headline (optional)"
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Up to 200 characters</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {(settings.hero_headline || '').length}/200
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Subheadline
            </label>
            <textarea
              value={settings.hero_subheadline || ''}
              onChange={e => update({ hero_subheadline: e.target.value })}
              maxLength={400}
              rows={4}
              placeholder="Enter supporting text or description (optional)"
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Up to 400 characters</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {(settings.hero_subheadline || '').length}/400
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.258 0A17.926 17.926 0 0021 12c0-2.874-.673-5.59-1.871-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15" />
            </svg>
            Featured Sections
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Select which sections are prominently displayed on your public site</p>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            {['projects','skills','experiences','testimonials','blog'].map(section => {
              const active = settings.featured_sections.includes(section);
              return (
                <button
                  key={section}
                  type="button"
                  onClick={() => toggleSection(section)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium border-2 transition capitalize ${
                    active 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  }`}
                >
                  {active && (
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {section}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Selected sections: {settings.featured_sections.length === 0 ? 'None' : settings.featured_sections.join(', ')}
          </p>
        </div>
      </section>

      {/* Save Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={resetToDefaults}
          className="px-6 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
        >
          Reset to Defaults
        </button>
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="px-8 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition font-medium"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
