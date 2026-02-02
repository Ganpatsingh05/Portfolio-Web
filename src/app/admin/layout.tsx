"use client";

import AuthShell from "./AuthShell";
import { AdminThemeProvider, useAdminTheme, AdminThemeScript } from "./ThemeProvider";
import { ToastProvider } from "./components/Toast";
import { ConfirmProvider } from "./components/ConfirmModal";
import "../globals.css";
import { usePathname } from "next/navigation";

import { useEffect, useState, useLayoutEffect } from 'react';
import { config } from '@/lib/config';

// Use layout effect on client to apply theme before paint
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function AdminHeader() {
  const { theme, resolvedTheme, toggleTheme } = useAdminTheme();
  const [isOnline, setIsOnline] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const res = await fetch(`${config.api.baseUrl}/health`, { 
          method: 'GET',
          cache: 'no-store'
        });
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };
    
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/admin" className="inline-flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <img
                  src="/gslogo.png"
                  alt="GS"
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg shadow-md ring-2 ring-blue-100 dark:ring-blue-800 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 group-hover:scale-105 transition-all duration-200"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-200">
                  Admin
                </span>
                <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Content Management
                </span>
              </div>
            </a>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Status indicator */}
            <div className="flex items-center space-x-1.5">
              <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className={`hidden sm:inline text-sm font-medium ${isOnline ? 'text-gray-600 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="inline-flex items-center p-2 sm:px-3 sm:py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              title={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
            >
              {resolvedTheme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            
            {/* Logout - Desktop */}
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
              }}
              className="hidden sm:inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
            
            {/* Logout - Mobile icon only */}
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                window.location.href = '/admin/login';
              }}
              className="sm:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Navigation items for reuse
const navItems = [
  { href: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/projects', icon: 'projects', label: 'Projects' },
  { href: '/admin/experiences', icon: 'experience', label: 'Experience' },
  { href: '/admin/skills', icon: 'skills', label: 'Skills' },
  { href: '/admin/messages', icon: 'messages', label: 'Messages' },
  { href: '/admin/personal', icon: 'personal', label: 'Personal' },
  { href: '/admin/hero', icon: 'hero', label: 'Hero' },
  { href: '/admin/settings', icon: 'settings', label: 'Settings' },
];

const getIcon = (icon: string, className: string = "w-5 h-5") => {
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    ),
    projects: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    experience: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
      </svg>
    ),
    skills: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    messages: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    personal: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    hero: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };
  return icons[icon] || icons.dashboard;
};

function AdminSidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="hidden md:block sticky top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-56 lg:w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <nav className="mt-4 pb-4">
        <div className="px-3">
          <div className="space-y-1">
            {navItems.slice(0, 7).map((item) => {
              const isActive = pathname === item.href;
              return (
                <a 
                  key={item.href}
                  href={item.href} 
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-400'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                    {getIcon(item.icon)}
                  </span>
                  {item.label}
                </a>
              );
            })}
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
            
            {navItems.slice(7).map((item) => {
              const isActive = pathname === item.href;
              return (
                <a 
                  key={item.href}
                  href={item.href} 
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-400'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                    {getIcon(item.icon)}
                  </span>
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}

// Mobile bottom navigation
function MobileBottomNav() {
  const pathname = usePathname();
  const mobileNavItems = [
    navItems[0], // Dashboard
    navItems[1], // Projects
    navItems[4], // Messages
    navItems[7], // Settings
  ];
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {getIcon(item.icon, "w-6 h-6")}
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </a>
          );
        })}
        
        {/* More menu */}
        <div className="relative flex flex-col items-center justify-center flex-1 h-full py-2">
          <button 
            onClick={() => {
              const menu = document.getElementById('mobile-more-menu');
              menu?.classList.toggle('hidden');
            }}
            className="flex flex-col items-center text-gray-500 dark:text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[10px] mt-1 font-medium">More</span>
          </button>
          
          {/* Dropdown menu */}
          <div 
            id="mobile-more-menu" 
            className="hidden absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {navItems.filter(item => !mobileNavItems.includes(item)).map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{getIcon(item.icon, "w-5 h-5")}</span>
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useAdminTheme();
  
  // Apply theme on every render to ensure it stays in sync during navigation
  useIsomorphicLayoutEffect(() => {
    const storedTheme = localStorage.getItem('admin-theme') || 'light';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const resolved = storedTheme === 'system' ? systemTheme : storedTheme;
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-auto min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminThemeProvider>
      <ToastProvider>
        <ConfirmProvider>
          <AuthShell>
            <AdminLayoutContent>{children}</AdminLayoutContent>
          </AuthShell>
        </ConfirmProvider>
      </ToastProvider>
    </AdminThemeProvider>
  );
}
