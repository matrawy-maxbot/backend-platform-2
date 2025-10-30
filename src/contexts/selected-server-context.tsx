"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useDiscordGuilds } from '@/hooks/useDiscordGuilds'

interface Guild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  owner_id?: string
  permissions: string
  features: string[]
}

interface SelectedServerContextType {
  selectedServer: Guild | null
  setSelectedServer: (server: Guild | null) => void
  switchServer: (serverId: string) => void
  isLoading: boolean
}

const SelectedServerContext = createContext<SelectedServerContextType | undefined>(undefined)

export function SelectedServerProvider({ children }: { children: ReactNode }) {
  const [selectedServer, setSelectedServerState] = useState<Guild | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { guilds, loading } = useDiscordGuilds()

  // تحميل السيرفر المحفوظ من localStorage عند بدء التطبيق
  useEffect(() => {
    if (!loading && guilds.length > 0) {
      const savedServerId = localStorage.getItem('selectedServerId')
      
      if (savedServerId) {
        const savedServer = guilds.find(guild => guild.id === savedServerId)
        if (savedServer) {
          setSelectedServerState(savedServer)
        } else {
          // إذا لم يعد السيرفر المحفوظ موجوداً، اختر الأول
          setSelectedServerState(guilds[0])
          localStorage.setItem('selectedServerId', guilds[0].id)
        }
      } else {
        // إذا لم يكن هناك سيرفر محفوظ، اختر الأول
        setSelectedServerState(guilds[0])
        localStorage.setItem('selectedServerId', guilds[0].id)
      }
      
      setIsLoading(false)
    }
  }, [loading, guilds])

  // مراقبة تغييرات السيرفر المحدد عبر custom events
  useEffect(() => {
    const handleServerChange = (event: CustomEvent) => {
      if (!loading && guilds.length > 0) {
        const serverId = event.detail.serverId
        const server = guilds.find(guild => guild.id === serverId)
        if (server && server.id !== selectedServer?.id) {
          setSelectedServerState(server)
        }
      }
    }

    window.addEventListener('serverChanged', handleServerChange as EventListener)
    
    return () => {
      window.removeEventListener('serverChanged', handleServerChange as EventListener)
    }
  }, [guilds, loading, selectedServer])

  const setSelectedServer = (server: Guild | null) => {
    setSelectedServerState(server)
    if (server) {
      localStorage.setItem('selectedServerId', server.id)
      // إطلاق custom event لإعلام جميع المكونات بتغيير السيرفر
      window.dispatchEvent(new CustomEvent('serverChanged', {
        detail: { serverId: server.id }
      }))
    } else {
      localStorage.removeItem('selectedServerId')
    }
  }

  const switchServer = (serverId: string) => {
    const server = guilds.find(guild => guild.id === serverId)
    if (server) {
      setSelectedServer(server)
      // إطلاق custom event لإعلام جميع المكونات بتغيير السيرفر
      window.dispatchEvent(new CustomEvent('serverChanged', {
        detail: { serverId: server.id }
      }))
    }
  }

  return (
    <SelectedServerContext.Provider value={{
      selectedServer,
      setSelectedServer,
      switchServer,
      isLoading: isLoading || loading
    }}>
      {children}
    </SelectedServerContext.Provider>
  )
}

export function useSelectedServer() {
  const context = useContext(SelectedServerContext)
  if (context === undefined) {
    throw new Error('useSelectedServer must be used within a SelectedServerProvider')
  }
  return context
}