import AuthShell from './AuthShell';
import '../globals.css';

export const metadata = {
  title: 'Portfolio Admin Dashboard',
  description: 'Admin panel for portfolio management',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthShell>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <a href="/admin" className="inline-flex items-center gap-2 group">
                  <img
                    src="/gslogo.png"
                    alt="GS"
                    className="h-8 w-8 rounded-md shadow-sm ring-1 ring-blue-800/40 group-hover:scale-105 transition"
                  />
                  <span className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Portfolio Admin</span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Admin Panel</span>
              </div>
            </div>
          </div>
        </nav>
        
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm min-h-screen">
            <nav className="mt-8">
              <div className="px-4 space-y-2">
                <a href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Dashboard
                </a>
                <a href="/admin/projects" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Projects
                </a>
                <a href="/admin/experiences" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Experience
                </a>
                <a href="/admin/skills" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Skills
                </a>
                <a href="/admin/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Messages
                </a>
                <a href="/admin/personal" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Personal Info
                </a>
                <a href="/admin/analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Analytics
                </a>
                <a href="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                  Settings
                </a>
              </div>
            </nav>
          </aside>
          
          {/* Main content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthShell>
  )
}
