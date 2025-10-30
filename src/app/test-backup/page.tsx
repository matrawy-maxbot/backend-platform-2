'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, Upload, Trash2, RefreshCw, Database, Users, Hash, Calendar } from 'lucide-react'

interface BackupInfo {
  exists: boolean
  channels: number
  roles: number
  settings: any
  createdAt?: string
  size?: number
  filename?: string
}

interface ServerStats {
  categories: number
  channels: number
  roles: number
  members: number
}

export default function TestBackupPage() {
  const [backupInfo, setBackupInfo] = useState<BackupInfo>({ 
    exists: false, 
    channels: 0, 
    roles: 0, 
    settings: null 
  })
  const [serverStats, setServerStats] = useState<ServerStats>({
    categories: 0,
    channels: 0,
    roles: 0,
    members: 0
  })
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock server data
  const selectedServer = {
    id: '423067123225722891',
    name: 'Test Server'
  }

  const fetchBackupInfo = useCallback(async () => {
    try {
      console.log('🔍 Fetching backup info for server:', selectedServer.id)
      
      const response = await fetch(`http://localhost:3001/api/info/${selectedServer.id}`, {
        headers: {
          'Authorization': 'Bearer dashboard-bot-secret-2024'
        }
      })

      if (response.ok) {
        const info = await response.json()
        console.log('📦 API Response - hasBackup:', info.hasBackup)
        console.log('📦 API Response - backup:', info.backup)
        console.log('📦 API Response - stats:', info.stats)
        
        const backupInfo = {
          exists: info.hasBackup,
          channels: info.stats?.channels || 0,
          roles: info.stats?.roles || 0,
          settings: info.backup?.settings || null,
          createdAt: info.backup?.createdAt,
          size: info.backup?.size,
          filename: info.backup?.filename
        }
        
        console.log('🎯 Setting backupInfo.exists to:', backupInfo.exists)
        setBackupInfo(backupInfo)
        console.log('✅ setBackupInfo called successfully')
        
        if (info.stats) {
          setServerStats({
            categories: info.stats.categories || 0,
            channels: info.stats.channels || 0,
            roles: info.stats.roles || 0,
            members: info.stats.memberCount || 0
          })
        }
      } else {
        console.error('❌ Failed to fetch backup info:', response.status, response.statusText)
        setBackupInfo({ exists: false, channels: 0, roles: 0, settings: null })
      }
    } catch (error) {
      console.error('❌ Error fetching backup info:', error)
      setBackupInfo({ exists: false, channels: 0, roles: 0, settings: null })
    } finally {
      setIsLoading(false)
    }
  }, [selectedServer.id])

  const createBackup = async () => {
    try {
      setIsBackingUp(true)
      console.log('🔄 Creating backup for server:', selectedServer.id)
      
      const response = await fetch(`http://localhost:3001/api/create/${selectedServer.id}`, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer dashboard-bot-secret-2024',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Backup created successfully:', result)
        
        // Refresh backup info
        await fetchBackupInfo()
        
        alert('Backup created successfully!')
      } else {
        console.error('❌ Failed to create backup:', response.status, response.statusText)
        alert('Failed to create backup')
      }
    } catch (error) {
      console.error('❌ Error creating backup:', error)
      alert('Error creating backup')
    } finally {
      setIsBackingUp(false)
    }
  }

  useEffect(() => {
    console.log('🚀 Component mounted, fetching backup info...')
    fetchBackupInfo()
  }, [fetchBackupInfo])

  useEffect(() => {
    console.log('📊 backupInfo state changed:', backupInfo)
    console.log('📊 backupInfo.exists:', backupInfo.exists)
  }, [backupInfo])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading backup information...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Test Backup Management</h1>
          <p className="text-muted-foreground mt-2">
            Testing backup functionality for {selectedServer.name}
          </p>
        </div>
        <Button onClick={fetchBackupInfo} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>Server ID: {selectedServer.id}</div>
            <div>Backup Exists: {backupInfo.exists ? 'Yes' : 'No'}</div>
            <div>Created At: {backupInfo.createdAt || 'N/A'}</div>
            <div>Filename: {backupInfo.filename || 'N/A'}</div>
            <div>Size: {backupInfo.size || 'N/A'} bytes</div>
          </div>
        </CardContent>
      </Card>

      {/* Current Backup Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Current Backup Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {backupInfo.exists && backupInfo.createdAt ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Backup Available
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Created {new Date(backupInfo.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{backupInfo.channels}</div>
                    <div className="text-xs text-muted-foreground">Channels</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{backupInfo.roles}</div>
                    <div className="text-xs text-muted-foreground">Roles</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">
                      {backupInfo.size ? `${Math.round(backupInfo.size / 1024)} KB` : 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">Size</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No backup available</h3>
              <p className="text-muted-foreground mb-4">
                Create your first backup to secure your server configuration.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={createBackup}
              disabled={isBackingUp}
              className="flex items-center gap-2"
            >
              {isBackingUp ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isBackingUp ? 'Creating...' : (backupInfo.exists ? 'Update Backup' : 'Create Backup')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}