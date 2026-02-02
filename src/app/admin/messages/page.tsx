"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, ensureAuthedClient } from '@/app/lib/admin/api';
import { useToast } from '../components/Toast';
import { useConfirm } from '../components/ConfirmModal';

interface Message { id: string; name: string; email: string; subject?: string; message: string; created_at: string; is_read?: boolean; status?: string; }

export default function MessagesPage() {
  const router = useRouter();
  const toast = useToast();
  const { confirm } = useConfirm();
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

  const unreadCount = messages.filter(m => !m.is_read && m.status !== 'read').length;

  const markRead = async (id: string) => {
    try { 
      await adminApi.messages.markRead(id); 
      load();
      toast.success('Marked as Read', 'Message has been marked as read');
    } catch (e) { 
      toast.error('Failed', 'Could not mark message as read');
    }
  };

  const deleteMessage = async (m: Message) => {
    const confirmed = await confirm({
      title: 'Delete Message?',
      message: `Are you sure you want to delete the message from "${m.name || 'Anonymous'}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });
    if (!confirmed) return;
    try { 
      await adminApi.messages.delete(m.id); 
      load();
      toast.success('Deleted!', 'Message deleted successfully');
    } catch (e: any) { 
      toast.error('Delete Failed', e.message || 'Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading messages...</p>
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
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Messages
            {unreadCount > 0 && (
              <span className="px-2.5 py-1 text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Contact form submissions from your portfolio</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {(['all', 'unread', 'read'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === f
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {visible.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No messages found</p>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'unread' ? 'All messages have been read' : filter === 'read' ? 'No read messages yet' : 'No messages have been received yet'}
            </p>
          </div>
        )}
        
        {visible.map(m => {
          const read = m.is_read || m.status === 'read';
          return (
            <div
              key={m.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden transition ${
                !read 
                  ? 'border-l-4 border-l-blue-500 border-gray-200 dark:border-gray-700' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${!read ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-600'}`}>
                        {(m.name || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{m.name || 'Anonymous'}</span>
                          {!read && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                              NEW
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{m.email}</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      {m.subject || 'No subject'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {m.message}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <time className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                      {new Date(m.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                    <div className="flex items-center gap-2">
                      {!read && (
                        <button
                          onClick={() => markRead(m.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                          title="Mark as read"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(m)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition"
                        title="Delete message"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
