// hooks/useCurrentUser.ts
'use client'

import { useSession } from 'next-auth/react'

export interface CurrentUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
}

export function useCurrentUser(): CurrentUser | null {
  const { data: session } = useSession()

  if (!session?.user) {
    return null
  }

  return {
    id: session.user.id || '',
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null,
    role: (session.user as any).role || 'User',
  }
}