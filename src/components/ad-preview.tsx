'use client'

import React from 'react'
import { X } from 'lucide-react'

interface AdPreviewProps {
  ad: {
    title: string
    content: string
    imageUrl?: string
    linkUrl?: string
  }
  onClose: () => void
}

export function AdPreview({ ad, onClose }: AdPreviewProps) {
  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
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
            <h3 className="text-white font-semibold text-lg">Discord Advertisement Preview</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Discord-like chat area */}
        <div className="bg-[#36393f] p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 group hover:bg-[#32353b] p-2 rounded transition-colors">
              {/* Bot Avatar */}
              <div className="w-10 h-10 bg-[#5865f2] rounded-full flex items-center justify-center text-white font-bold text-sm mt-0.5">
                B
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Message header */}
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="font-medium text-sm text-white">
                    Server Ads
                  </span>
                  <span className="bg-[#5865f2] text-white text-xs px-1.5 py-0.5 rounded font-medium">
                    BOT
                  </span>
                  <span className="text-xs text-[#72767d] font-medium">
                    Today at {formatTime()}
                  </span>
                </div>
                
                {/* Embed preview */}
                <div className="bg-[#2f3136] border-l-4 border-[#5865f2] rounded p-4 max-w-md">
                  {/* Embed Title */}
                  <div className="text-white font-semibold text-base mb-2">
                    {ad.title}
                  </div>
                  
                  {/* Embed Description */}
                  {ad.content && (
                    <div className="text-[#dcddde] text-sm mb-3 leading-relaxed">
                      {ad.content}
                    </div>
                  )}
                  
                  {/* Embed Image */}
                  {ad.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={ad.imageUrl} 
                        alt="Advertisement" 
                        className="rounded max-w-full h-auto max-h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Embed URL */}
                  {ad.linkUrl && (
                    <div className="text-[#00b0f4] text-sm hover:underline cursor-pointer">
                      {ad.linkUrl}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with info */}
        <div className="bg-gray-800/30 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Title: <span className="text-blue-400">{ad.title}</span></span>
              {ad.imageUrl && <span>Image: <span className="text-green-400">Included</span></span>}
              {ad.linkUrl && <span>Link: <span className="text-purple-400">Included</span></span>}
            </div>
            <div className="text-xs">
              This is a preview of how your advertisement will appear in Discord
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdPreview