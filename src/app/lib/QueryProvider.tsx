'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

interface QueryProviderProps {
  children: ReactNode
}

/**
 * Custom retry delay with exponential backoff
 * Perfect for handling cold starts where the backend needs time to wake up
 */
function retryDelay(attemptIndex: number) {
  // Exponential backoff: 1s, 2s, 4s, 8s
  return Math.min(1000 * 2 ** attemptIndex, 8000)
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 3, // Increased from 1 to 3 for better resilience during cold starts
            retryDelay, // Use exponential backoff
            // Network mode to handle offline scenarios gracefully
            networkMode: 'online',
          },
          mutations: {
            retry: 2,
            retryDelay,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
