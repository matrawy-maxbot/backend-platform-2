'use client'

import React from 'react'
import { X, Bot, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface WelcomeDiscordPreviewProps {
  isOpen: boolean
  onClose: () => void
  backgroundSettings: {
    image: string
    opacity: number
    blur: number
    brightness: number
    contrast: number
    scale: number
    backgroundSize: string
    position: { x: number; y: number }
  }
  avatarSettings: {
    image: string
    size: number
    borderRadius: number
    borderWidth: number
    borderColor: string
    position: { x: number; y: number }
  }
  textSettings: {
    fontSize: number
    fontWeight: string
    color: string
    position: { x: number; y: number }
    textAlign: string
    fontFamily: string
    textShadow: boolean
    shadowColor: string
    shadowBlur: number
    shadowOffsetX: number
    shadowOffsetY: number
  }
  welcomeMessage: string
}

export function WelcomeDiscordPreview({ isOpen, onClose, backgroundSettings, avatarSettings, textSettings, welcomeMessage }: WelcomeDiscordPreviewProps) {
  if (!isOpen) return null
  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    })
  }

  const userName = "NewUser"
  const serverName = "Amazing Server"
  const memberCount = "1,234"

  // Replace placeholders in text
  const processText = (text: string) => {
    return text
      .replace(/{user}/g, userName)
      .replace(/{server}/g, serverName)
      .replace(/{memberCount}/g, memberCount)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-gray-700 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800/50 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="text-white font-semibold text-lg">معاينة رسالة الترحيب في الديسكورد</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Discord-like chat area */}
        <div className="bg-[#36393f] p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {/* Welcome Message */}
            <div className="flex items-start space-x-3 group hover:bg-[#32353b] p-2 rounded transition-colors">
              {/* Bot Avatar */}
              <Avatar className="w-10 h-10 mt-0.5">
                <AvatarFallback className="bg-[#5865f2] text-white text-sm">
                  <Bot className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                {/* Message header */}
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="font-medium text-sm text-white">
                    Welcome Bot
                  </span>
                  <Badge className="bg-[#5865f2] text-white text-xs px-1.5 py-0.5 rounded font-medium">
                    BOT
                  </Badge>
                  <span className="text-xs text-[#72767d] font-medium">
                    {formatTime()}
                  </span>
                </div>
                
                {/* Welcome Image Preview */}
                <div className="relative w-full max-w-md h-64 bg-gray-800 rounded-lg overflow-hidden border border-gray-600" style={{aspectRatio: '400/256'}}>
                  {/* Background */}
                  {backgroundSettings.image && (
                    <div 
                      className="absolute inset-0 z-10"
                      style={{
                        backgroundImage: `url(${backgroundSettings.image})`,
                        backgroundSize: backgroundSettings.backgroundSize,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: backgroundSettings.opacity / 100,
                        filter: `blur(${backgroundSettings.blur}px) brightness(${backgroundSettings.brightness}%) contrast(${backgroundSettings.contrast}%)`,
                        transform: `translate(${backgroundSettings.position.x}px, ${backgroundSettings.position.y}px) scale(${backgroundSettings.scale})`
                      }}
                    />
                  )}
                  
                  {/* Avatar */}
                  <div 
                    className="absolute z-20"
                    style={{
                      left: `calc(50% + ${avatarSettings.position.x}px)`,
                      top: `calc(30% + ${avatarSettings.position.y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {avatarSettings.image ? (
                      <img 
                        src={avatarSettings.image} 
                        alt="User Avatar" 
                        className="transition-all duration-200"
                        style={{
                          width: `${avatarSettings.size}px`,
                          height: `${avatarSettings.size}px`,
                          borderRadius: `${avatarSettings.borderRadius || 50}%`,
                          border: `${avatarSettings.borderWidth}px solid ${avatarSettings.borderColor}`
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-gray-600 flex items-center justify-center"
                        style={{
                          width: `${avatarSettings.size}px`,
                          height: `${avatarSettings.size}px`,
                          borderRadius: `${avatarSettings.borderRadius || 50}%`,
                          border: `${avatarSettings.borderWidth}px solid ${avatarSettings.borderColor}`
                        }}
                      >
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Welcome Text */}
                  <div 
                    className="absolute z-30"
                    style={{
                      left: `calc(50% + ${textSettings.position.x}px)`,
                      top: `calc(70% + ${textSettings.position.y}px)`,
                      transform: 'translate(-50%, -50%)',
                      textAlign: textSettings.textAlign as any
                    }}
                  >
                    <div 
                      style={{
                        fontSize: `${textSettings.fontSize}px`,
                        fontWeight: textSettings.fontWeight,
                        color: textSettings.color,
                        fontFamily: textSettings.fontFamily,
                        textShadow: textSettings.textShadow 
                          ? `${textSettings.shadowOffsetX}px ${textSettings.shadowOffsetY}px ${textSettings.shadowBlur}px ${textSettings.shadowColor}`
                          : 'none'
                      }}
                    >
                      <div className="font-bold">{processText(welcomeMessage)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Text message */}
                <div className="text-[#dcddde] text-sm leading-relaxed mt-2">
                  🎉 مرحباً <span className="text-blue-400 font-semibold">{userName}</span> في سيرفر <span className="text-green-400 font-semibold">{serverName}</span>!
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with info */}
        <div className="bg-gray-800/30 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>المستخدم: <span className="text-blue-400">{userName}</span></span>
              <span>السيرفر: <span className="text-green-400">{serverName}</span></span>
              <span>رقم العضو: <span className="text-yellow-400">#{memberCount}</span></span>
            </div>
            <div className="text-xs">
              هذه معاينة لكيفية ظهور رسالة الترحيب في الديسكورد
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeDiscordPreview