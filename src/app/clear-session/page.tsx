"use client"

import { useEffect, useState } from 'react'

export default function ClearSession() {
  const [status, setStatus] = useState<'clearing' | 'success' | 'error'>('clearing')

  useEffect(() => {
    const clearSession = async () => {
      try {
        // Clear session via API
        const response = await fetch('/api/auth/clear-session', {
          method: 'POST',
        })

        if (response.ok) {
          setStatus('success')
          // Clear localStorage and sessionStorage
          localStorage.clear()
          sessionStorage.clear()
          
          // Redirect after 2 seconds
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
        } else {
          setStatus('error')
        }
      } catch (error) {
        console.error('Clear session error:', error)
        setStatus('error')
      }
    }

    clearSession()
  }, [])

  const handleManualRedirect = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="w-full max-w-md mx-4 bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            {status === 'clearing' && (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
            {status === 'success' && (
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {status === 'clearing' && 'Clearing Session...'}
            {status === 'success' && 'Session Cleared!'}
            {status === 'error' && 'Error Occurred'}
          </h2>
          <p className="text-gray-300 mb-4">
            {status === 'clearing' && 'Please wait while we clear your session data...'}
            {status === 'success' && 'Your session has been cleared. Redirecting to home page...'}
            {status === 'error' && 'Failed to clear session. Please try again.'}
          </p>
          {(status === 'success' || status === 'error') && (
            <button 
              onClick={handleManualRedirect} 
              className={`w-full py-2 px-4 rounded-md font-medium ${
                status === 'error' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Go to Home Page
            </button>
          )}
        </div>
      </div>
    </div>
  )
}