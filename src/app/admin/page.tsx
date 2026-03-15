"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';

interface Stats { projects: number; skills: number; certificates?: number; messages: number; pageViews: number; experiences?: number; }
interface WeeklyPoint { label: string; pageViews: number; messages: number }
interface DashboardCharts {
  projectsByCategory?: Record<string, number>
  skillsByCategory?: Record<string, number>
  weeklyTraffic?: WeeklyPoint[]
}
interface DashboardPayload {
  stats: Stats
  recentMessages?: any[]
  charts?: DashboardCharts
}

export default function AdminHome() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [charts, setCharts] = useState<DashboardCharts>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ensureAuthedClient()) { 
      router.replace('/admin/login'); 
      return; 
    }
    
    (async () => {
      try {
        const dash: DashboardPayload = await adminApi.dashboard();
        setStats(dash.stats);
        setRecentMessages(dash.recentMessages || []);
        setCharts(dash.charts || {});
      } catch (e: any) {
        console.error('Dashboard API error:', e);
        if (e.status === 401) { 
          router.replace('/admin/login'); 
          return; 
        }
        setError(e.message || 'Failed to load dashboard');
      }
    })();
  }, [router]);

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm border border-red-200 dark:border-red-800 flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Welcome to your portfolio admin panel</p>
        </div>
        <button 
          onClick={() => location.reload()} 
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-sm transition active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-6">
        <StatCard 
          label="Projects" 
          value={stats?.projects ?? 0} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
          color="blue"
          href="/admin/projects"
        />
        <StatCard 
          label="Skills" 
          value={stats?.skills ?? 0} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          color="green"
          href="/admin/skills"
        />
        <StatCard 
          label="Certificates" 
          value={stats?.certificates ?? 0} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.592 3.824 10.29 9 11.622C17.176 19.29 21 14.592 21 9c0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          color="orange"
          href="/admin/certificates"
        />
        <StatCard 
          label="Messages" 
          value={stats?.messages ?? 0} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          color="amber"
          href="/admin/messages"
        />
        <StatCard 
          label="Page Views" 
          value={stats?.pageViews ?? 0} 
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          color="purple"
        />
      </div>

      {/* Insights */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6m4 6V7m4 10V4M3 19h18" />
            </svg>
            Insights
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Live charts based on your dashboard data</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DistributionChart
              title="Projects by Category"
              data={charts.projectsByCategory || {}}
              emptyText="No project category data"
              gradientClass="from-blue-500 to-cyan-500"
            />
            <DistributionChart
              title="Skills by Category"
              data={charts.skillsByCategory || {}}
              emptyText="No skill category data"
              gradientClass="from-emerald-500 to-teal-500"
            />
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Last 7 Days Traffic</h3>
            <WeeklyTrafficChart points={charts.weeklyTraffic || []} />
          </div>
        </div>
      </section>

      {/* Recent Messages */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              Recent Messages
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latest contact form submissions</p>
          </div>
          <Link 
            href="/admin/messages" 
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition flex items-center gap-1"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentMessages.length === 0 && (
            <div className="p-8 text-center">
              <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
            </div>
          )}
          {recentMessages.map(m => (
            <div key={m.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 dark:text-white">{m.name || 'Anonymous'}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">&lt;{m.email}&gt;</span>
                    {(!m.is_read && m.status !== 'read') && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                    {m.subject || 'No subject'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">{m.message}</p>
                </div>
                <time className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {new Date(m.created_at).toLocaleDateString()}
                </time>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function DistributionChart({
  title,
  data,
  emptyText,
  gradientClass,
}: {
  title: string
  data: Record<string, number>
  emptyText: string
  gradientClass: string
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const max = entries[0]?.[1] || 1

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([label, value]) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                <span className="text-gray-700 dark:text-gray-300 truncate pr-2">{label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${gradientClass}`}
                  style={{ width: `${Math.max(8, (value / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function WeeklyTrafficChart({ points }: { points: WeeklyPoint[] }) {
  if (!points.length) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">No traffic data for the last 7 days.</p>
  }

  const max = Math.max(
    1,
    ...points.map(point => Math.max(point.pageViews, point.messages))
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2 sm:gap-3 items-end h-40">
        {points.map(point => (
          <div key={point.label} className="flex flex-col items-center gap-1">
            <div className="w-full h-28 sm:h-32 flex items-end justify-center gap-1">
              <div
                className="w-3 sm:w-4 rounded-t bg-blue-500/80"
                style={{ height: `${Math.max(2, (point.pageViews / max) * 100)}%` }}
                title={`Page views: ${point.pageViews}`}
              />
              <div
                className="w-3 sm:w-4 rounded-t bg-amber-500/80"
                style={{ height: `${Math.max(2, (point.messages / max) * 100)}%` }}
                title={`Messages: ${point.messages}`}
              />
            </div>
            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{point.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-blue-500/80" />Page Views</span>
        <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-amber-500/80" />Messages</span>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color, href }: { label: string; value: number; icon: React.ReactNode; color: string; href?: string }) {
  const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    blue: { 
      bg: 'bg-blue-50 dark:bg-blue-900/20', 
      text: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40'
    },
    green: { 
      bg: 'bg-green-50 dark:bg-green-900/20', 
      text: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/40'
    },
    amber: { 
      bg: 'bg-amber-50 dark:bg-amber-900/20', 
      text: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40'
    },
    purple: { 
      bg: 'bg-purple-50 dark:bg-purple-900/20', 
      text: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-100 dark:bg-orange-900/40'
    }
  };
  
  const colors = colorMap[color] || colorMap.blue;
  
  const content = (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 ${href ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition cursor-pointer active:scale-[0.98]' : ''}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{label}</p>
          <p className={`text-xl sm:text-3xl font-bold mt-0.5 sm:mt-1 ${colors.text}`}>{value.toLocaleString()}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${colors.iconBg} ${colors.text} flex-shrink-0`}>
          <div className="w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
