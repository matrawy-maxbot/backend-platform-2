"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"

import { 
  Settings, 
  Hash,
  Edit,
  Filter,
  Image,
  ChevronDown,
  ChevronUp,
  Bot,
  MessageSquare,
  FileText,
  Paperclip,
  Shield,
  ShieldCheck
} from "lucide-react"

export default function ChannelContentTabsContent({ localProtectionSettings, updateProtectionSetting, availableChannels }) {
  const [selectedChannel, setSelectedChannel] = React.useState(null)

  // Default permissions for all content types
  const defaultPermissions = {
    allowImages: true,
    allowTexts: true,
    allowFiles: true,
    allowBotCommands: true
  }

  const handleChannelSelect = (channelId) => {
    setSelectedChannel(selectedChannel === channelId ? null : channelId)
  }

  const updateChannelSetting = (channelId, setting, value) => {
    // Update the channel settings in the global protection settings
    const updatedChannelSettings = {
      ...localProtectionSettings.channels?.channelSettings,
      [channelId]: {
        ...defaultPermissions,
        ...localProtectionSettings.channels?.channelSettings?.[channelId],
        [setting]: value
      }
    }
    
    // Find channel name for logging
    const channelName = availableChannels?.find(ch => ch.id === channelId)?.name || `Channel ${channelId}`
    
    // Create a readable message for logging
    const settingLabel = {
      allowImages: 'Allow Images',
      allowTexts: 'Allow Text Messages', 
      allowFiles: 'Allow File Attachments',
      allowBotCommands: 'Allow Bot Commands'
    }[setting] || setting
    
    const actionText = value ? 'allowed' : 'blocked'
    const logMessage = `${settingLabel} ${actionText} in channel ${channelName}`
    
    updateProtectionSetting('channels', 'channelSettings', updatedChannelSettings, logMessage)
  }

  // Content type configurations
  const contentTypes = [
    {
      key: 'allowImages',
      label: 'Allow Images',
      description: 'Allow sending images in this channel',
      icon: Image,
      color: 'purple'
    },
    {
      key: 'allowTexts',
      label: 'Allow Text Messages',
      description: 'Allow sending text messages in this channel',
      icon: FileText,
      color: 'blue'
    },
    {
      key: 'allowFiles',
      label: 'Allow File Attachments',
      description: 'Allow sending file attachments in this channel',
      icon: Paperclip,
      color: 'green'
    },
    {
      key: 'allowBotCommands',
      label: 'Allow Bot Commands',
      description: 'Allow bots to execute commands in this channel',
      icon: Bot,
      color: 'orange'
    }
  ]
  return  (
    <TabsContent value="channels" className="space-y-6 mt-6 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-out">
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform animate-in fade-in-0 slide-in-from-left-8 duration-800 delay-200 ease-out">
            <CardHeader>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <CardTitle className="text-white flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-purple-400" />
                        Channels Content
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                        Configure channels content filtering rules and presets for your server
                    </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Switch
                    id="channels-content-protection-toggle"
                    checked={localProtectionSettings.channels?.enabled || false}
                    onCheckedChange={(checked) => updateProtectionSetting('channels', 'enabled', checked)}
                    className="data-[state=checked]:bg-purple-600"
                    />
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                    // Toggle collapse state - we'll use the enabled state to control visibility
                    if (localProtectionSettings.channels?.enabled) {
                        updateProtectionSetting('channels', 'enabled', false)
                    } else {
                        updateProtectionSetting('channels', 'enabled', true)
                    }
                    }}
                    className="text-gray-400 hover:text-white p-1"
                >
                    {localProtectionSettings.channels?.enabled ? (
                    <ChevronUp className="h-4 w-4" />
                    ) : (
                    <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
                </div>
            </div>
            </CardHeader>
            {localProtectionSettings.channels?.enabled && (
            <CardContent className="space-y-6">
              {/* Channel Message Control Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-white">Channel Content Permissions</h3>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                    4 Content Types
                  </Badge>
                </div>
                
                {/* Channels List */}
                <div className="space-y-3">
                  <div className="grid gap-2">
                    {availableChannels?.map((channel) => (
                      <div key={channel.id} className="space-y-2">
                        {/* Channel Button */}
                        <Button
                          variant="outline"
                          onClick={() => handleChannelSelect(channel.id)}
                          className={`w-full justify-between h-12 border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all duration-200 ${
                            selectedChannel === channel.id ? 'border-purple-500 bg-purple-500/10' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{channel.name}</span>
                          </div>
                          {selectedChannel === channel.id ? (
                            <ChevronUp className="h-4 w-4 text-purple-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        
                        {/* Dropdown Settings */}
                        {selectedChannel === channel.id && (
                          <div className="ml-4 p-4 border border-gray-700 rounded-lg bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm space-y-4 animate-in slide-in-from-top-2 duration-300 ease-out">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-gray-300">Content Type Permissions</span>
                            </div>
                            
                            {/* Dynamic Content Type Controls */}
                            {contentTypes.map((contentType, index) => {
                              const IconComponent = contentType.icon
                              const isEnabled = localProtectionSettings.channels?.channelSettings?.[channel.id]?.[contentType.key] ?? defaultPermissions[contentType.key]
                              
                              return (
                                <div 
                                  key={contentType.key} 
                                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200 animate-in fade-in-0 slide-in-from-left-4"
                                  style={{ animationDelay: `${index * 100}ms` }}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-${contentType.color}-500/20 border border-${contentType.color}-500/30`}>
                                      <IconComponent className={`h-4 w-4 text-${contentType.color}-400`} />
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-white cursor-pointer">{contentType.label}</Label>
                                      <p className="text-xs text-gray-400 mt-0.5">{contentType.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex bg-gray-900/50 rounded-lg p-1 border border-gray-700/50">
                                      <Button
                                        size="sm"
                                        variant={isEnabled ? "default" : "ghost"}
                                        onClick={() => updateChannelSetting(channel.id, contentType.key, true)}
                                        className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                          isEnabled 
                                            ? 'bg-emerald-500/80 hover:bg-emerald-600/80 text-white shadow-sm' 
                                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                                        }`}
                                      >
                                        <ShieldCheck className="h-3 w-3 mr-1" />
                                        Allow
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant={!isEnabled ? "default" : "ghost"}
                                        onClick={() => updateChannelSetting(channel.id, contentType.key, false)}
                                        className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                          !isEnabled 
                                            ? 'bg-rose-500/80 hover:bg-rose-600/80 text-white shadow-sm' 
                                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                                        }`}
                                      >
                                        <Shield className="h-3 w-3 mr-1" />
                                        Block
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            )}
        </Card>
    </TabsContent>
  )
};