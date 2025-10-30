"use client"

import React, { useState, useEffect } from 'react'

const AnimatedBackground = () => {
  const [particles, setParticles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([])

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const newParticles = [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      
      {/* Animated Waves */}
      <div className="absolute inset-0">
        {/* Wave 1 */}
        <svg
          className="absolute bottom-0 left-0 w-full h-full opacity-10"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <path
            d="M0,400 C240,300 480,500 720,400 C960,300 1200,500 1440,400 L1440,800 L0,800 Z"
            fill="url(#wave1)"
            className="animate-wave-slow"
          />
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>

        {/* Wave 2 */}
        <svg
          className="absolute bottom-0 left-0 w-full h-full opacity-15"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <path
            d="M0,500 C360,400 720,600 1080,500 C1260,450 1350,550 1440,500 L1440,800 L0,800 Z"
            fill="url(#wave2)"
            className="animate-wave-medium"
          />
          <defs>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#EF4444" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Wave 3 */}
        <svg
          className="absolute bottom-0 left-0 w-full h-full opacity-10"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <path
            d="M0,600 C480,500 960,700 1440,600 L1440,800 L0,800 Z"
            fill="url(#wave3)"
            className="animate-wave-fast"
          />
          <defs>
            <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float-${i % 3 + 1}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slower" />
        <div className="absolute top-1/2 left-3/4 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-medium" />
      </div>
    </div>
  )
}

export default AnimatedBackground