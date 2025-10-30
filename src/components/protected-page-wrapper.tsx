"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminPermissions, isProtectedPage } from '@/hooks/useAdminPermissions'
import { useAuth } from '@/hooks/useAuth'
import { useSelectedServer } from '@/contexts/selected-server-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Shield, ArrowLeft, Loader2, Server } from 'lucide-react'
import { signIn } from 'next-auth/react'

interface ProtectedPageWrapperProps {
  children: React.ReactNode
}

export default function ProtectedPageWrapper({ children }: ProtectedPageWrapperProps) {
  const { isAuthenticated, discordData } = useAuth()
  const { canAccessProtectedPages, isLoading } = useAdminPermissions()
  const { selectedServer } = useSelectedServer()
  const pathname = usePathname()
  const router = useRouter()

  // Check if the page is protected
  const isPageProtected = isProtectedPage(pathname)

  // If the page is not protected, display content directly
  if (!isPageProtected) {
    return <>{children}</>
  }

  // If permission verification is loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-2">Verifying Permissions</h1>
          <p className="text-gray-400">Please wait...</p>
        </div>
      </div>
    )
  }

  // If the user is not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Login Required</h1>
          <p className="text-gray-400 mb-6">You must be logged in to access this page</p>
          <Button onClick={() => signIn('discord', { callbackUrl: window.location.href })} className="bg-blue-600 hover:bg-blue-700">
            Login with Discord
          </Button>
        </div>
      </div>
    )
  }

  // If no server is selected
  if (!selectedServer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-center">
          <Server className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">No Server Selected</h1>
          <p className="text-gray-400 mb-6">You must select a server to access this page</p>
          <Button onClick={() => router.push('/servers')} className="bg-blue-600 hover:bg-blue-700">
            Select Server
          </Button>
        </div>
      </div>
    )
  }

  // If they don't have access permission
  if (!canAccessProtectedPages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-red-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        </div>
        
        <div className="relative z-10 max-w-md mx-auto p-8">
          {/* Main card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Icon container with animation */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full p-6 mx-auto w-fit">
                <AlertTriangle className="h-12 w-12 text-red-400 animate-bounce" />
              </div>
            </div>
            
            {/* Content */}
            <div className="text-center space-y-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
                  Access Denied
                </h1>
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-4"></div>
              </div>
              
              {/* Info box */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-red-300 font-medium text-sm mb-1">Restricted Area</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      This page is restricted to administrators only. You must be the server owner or assigned as a current administrator to access it.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                
                <Button 
                  onClick={() => router.push('/servers')} 
                  variant="outline"
                  className="w-full border-white/20 text-gray-300 hover:bg-white/5 hover:text-white py-3 rounded-xl transition-all duration-300"
                >
                  <Server className="h-4 w-4 mr-2" />
                  Select Different Server
                </Button>
              </div>
            </div>
          </div>
          
          {/* Additional info */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Need help? Contact the server administrator
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If everything is correct, display the content
  return <>{children}</>
}