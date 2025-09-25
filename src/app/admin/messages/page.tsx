"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';

interface Message { id: string; name: string; email: string; subject?: string; message: string; created_at: string; is_read?: boolean; status?: string; }

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const list = await adminApi.messages.list();
      setMessages(list);
    } catch (e: any) {
      if (e.status === 401) { router.replace('/admin/login'); return; }
      setError(e.message || 'Failed to fetch messages');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (!ensureAuthedClient()) { router.replace('/admin/login'); return; } load(); }, [router]);

  const visible = messages.filter(m => {
    if (filter === 'all') return true;
    const read = m.is_read || m.status === 'read';
    return filter === 'read' ? read : !read;
  });

  const markRead = async (id: string) => {
    try { await adminApi.messages.markRead(id); load(); } catch (e) { /* ignore */ }
  };

  if (loading) return <div className="p-8">Loading messages...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <div className="flex items-center gap-2">
          {(['all','unread','read'] as const).map(f => (
            <button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1.5 rounded-md text-sm font-medium border transition ${filter===f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}>{f[0].toUpperCase()+f.slice(1)}</button>
          ))}
        </div>
      </header>

      <ul className="space-y-4">
        {visible.length === 0 && <li className="text-sm text-gray-500">No messages found.</li>}
        {visible.map(m => {
          const read = m.is_read || m.status === 'read';
          return (
            <li key={m.id} className={`bg-white rounded-lg shadow border p-5 transition group ${!read ? 'ring-1 ring-amber-400' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-gray-900 truncate">{m.name || 'Anonymous'}</h2>
                    <span className="text-xs text-gray-500 break-all">{m.email}</span>
                    {!read && <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">NEW</span>}
                  </div>
                  <p className="text-sm text-blue-600 font-medium mt-2">Subject: {m.subject || 'No subject'}</p>
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap leading-relaxed">{m.message}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <time className="text-xs text-gray-400">{new Date(m.created_at).toLocaleString()}</time>
                  {!read && <button onClick={() => markRead(m.id)} className="text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded shadow">Mark as Read</button>}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
