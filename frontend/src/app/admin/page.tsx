'use client'

import { useState, useEffect } from 'react'

interface Analytics {
  totalViews: number
  projectClicks: number
  resumeDownloads: number
  recentActivity: any[]
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch analytics
        const analyticsRes = await fetch('/api/analytics')
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData.data)

        // Fetch recent messages
        const messagesRes = await fetch('/api/contact')
        const messagesData = await messagesRes.json()
        setMessages(messagesData.data?.slice(0, 5) || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics?.totalViews || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Project Clicks</h3>
          <p className="text-3xl font-bold text-green-600">{analytics?.projectClicks || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Resume Downloads</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics?.resumeDownloads || 0}</p>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
        </div>
        <div className="divide-y">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{message.name}</h4>
                    <p className="text-sm text-gray-600">{message.email}</p>
                    <p className="text-sm text-gray-800 mt-2">{message.subject}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No messages yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
