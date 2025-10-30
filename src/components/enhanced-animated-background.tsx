"use client"

import React from 'react'

const EnhancedAnimatedBackground = () => {

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      
      {/* Animated Waves */}
      <div className="absolute inset-0">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
              <stop offset="50%" stopColor="rgba(147, 51, 234, 0.1)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.08)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.08)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0.08)" />
            </linearGradient>
            <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.06)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.06)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.06)" />
            </linearGradient>
          </defs>
          
          {/* Wave 1 */}
          <g className="animate-wave-slow">
            <path
              d="M-100,50 C-75,40 -50,60 -25,50 C-12.5,45 0,55 0,50 C25,40 50,60 75,50 C87.5,45 100,55 100,50 C125,40 150,60 175,50 C187.5,45 200,55 200,50 L200,100 L-100,100 Z"
              fill="url(#wave1)"
            />
          </g>
          
          {/* Wave 2 */}
          <g className="animate-wave-medium">
            <path
              d="M-100,60 C-70,50 -30,70 0,60 C30,50 70,70 100,60 C130,50 170,70 200,60 L200,100 L-100,100 Z"
              fill="url(#wave2)"
            />
          </g>
          
          {/* Wave 3 */}
          <g className="animate-wave-fast">
            <path
              d="M-100,70 C-80,65 -60,75 -40,70 C-20,65 0,75 0,70 C20,65 40,75 60,70 C80,65 100,75 100,70 C120,65 140,75 160,70 C180,65 200,75 200,70 L200,100 L-100,100 Z"
              fill="url(#wave3)"
            />
          </g>
        </svg>
      </div>



      {/* Particle Effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse-slow" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse-medium" />
        <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-pulse-fast" />
      </div>

      <style jsx>{`
        @keyframes wave-slow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes wave-medium {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes wave-fast {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes float-icon {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-5deg); }
        }
        
        @keyframes particle {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        
        .animate-wave-slow {
          animation: wave-slow 20s linear infinite;
        }
        
        .animate-wave-medium {
          animation: wave-medium 15s linear infinite;
        }
        
        .animate-wave-fast {
          animation: wave-fast 10s linear infinite;
        }
        
        .animate-float-icon {
          animation: float-icon 6s ease-in-out infinite;
        }
        
        .animate-particle {
          animation: particle 12s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-medium {
          animation: pulse-medium 3s ease-in-out infinite;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default EnhancedAnimatedBackground