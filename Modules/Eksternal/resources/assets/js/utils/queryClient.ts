import { QueryClient } from "@tanstack/react-query"

/**
 * Global TanStack Query Client Configuration
 * Providing smart background caching, auto refetch, and garbage collection.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes (zero refetch during page swaps)
      gcTime: 1000 * 60 * 15, // Garbage collection cache time (15 minutes)
      refetchOnWindowFocus: false, // Prevent distracting refetches on tab focus
      retry: 1, // Single retry on network failure before raising error
    },
    mutations: {
      retry: 0,
    },
  },
})

export default queryClient
