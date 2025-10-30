"use client"

import { useSession, signIn, signOut } from 'next-auth/react'

export function useAuth() {
  // استخدام NextAuth الحقيقي لجلب بيانات Discord
  const { data: session, status } = useSession()
  
  // استخراج بيانات Discord من الـ session
  const discordData = session?.user ? {
    id: session.user.discordId,
    username: session.user.username,
    discriminator: session.user.discriminator,
    avatar: session.user.avatar,
    verified: session.user.verified,
    avatarUrl: session.user.image || (session.user.discordId && session.user.avatar ? 
      `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png` : 
      '/defaults/avatar.svg')
  } : null
  
  return {
    session,
    status,
    user: session?.user,
    discordData,
    signIn,
    signOut,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated'
  }
}