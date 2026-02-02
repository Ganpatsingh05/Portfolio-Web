"use client";
import React, { useEffect, useState } from 'react';
import { adminApi } from '@/app/lib/admin/api';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';
import { useAdminTheme } from '../ThemeProvider';

interface SettingsData {
  // Site Status
  maintenance_mode: boolean;
  maintenance_message: string;
  
  // Display Options
  show_analytics: boolean;
  show_footer: boolean;
  show_navigation: boolean;
  
  // Section Visibility
  visible_sections: string[];
  
  // Contact Form
  contact_form_enabled: boolean;
  contact_email_notifications: boolean;
  
  // SEO & Meta
  site_title: string;
  site_description: string;
  meta_keywords: string;
  
  // Theme & Appearance
  default_theme: 'light' | 'dark' | 'system';
  accent_color: string;
  
  // Social Links Display
  show_social_links: boolean;
  show_resume_button: boolean;
  
  // Performance
  enable_animations: boolean;
  lazy_load_images: boolean;
}

const defaultSettings: SettingsData = {
  // Site Status
  maintenance_mode: false,
  maintenance_message: 'Site is under maintenance. Please check back soon.',
  
  // Display Options
  show_analytics: true,
  show_footer: true,
  show_navigation: true,
  
  // Section Visibility
  visible_sections: ['hero', 'about', 'skills', 'projects', 'experience', 'contact'],
  
  // Contact Form
  contact_form_enabled: true,
  contact_email_notifications: true,
  
  // SEO & Meta
  site_title: 'Portfolio',
  site_description: 'Personal portfolio website',
  meta_keywords: 'portfolio, developer, web development',
  
  // Theme & Appearance
  default_theme: 'system',
  accent_color: '#3B82F6',
  
  // Social Links Display
  show_social_links: true,
  show_resume_button: true,
  
  // Performance
  enable_animations: true,
  lazy_load_images: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [success, setSuccess] = useState(false);
  const toast = useToast();
  const { setTheme, setAccentColor } = useAdminTheme();
  const { confirm } = useConfirm();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await adminApi.settings.get();
        if (mounted) {
          setSettings({
            // Site Status
            maintenance_mode: data.maintenance_mode ?? false,
            maintenance_message: data.maintenance_message ?? defaultSettings.maintenance_message,
            
            // Display Options
            show_analytics: data.show_analytics ?? true,
            show_footer: data.show_footer ?? true,
            show_navigation: data.show_navigation ?? true,
            
            // Section Visibility
            visible_sections: Array.isArray(data.visible_sections) ? data.visible_sections : defaultSettings.visible_sections,
            
            // Contact Form
            contact_form_enabled: data.contact_form_enabled ?? true,
            contact_email_notifications: data.contact_email_notifications ?? true,
            
            // SEO & Meta
            site_title: data.site_title ?? defaultSettings.site_title,
            site_description: data.site_description ?? defaultSettings.site_description,
            meta_keywords: data.meta_keywords ?? defaultSettings.meta_keywords,
            
            // Theme & Appearance
            default_theme: data.default_theme ?? 'system',
            accent_color: data.accent_color ?? defaultSettings.accent_color,
            
            // Social Links Display
            show_social_links: data.show_social_links ?? true,
            show_resume_button: data.show_resume_button ?? true,
            
            // Performance
            enable_animations: data.enable_animations ?? true,
            lazy_load_images: data.lazy_load_images ?? true,
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
      visible_sections: settings.visible_sections.includes(section)
        ? settings.visible_sections.filter(s => s !== section)
        : [...settings.visible_sections, section]
    });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await adminApi.settings.update(settings);
      setDirty(false);
      setSuccess(true);
      toast.success('Saved!', 'Settings updated successfully');
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      toast.error('Save Failed', e?.message || 'Failed to save settings');
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    const confirmed = await confirm({
      title: 'Reset to Defaults?',
      message: 'Are you sure you want to reset all settings to defaults? This action cannot be undone.',
      type: 'warning',
      confirmText: 'Reset',
      cancelText: 'Cancel'
    });
    
    if (confirmed) {
      setSettings(defaultSettings);
      setDirty(true);
      setSuccess(false);
      toast.info('Reset Complete', 'Settings have been reset to defaults');
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
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
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
            <span className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
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

      {/* Site Status Section */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Site Status
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Control site availability</p>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-start gap-4 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 bg-white dark:bg-gray-700 cursor-pointer transition">
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={e => update({ maintenance_mode: e.target.checked })}
              className="h-5 w-5 mt-0.5 text-red-600 rounded focus:ring-red-500 focus:ring-2"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</span>
                {settings.maintenance_mode && (
                  <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-medium">
                    Site is Offline
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                When enabled, visitors will see a maintenance message instead of your portfolio
              </p>
            </div>
          </label>
          
          {settings.maintenance_mode && (
            <div className="ml-9">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maintenance Message
              </label>
              <textarea
                value={settings.maintenance_message}
                onChange={e => update({ maintenance_message: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter maintenance message..."
              />
            </div>
          )}
        </div>
      </section>

      {/* Section Visibility */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Section Visibility
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Choose which sections appear on your public portfolio</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'hero', label: 'Hero', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              ) },
              { id: 'about', label: 'About', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) },
              { id: 'skills', label: 'Skills', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) },
              { id: 'projects', label: 'Projects', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              ) },
              { id: 'experience', label: 'Experience', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ) },
              { id: 'contact', label: 'Contact', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ) },
            ].map(section => {
              const active = settings.visible_sections.includes(section.id);
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium border-2 transition ${
                    active 
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-500' 
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <span className={active ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}>{section.icon}</span>
                  <span>{section.label}</span>
                  {active && (
                    <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO & Meta Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            SEO & Meta
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Optimize your site for search engines</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={e => update({ site_title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your Portfolio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta Description
            </label>
            <textarea
              value={settings.site_description}
              onChange={e => update({ site_description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="A brief description of your portfolio..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Recommended: 150-160 characters for optimal SEO
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keywords
            </label>
            <input
              type="text"
              value={settings.meta_keywords}
              onChange={e => update({ meta_keywords: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="developer, portfolio, web development, react, nodejs"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Comma-separated keywords
            </p>
          </div>
        </div>
      </section>

      {/* Appearance Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 sm:px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Appearance
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Customize the look and feel</p>
        </div>
        <div className="p-4 sm:p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Default Theme
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { value: 'light', label: 'Light', icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) },
                { value: 'dark', label: 'Dark', icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) },
                { value: 'system', label: 'System', icon: (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) },
              ].map(theme => (
                <button
                  key={theme.value}
                  type="button"
                  onClick={() => {
                    update({ default_theme: theme.value as SettingsData['default_theme'] });
                    // Preview theme instantly in admin panel
                    setTheme(theme.value as 'light' | 'dark' | 'system');
                  }}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium border-2 transition ${
                    settings.default_theme === theme.value
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <span className={settings.default_theme === theme.value ? 'text-blue-600 dark:text-blue-400' : ''}>{theme.icon}</span>
                  <span className="hidden xs:inline sm:inline">{theme.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Theme changes are previewed instantly. Save to apply to the public site.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Accent Color
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.accent_color}
                  onChange={e => {
                    update({ accent_color: e.target.value });
                    setAccentColor(e.target.value);
                  }}
                  className="h-10 w-14 sm:w-20 rounded cursor-pointer border border-gray-300 dark:border-gray-600 flex-shrink-0"
                />
                <input
                  type="text"
                  value={settings.accent_color}
                  onChange={e => {
                    update({ accent_color: e.target.value });
                    setAccentColor(e.target.value);
                  }}
                  className="flex-1 min-w-0 max-w-[120px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
                  placeholder="#3B82F6"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      update({ accent_color: color });
                      setAccentColor(color);
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition flex-shrink-0 ${
                      settings.accent_color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Display Options */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Display Options
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Toggle UI elements</p>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { key: 'show_navigation', label: 'Show Navigation Bar', desc: 'Display the top navigation menu' },
              { key: 'show_footer', label: 'Show Footer', desc: 'Display the footer section' },
              { key: 'show_social_links', label: 'Show Social Links', desc: 'Display social media icons' },
              { key: 'show_resume_button', label: 'Show Resume Button', desc: 'Display download resume button' },
              { key: 'show_analytics', label: 'Show Analytics (Admin)', desc: 'Display analytics on admin dashboard' },
            ].map(option => (
              <label 
                key={option.key}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-gray-700 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={settings[option.key as keyof SettingsData] as boolean}
                  onChange={e => update({ [option.key]: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{option.label}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Form
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure contact form behavior</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-500 bg-white dark:bg-gray-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={settings.contact_form_enabled}
                onChange={e => update({ contact_form_enabled: e.target.checked })}
                className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Contact Form</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Allow visitors to send you messages</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-teal-300 dark:hover:border-teal-500 bg-white dark:bg-gray-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={settings.contact_email_notifications}
                onChange={e => update({ contact_email_notifications: e.target.checked })}
                className="h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive email when someone submits the contact form</p>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Performance Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Performance
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Optimize site performance</p>
        </div>
        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 bg-white dark:bg-gray-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={settings.enable_animations}
                onChange={e => update({ enable_animations: e.target.checked })}
                className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Animations</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Smooth transitions and effects</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 bg-white dark:bg-gray-700 cursor-pointer transition">
              <input
                type="checkbox"
                checked={settings.lazy_load_images}
                onChange={e => update({ lazy_load_images: e.target.checked })}
                className="h-4 w-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">Lazy Load Images</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Load images as they come into view</p>
              </div>
            </label>
          </div>
        </div>
      </section>

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
        >
          Reset All to Defaults
        </button>
        <div className="flex gap-3">
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
    </div>
  );
}
