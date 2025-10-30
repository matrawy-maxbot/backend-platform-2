"use client"

import { useState, useEffect } from "react"

export function useAuthBypass() {
  console.log('🎯 useAuthBypass: Hook called!')
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔥 useAuthBypass: useEffect triggered!')
    const fetchSession = async () => {
      try {
        console.log('🔄 useAuthBypass: Starting fetch...')
        const response = await fetch('/api/auth/session-bypass')
        console.log('🔄 useAuthBypass: Response status:', response.status, response.ok)
        if (response.ok) {
          const sessionData = await response.json()
          console.log('🔍 useAuthBypass: Session data received:', sessionData)
          setSession(sessionData)
        } else {
          console.log('❌ useAuthBypass: Response not ok:', response.status)
        }
      } catch (error) {
        console.error('❌ useAuthBypass: Failed to fetch session:', error)
      } finally {
        setIsLoading(false)
        console.log('✅ useAuthBypass: Loading finished')
      }
    }

    fetchSession()
  }, [])

  return {
    user: session?.user,
    isLoading,
    isAuthenticated: !!session,
    session,
    // Discord specific data
    discordData: session?.user ? {
      id: session.user.discordId,
      username: session.user.username,
      discriminator: session.user.discriminator,
      avatar: session.user.avatar,
      verified: session.user.verified,
      avatarUrl: session.user.image || `https://cdn.discordapp.com/avatars/${session.user.discordId}/${session.user.avatar}.png`
    } : null,
    accessToken: session?.accessToken
  }
}