"use client";
import React from 'react';
import { RequireAuth } from '@/components/admin/RequireAuth';

// Small client wrapper so the root layout can remain a Server Component and still guard children.
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
