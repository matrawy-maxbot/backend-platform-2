"use client"

import { useAdminPermissions } from '@/hooks/useAdminPermissions'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle, LogIn, ArrowLeft } from 'lucide-react'
import { signIn } from 'next-auth/react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { canAccessProtectedPages, isOwner, isCurrentAdmin, isLoading: permissionsLoading } = useAdminPermissions()

  // If loading
  if (authLoading || permissionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // If not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="text-center space-y-6">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg mx-auto w-fit">
            <LogIn className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome to GeniusBot</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            You must log in with Discord to access this page
          </p>
          <Button 
            onClick={() => signIn('discord')}
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 text-lg font-semibold"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Login with Discord
          </Button>
        </div>
      </div>
    )
  }

  // If no access permissions
  if (!canAccessProtectedPages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        </div>
        
        <div className="relative z-10 max-w-lg mx-auto p-8">
          {/* Main card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Icon container with animation */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-full p-6 mx-auto w-fit">
                <Shield className="h-12 w-12 text-red-400 animate-bounce" />
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
              
              {/* Main info box */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-red-300 font-medium text-sm mb-2">Protected Area</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      This page is protected and can only be accessed by:
                    </p>
                    <ul className="text-gray-400 text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        Server owner
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                        Admins added to the current admins list
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Additional info for non-owners */}
              {!isOwner && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-300 text-sm text-left">
                      If you think this is an error, contact the server owner to add you as an admin.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Action button */}
              <Button 
                onClick={() => window.history.back()}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-500/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
          
          {/* Additional info */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Need assistance? Contact your server administrator
            </p>
          </div>
        </div>
      </div>
    )
  }

  // If has permissions, show content
  return <>{children}</>
}