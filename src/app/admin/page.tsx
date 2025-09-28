"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';

interface Stats { projects: number; skills: number; messages: number; pageViews: number; }

export default function AdminHome() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('=== AdminHome useEffect ===');
    console.log('ensureAuthedClient():', ensureAuthedClient());
    
    if (!ensureAuthedClient()) { 
      console.log('Not authenticated, redirecting to login');
      router.replace('/admin/login'); 
      return; 
    }
    
    console.log('User is authenticated, calling dashboard API');
    
    (async () => {
      try {
        console.log('Making dashboard API call...');
        const dash = await adminApi.dashboard();
        console.log('Dashboard API response:', dash);
        setStats(dash.stats);
        setRecentMessages(dash.recentMessages || []);
      } catch (e: any) {
        console.error('Dashboard API error:', e);
        if (e.status === 401) { 
          console.log('Got 401 error, redirecting to login');
          router.replace('/admin/login'); 
          return; 
        }
        setError(e.message || 'Failed to load dashboard');
      } finally { 
        console.log('Dashboard loading complete');
        setLoading(false); 
      }
    })();
  }, [router]);

  if (loading) return <div className="p-8 text-gray-600 dark:text-gray-400">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
        <button onClick={() => location.reload()} className="text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-md shadow-sm transition">Refresh</button>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Projects" value={stats?.projects ?? 0} color="blue" />
          <StatCard label="Skills" value={stats?.skills ?? 0} color="green" />
          <StatCard label="Messages" value={stats?.messages ?? 0} color="amber" />
          <StatCard label="Views" value={stats?.pageViews ?? 0} color="purple" />
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Messages</h2>
          <a href="/admin/messages" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition">View all</a>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentMessages.length === 0 && <li className="p-6 text-sm text-gray-500 dark:text-gray-400">No messages yet.</li>}
          {recentMessages.map(m => (
            <li key={m.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{m.name || 'Anonymous'} <span className="text-gray-400 dark:text-gray-500 font-normal">&lt;{m.email}&gt;</span></p>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">Subject: {m.subject || 'No subject'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1 max-w-xl">{m.message}</p>
              </div>
              <time className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    amber: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{label}</span>
      <span className={`text-4xl font-bold tracking-tight ${colorMap[color] || ''} inline-block px-2 rounded`}>{value}</span>
    </div>
  );
}
