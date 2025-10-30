"use client"

import { useState, useEffect } from 'react'
import { useSelectedServer } from '@/contexts/selected-server-context'

interface BackupFile {
  fileName: string
  createdAt: string
  size: number
  type: 'auto' | 'manual'
}

export function useAdminBackups() {
  const { selectedServer } = useSelectedServer()
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBackups = async () => {
    if (!selectedServer?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/servers/${selectedServer.id}/admin-backups`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch backups')
      }
      
      const data = await response.json()
      setBackups(data.backups || [])
    } catch (err) {
      console.error('Error fetching backups:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async () => {
    if (!selectedServer?.id) return false

    try {
      const response = await fetch(`/api/servers/${selectedServer.id}/admin-backups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create' })
      })

      if (!response.ok) {
        throw new Error('Failed to create backup')
      }

      await fetchBackups() // Refresh the list
      return true
    } catch (err) {
      console.error('Error creating backup:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }

  const restoreBackup = async (backupFileName: string) => {
    if (!selectedServer?.id) return false

    try {
      const response = await fetch(`/api/servers/${selectedServer.id}/admin-backups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'restore', backupFileName })
      })

      if (!response.ok) {
        throw new Error('Failed to restore backup')
      }

      return true
    } catch (err) {
      console.error('Error restoring backup:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }

  const cleanupOldBackups = async () => {
    if (!selectedServer?.id) return false

    try {
      const response = await fetch(`/api/servers/${selectedServer.id}/admin-backups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cleanup' })
      })

      if (!response.ok) {
        throw new Error('Failed to cleanup backups')
      }

      await fetchBackups() // Refresh the list
      return true
    } catch (err) {
      console.error('Error cleaning up backups:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }

  // Helper functions for formatting
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Calculate stats
  const stats = {
    totalBackups: backups.length,
    totalSize: backups.reduce((total, backup) => total + (backup.size || 0), 0),
    lastBackup: backups.length > 0 ? backups[0]?.createdAt : null,
    oldestBackup: backups.length > 0 ? backups[backups.length - 1]?.createdAt : null
  }

  useEffect(() => {
    fetchBackups()
  }, [selectedServer?.id])

  return {
    backups,
    stats,
    loading,
    error,
    createBackup,
    restoreBackup,
    cleanupOldBackups,
    formatDate,
    formatFileSize,
    refetch: fetchBackups
  }
}