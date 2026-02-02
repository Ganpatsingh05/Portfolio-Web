"use client";
import React, { useEffect, useState } from 'react';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';
import { useRouter } from 'next/navigation';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';

interface HeroData {
  greeting: string;
  name: string;
  typing_texts: string[];
  quote?: string | null;
  social_links: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const defaultHero: HeroData = {
  greeting: 'Hello, I\'m',
  name: '',
  typing_texts: [],
  quote: '',
  social_links: {
    github: '',
    linkedin: '',
    email: ''
  }
};

export default function HeroPage() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newTypingText, setNewTypingText] = useState('');
  const router = useRouter();
  const toast = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    if (!ensureAuthedClient()) {
      router.replace('/admin/login');
      return;
    }
    
    let mounted = true;
    (async () => {
      try {
        const data = await adminApi.hero.get();
        if (mounted && data) {
          setHero({
            greeting: data.greeting || 'Hello, I\'m',
            name: data.name || '',
            typing_texts: Array.isArray(data.typing_texts) ? data.typing_texts : [],
            quote: data.quote || '',
            social_links: {
              github: data.social_links?.github || '',
              linkedin: data.social_links?.linkedin || '',
              email: data.social_links?.email || ''
            }
          });
        }
      } catch (e: any) {
        if (mounted) {
          if (e?.status === 401) {
            router.replace('/admin/login');
            return;
          }
          setError(e?.message || 'Failed to load hero data');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  const update = (patch: Partial<HeroData>) => {
    setHero(prev => ({ ...prev, ...patch }));
    setDirty(true);
    setSuccess(false);
  };

  const updateSocialLink = (platform: keyof HeroData['social_links'], value: string) => {
    update({
      social_links: {
        ...hero.social_links,
        [platform]: value
      }
    });
  };

  const addTypingText = () => {
    if (newTypingText.trim() && !hero.typing_texts.includes(newTypingText.trim())) {
      update({
        typing_texts: [...hero.typing_texts, newTypingText.trim()]
      });
      setNewTypingText('');
    }
  };

  const removeTypingText = (index: number) => {
    update({
      typing_texts: hero.typing_texts.filter((_, i) => i !== index)
    });
  };

  const moveTypingText = (index: number, direction: 'up' | 'down') => {
    const newTexts = [...hero.typing_texts];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newTexts.length) {
      [newTexts[index], newTexts[newIndex]] = [newTexts[newIndex], newTexts[index]];
      update({ typing_texts: newTexts });
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        greeting: hero.greeting || null,
        name: hero.name,
        typing_texts: hero.typing_texts,
        quote: hero.quote || null,
        social_links: Object.fromEntries(
          Object.entries(hero.social_links).filter(([_, value]) => value && value.trim() !== '')
        )
      };
      const result = await adminApi.hero.update(payload);
      // Update state with returned data
      if (result) {
        setHero({
          greeting: result.greeting || 'Hello, I\'m',
          name: result.name || '',
          typing_texts: Array.isArray(result.typing_texts) ? result.typing_texts : [],
          quote: result.quote || '',
          social_links: {
            github: result.social_links?.github || '',
            linkedin: result.social_links?.linkedin || '',
            email: result.social_links?.email || ''
          }
        });
      }
      setDirty(false);
      setSuccess(true);
      toast.success('Saved!', 'Hero section updated successfully');
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      toast.error('Save Failed', e?.message || 'Failed to save hero section');
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = async () => {
    const confirmed = await confirm({
      title: 'Reset to Defaults?',
      message: 'Are you sure you want to reset all hero content to defaults? This action cannot be undone.',
      type: 'warning',
      confirmText: 'Reset',
      cancelText: 'Cancel'
    });
    
    if (confirmed) {
      setHero(defaultHero);
      setDirty(true);
      setSuccess(false);
      toast.info('Reset Complete', 'Hero content has been reset to defaults');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading hero content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hero Section</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Customize your homepage hero section content and social links</p>
          </div>
          <div className="flex items-center gap-3">
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
        {/* Status badges below header */}
        {(dirty || success) && (
          <div className="flex items-center gap-3">
            {dirty && (
              <span className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                Unsaved changes
              </span>
            )}
            {success && (
              <span className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                Hero content saved successfully!
              </span>
            )}
          </div>
        )}
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

      {/* Basic Information */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Basic Information
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your greeting, name and personal quote displayed on the homepage</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Greeting Text
            </label>
            <input
              type="text"
              value={hero.greeting}
              onChange={e => update({ greeting: e.target.value })}
              maxLength={50}
              placeholder="e.g., Hello, I'm or Hi, I'm or Welcome, I'm"
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Text shown before your name (e.g., "Hello, I'm")</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {hero.greeting.length}/50
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={hero.name}
              onChange={e => update({ name: e.target.value })}
              maxLength={100}
              placeholder="Enter your full name"
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Up to 100 characters</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {hero.name.length}/100
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
              Quote or Tagline
            </label>
            <textarea
              value={hero.quote || ''}
              onChange={e => update({ quote: e.target.value })}
              maxLength={200}
              rows={3}
              placeholder="Enter a short quote or tagline (optional)"
              className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Up to 200 characters</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {(hero.quote || '').length}/200
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Typing Animation Texts */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Typing Animation Texts
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Texts that will animate in a typing effect on your homepage</p>
        </div>
        <div className="p-6">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newTypingText}
              onChange={e => setNewTypingText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addTypingText()}
              maxLength={50}
              placeholder="Add new typing text..."
              className="flex-1 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition"
            />
            <button
              onClick={addTypingText}
              disabled={!newTypingText.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              Add
            </button>
          </div>

          {hero.typing_texts.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Current typing texts ({hero.typing_texts.length}):
              </p>
              {hero.typing_texts.map((text, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="flex-1 text-gray-900 dark:text-white">{text}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => moveTypingText(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveTypingText(index, 'down')}
                      disabled={index === hero.typing_texts.length - 1}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeTypingText(index)}
                      className="p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <p>No typing texts added yet</p>
              <p className="text-sm">Add some texts to animate on your homepage</p>
            </div>
          )}
        </div>
      </section>

      {/* Social Media Links */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Hero Social Links
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Social links displayed in the hero section. For other sections, update Personal Info.</p>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="flex text-sm font-medium mb-2 text-gray-900 dark:text-white items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub URL
              </label>
              <input
                type="url"
                value={hero.social_links.github || ''}
                onChange={e => updateSocialLink('github', e.target.value)}
                placeholder="https://github.com/yourusername"
                className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition"
              />
            </div>
            <div>
              <label className="flex text-sm font-medium mb-2 text-gray-900 dark:text-white items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn URL
              </label>
              <input
                type="url"
                value={hero.social_links.linkedin || ''}
                onChange={e => updateSocialLink('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition"
              />
            </div>
            <div>
              <label className="flex text-sm font-medium mb-2 text-gray-900 dark:text-white items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </label>
              <input
                type="email"
                value={hero.social_links.email || ''}
                onChange={e => updateSocialLink('email', e.target.value)}
                placeholder="your.email@example.com"
                className="w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 transition"
              />
            </div>
          </div>
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