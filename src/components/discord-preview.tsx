'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, User } from 'lucide-react'

interface DiscordMessage {
  id: string
  author: {
    name: string
    avatar?: string
    isBot?: boolean
  }
  content: string
  timestamp: Date
  isReply?: boolean
  replyTo?: {
    author: string
    content: string
  }
}

interface AutoReply {
  id: string
  name: string
  triggers: string[]
  responses: string[]
  enabled: boolean
  conditions: any[]
  channels: string[]
  roles: string[]
  cooldown: number
  usageCount: number
  lastUsed: string
}

interface DiscordPreviewProps {
  reply: AutoReply
  onClose: () => void
}

export function DiscordPreview({ reply, onClose }: DiscordPreviewProps) {
  const userMessage = reply.triggers[0] || "Hello"
  const botResponse = reply.responses[0] || "No response configured"
  const triggerKeyword = reply.triggers[0]
  const userName = "User"
  const userAvatar = undefined
  const messages: DiscordMessage[] = [
    {
      id: '1',
      author: {
        name: userName,
        avatar: userAvatar,
        isBot: false
      },
      content: userMessage,
      timestamp: new Date()
    },
    {
      id: '2',
      author: {
        name: 'Discord Bot',
        isBot: true
      },
      content: botResponse,
      timestamp: new Date(Date.now() + 1000),
      isReply: true,
      replyTo: {
        author: userName,
        content: userMessage.length > 50 ? userMessage.substring(0, 50) + '...' : userMessage
      }
    }
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-gray-700 rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800/50 border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="text-white font-semibold text-lg">Discord Preview - {reply.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Discord-like chat area */}
        <div className="bg-[#36393f] p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex items-start space-x-3 group hover:bg-[#32353b] p-2 rounded transition-colors">
                <Avatar className="w-10 h-10 mt-0.5">
                  <AvatarImage src={message.author.avatar} />
                  <AvatarFallback className={`text-white text-sm ${
                    message.author.isBot ? 'bg-[#5865f2]' : 'bg-[#747f8d]'
                  }`}>
                    {message.author.isBot ? (
                      <Bot className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  {/* Reply indicator */}
                  {message.isReply && message.replyTo && (
                    <div className="flex items-center space-x-2 mb-1 text-xs text-[#b9bbbe] hover:text-white transition-colors cursor-pointer">
                      <div className="w-6 h-4 flex items-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 8.26667V4L3 11L10 18V13.4C15 13.4 18.5 15.1333 20 18.8C19 14.6667 16 10.5333 10 8.26667Z"/>
                        </svg>
                      </div>
                      <span className="font-medium">{message.replyTo.author}</span>
                      <span className="text-[#72767d] truncate max-w-xs">{message.replyTo.content}</span>
                    </div>
                  )}
                  
                  {/* Message header */}
                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className={`font-medium text-sm ${
                      message.author.isBot ? 'text-white' : 'text-white'
                    }`}>
                      {message.author.name}
                    </span>
                    {message.author.isBot && (
                      <Badge className="bg-[#5865f2] text-white text-xs px-1.5 py-0.5 rounded font-medium">
                        BOT
                      </Badge>
                    )}
                    <span className="text-xs text-[#72767d] font-medium">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  {/* Message content */}
                  <div className="text-[#dcddde] text-sm leading-relaxed break-words">
                    {triggerKeyword && message.content.toLowerCase().includes(triggerKeyword.toLowerCase()) ? (
                      <span>
                        {message.content.split(new RegExp(`(${triggerKeyword})`, 'gi')).map((part, index) => 
                          part.toLowerCase() === triggerKeyword.toLowerCase() ? (
                            <span key={index} className="bg-yellow-400/20 text-yellow-300 px-1 rounded">
                              {part}
                            </span>
                          ) : (
                            <span key={index}>{part}</span>
                          )
                        )}
                      </span>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer with info */}
        <div className="bg-gray-800/30 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Trigger: <span className="text-blue-400">{reply.triggers.join(', ')}</span></span>
              <span>Channels: <span className="text-green-400">{reply.channels.length > 0 ? reply.channels.join(', ') : 'All Channels'}</span></span>
            </div>
            <div className="text-xs">
              This is a preview of how your auto-reply will appear in Discord
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscordPreview