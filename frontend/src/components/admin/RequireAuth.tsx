"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Simple JWT presence + expiry claim guard
// (Token currently doesn't expose exp in client decode unless we parse; implement lightweight parse)

function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<'checking' | 'authed' | 'redirecting'>('checking');

  useEffect(() => {
    console.log('RequireAuth: Checking authentication...', { pathname });
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    console.log('RequireAuth: Token found?', !!token);
    
    if (!token) {
      console.log('RequireAuth: No token, redirecting to login');
      setStatus('redirecting');
      router.replace('/admin/login?next=' + encodeURIComponent(pathname || '/admin'));
      return;
    }
    
    const decoded = parseJwt(token);
    const now = Math.floor(Date.now() / 1000);
    console.log('RequireAuth: Token decoded:', { decoded, now, expired: decoded?.exp ? decoded.exp < now : 'no exp' });
    
    if (!decoded || (decoded.exp && decoded.exp < now)) {
      console.log('RequireAuth: Invalid/expired token, clearing and redirecting');
      localStorage.removeItem('adminToken');
      setStatus('redirecting');
      router.replace('/admin/login?next=' + encodeURIComponent(pathname || '/admin'));
      return;
    }
    
    console.log('RequireAuth: Token valid, user authenticated');
    setStatus('authed');
  }, [router, pathname]);

  if (status === 'checking') {
    return <div className="p-8 text-sm text-gray-500">Authenticating...</div>;
  }
  if (status === 'redirecting') {
    return <div className="p-8 text-sm text-gray-500">Redirecting to login...</div>;
  }
  return <>{children}</>;
};
