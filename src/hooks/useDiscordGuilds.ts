"use client"

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
  features: string[]
}

export function useDiscordGuilds() {
  const [guilds, setGuilds] = useState<DiscordGuild[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    const fetchGuilds = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/discord/bot-guilds')
        
        if (!response.ok) {
          throw new Error('Failed to fetch Discord servers')
        }
        
        const data = await response.json()
        setGuilds(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        console.error('Error fetching Discord guilds:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGuilds()
  }, [isAuthenticated])

  return {
    guilds,
    loading,
    error,
    refetch: () => {
      if (isAuthenticated) {
        const fetchGuilds = async () => {
          try {
            setLoading(true)
            setError(null)
            
            const response = await fetch('/api/discord/bot-guilds')
            
            if (!response.ok) {
              throw new Error('Failed to fetch Discord servers')
            }
            
            const data = await response.json()
            setGuilds(data || [])
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
            console.error('Error fetching Discord guilds:', err)
          } finally {
            setLoading(false)
          }
        }
        fetchGuilds()
      }
    }
  }
}