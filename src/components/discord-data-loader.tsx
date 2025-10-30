'use client'

import React from 'react'
import { Loader2, Server, AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DiscordDataLoaderProps {
  loading: boolean
  error: string | null
  hasSelectedServer: boolean
  selectedServer?: {
    id: string
    name: string
    icon?: string
  } | null
  onRefresh?: () => void
  children: React.ReactNode
  showServerInfo?: boolean
}

export function DiscordDataLoader({
  loading,
  error,
  hasSelectedServer,
  selectedServer,
  onRefresh,
  children,
  showServerInfo = true
}: DiscordDataLoaderProps) {
  // If no server is selected
  if (!hasSelectedServer) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 bg-blue-500/20 rounded-full mb-4">
            <Server className="h-8 w-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No Server Selected
          </h3>
          <p className="text-gray-400 mb-4">
            Please select a server from the sidebar to view channels and roles
          </p>
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            Select Server to Continue
          </Badge>
        </CardContent>
      </Card>
    )
  }

  // If there's a loading error
  if (error) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 bg-red-500/20 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Data Loading Error
          </h3>
          <p className="text-gray-400 mb-4">
            {error}
          </p>
          {onRefresh && (
            <Button 
              onClick={onRefresh}
              variant="outline" 
              className="border-red-400 text-red-400 hover:bg-red-400/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // If loading is in progress
  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 bg-blue-500/20 rounded-full mb-4">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Loading Data...
          </h3>
          <p className="text-gray-400 mb-4">
            Fetching channels and roles from Discord
          </p>
          {showServerInfo && selectedServer && (
            <div className="flex items-center gap-2 mt-4">
              {selectedServer.icon && (
                <img 
                  src={`https://cdn.discordapp.com/icons/${selectedServer.id}/${selectedServer.icon}.png`}
                  alt={selectedServer.name}
                  className="w-6 h-6 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              )}
              <span className="text-sm text-gray-300">{selectedServer.name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // عرض المحتوى مع معلومات السيرفر
  return (
    <div className="space-y-4">
      {showServerInfo && selectedServer && (
        <Card className="bg-gray-900/30 border-gray-700/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {selectedServer.icon && (
                <img 
                  src={`https://cdn.discordapp.com/icons/${selectedServer.id}/${selectedServer.icon}.png`}
                  alt={selectedServer.name}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              )}
              <div>
                <h3 className="text-white font-medium">{selectedServer.name}</h3>
                <p className="text-sm text-gray-400">Data updated from Discord</p>
              </div>
            </div>
            {onRefresh && (
              <Button 
                onClick={onRefresh}
                variant="ghost" 
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      {children}
    </div>
  )
}

// Simple component to check loading state only
export function LoadingState({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}

// Component to display no data state
export function EmptyState({ 
  title, 
  description, 
  icon: Icon = Server 
}: { 
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 bg-gray-500/20 rounded-full mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}