"use client"

import { useAuth } from './useAuth'
import { useSelectedServer } from '@/contexts/selected-server-context'
import { useState, useEffect } from 'react'

interface AdminPermissions {
  isOwner: boolean
  isCurrentAdmin: boolean
  canAccessProtectedPages: boolean
  isLoading: boolean
}

const PROTECTED_PAGES = [
  '/protection',
  '/scan', 
  '/backup',
  '/admins'
]

export function useAdminPermissions(): AdminPermissions {
  const { discordData } = useAuth()
  const { selectedServer } = useSelectedServer()
  const [isCurrentAdmin, setIsCurrentAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // التحقق من كون المستخدم مالك السيرفر
  const isOwner = !!(selectedServer?.owner)

  // التحقق من كون المستخدم أدمن حالي
  useEffect(() => {
    const checkCurrentAdminStatus = async () => {
      // إذا لم تكن البيانات متوفرة بعد، انتظر قليلاً ثم أوقف التحميل
      if (!selectedServer?.id || !discordData?.id) {
        setIsCurrentAdmin(false)
        // إذا كانت البيانات null أو undefined بشكل نهائي، أوقف التحميل
        const timeout = setTimeout(() => {
          setIsLoading(false)
        }, 3000) // انتظار 3 ثوانٍ كحد أقصى
        
        return () => clearTimeout(timeout)
      }

      // إذا كان المستخدم مالك السيرفر، لا نحتاج للتحقق من API
      if (isOwner) {
        setIsCurrentAdmin(false) // المالك لا يحتاج لأن يكون أدمن
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`/api/servers/${selectedServer.id}/current-admins`)
        if (response.ok) {
          const currentAdmins = await response.json()
          const isAdmin = currentAdmins.some((admin: any) => admin.discordId === discordData.id)
          setIsCurrentAdmin(isAdmin)
        } else {
          console.warn('Failed to fetch admin status:', response.status)
          setIsCurrentAdmin(false)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsCurrentAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkCurrentAdminStatus()
  }, [selectedServer?.id, discordData?.id, isOwner])

  // ضمان إيقاف التحميل بعد فترة معقولة
  useEffect(() => {
    const maxLoadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Admin permissions check timed out, stopping loading state')
        setIsLoading(false)
      }
    }, 5000) // 5 ثوانٍ كحد أقصى للتحميل

    return () => clearTimeout(maxLoadingTimeout)
  }, [isLoading])

  // التحقق من إمكانية الوصول للصفحات المحمية
  const canAccessProtectedPages = isOwner || isCurrentAdmin

  return {
    isOwner,
    isCurrentAdmin,
    canAccessProtectedPages,
    isLoading
  }
}

export function isProtectedPage(pathname: string): boolean {
  return PROTECTED_PAGES.some(page => pathname.includes(page))
}