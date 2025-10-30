"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"

import { 
  Shield, 
  Ban, 
  Hash,
  Link,
  Plus,
  Trash2,
  UserX,
} from "lucide-react"

export default function LinksTabsContent({ localProtectionSettings, updateProtectionSetting, availableChannels, addBlockedLink, removeBlockedLink, updateBlockedLinkContent, updateBlockedLinkAction, toggleChannelForBlockedLink }) {
  return  (
    <TabsContent value="links" className="space-y-6 mt-6 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-out">
        <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform animate-in fade-in-0 slide-in-from-left-8 duration-800 delay-200 ease-out">
            <CardHeader>
                <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-white flex items-center gap-2">
                    <Link className="h-5 w-5 text-green-500" />
                    Links
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2">
                    Specify the policy of allowed or blocked links on the server
                    </CardDescription>
                </div>
                <Switch
                    checked={localProtectionSettings.links.enabled}
                    onCheckedChange={(checked) => updateProtectionSetting('links', 'enabled', checked)}
                />
                </div>
            </CardHeader>
            {localProtectionSettings.links.enabled && (
                <CardContent className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
                <div className="space-y-6 pt-6 border-t border-gray-600">
                    {/* Discord Invites */}
                    <div className="flex items-center justify-between">
                    <div>
                        <Label className="text-white text-sm font-medium">Block Discord server invites</Label>
                        <p className="text-xs text-gray-400 mt-1">Block members from sharing Discord server invitations</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-red-400 text-sm">✗</span>
                        <Switch
                        checked={localProtectionSettings.links.allowDiscordInvites}
                        onCheckedChange={(checked) => updateProtectionSetting('links', 'allowDiscordInvites', checked)}
                        />
                        <span className="text-green-400 text-sm">✓</span>
                    </div>
                    </div>
                    
                    {/* Blocked Links/Keywords Management */}
                    <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                        <Label className="text-white text-sm font-medium">Blocked Links & Keywords</Label>
                        <p className="text-xs text-gray-400 mt-1">Add specific links or keywords that will trigger automatic moderation</p>
                        </div>
                        <Button
                        onClick={addBlockedLink}
                        size="sm"
                        className="relative overflow-hidden group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25 transition-all duration-300 transform hover:scale-105 rounded-xl px-3 py-2"
                        >
                        <div className="flex items-center gap-1">
                            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                            <span className="text-xs font-medium">Add Rule</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Button>
                    </div>
                    
                    <div className="space-y-4">
                        {localProtectionSettings.links.blockedLinks.map((rule, index) => (
                        <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                            <div className="space-y-4">
                            {/* Link/Keyword Input */}
                            <div>
                                <Label className="text-white text-xs mb-2 block">Link or Keyword</Label>
                                <Input
                                value={rule.content}
                                onChange={(e) => updateBlockedLinkContent(index, 'content', e.target.value)}
                                className="bg-gray-900 border-gray-600 text-white"
                                placeholder="e.g., youtube.com, discord.gg, or any keyword"
                                />
                            </div>
                            
                            {/* Action Selection */}
                            <div>
                                <Label className="text-white text-xs mb-3 block">إجراء عند الاكتشاف / Action when detected</Label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <Button
                                    size="sm"
                                    onClick={() => updateBlockedLinkAction(index, 'allow')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                    rule.action === 'allow'
                                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/25'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-green-500/30 hover:border-green-500/50'
                                    }`}
                                >
                                    <Shield className="h-3 w-3" />
                                    <span>Allow</span>
                                </Button>
                                
                                <Button
                                    size="sm"
                                    onClick={() => updateBlockedLinkAction(index, 'delete')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                    rule.action === 'delete'
                                        ? 'bg-yellow-600 text-white hover:bg-yellow-700 shadow-lg shadow-yellow-500/25'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-yellow-500/30 hover:border-yellow-500/50'
                                    }`}
                                >
                                    <Trash2 className="h-3 w-3" />
                                    <span>Delete</span>
                                </Button>
                                
                                <Button
                                    size="sm"
                                    onClick={() => updateBlockedLinkAction(index, 'kick')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                    rule.action === 'kick'
                                        ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-500/25'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-orange-500/30 hover:border-orange-500/50'
                                    }`}
                                >
                                    <UserX className="h-3 w-3" />
                                    <span>Kick</span>
                                </Button>
                                
                                <Button
                                    size="sm"
                                    onClick={() => updateBlockedLinkAction(index, 'ban')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                        rule.action === 'ban'
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/25'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-red-500/30 hover:border-red-500/50'
                                    }`}
                                    >
                                    <Ban className="h-3 w-3" />
                                    <span>Ban</span>
                                    </Button>
                                </div>
                                
                                {/* Action Description */}
                                <div className="mt-2 p-2 bg-gray-900/50 rounded-md border border-gray-700">
                                    <p className="text-xs text-gray-400">
                                    {rule.action === 'allow' && '✅ This link/keyword will be allowed only in selected channels'}
                                    {rule.action === 'delete' && '🗑️ Messages containing this link/keyword will be deleted only in selected channels'}
                                    {rule.action === 'kick' && '👢 Members posting this link/keyword will be kicked only if posted in selected channels'}
                                    {rule.action === 'ban' && '🔨 Members posting this link/keyword will be banned only if posted in selected channels'}
                                    </p>
                                </div>
                                </div>
                            
                            {/* Channels Selection - Now shown for all actions */}
                            <div>
                                <div>
                                <Label className="text-white text-xs mb-2 block">Select Channels</Label>
                                <div className="relative">
                                    <Select
                                    value=""
                                    onValueChange={(value) => {
                                        if (value === "all") {
                                        const updated = [...localProtectionSettings.links.blockedLinks]
                                        updated[index].channels = []
                                        updateProtectionSetting('links', 'blockedLinks', updated)
                                        } else if (value !== "") {
                                        toggleChannelForBlockedLink(index, value)
                                        }
                                    }}
                                    open={undefined}
                                    >
                                    <SelectTrigger className="bg-gray-900 border-gray-600 text-white">
                                        <SelectValue placeholder="Choose channels or leave empty for all channels" />
                                    </SelectTrigger>
                                    <SelectContent 
                                        className="bg-gray-900 border-gray-600 max-h-60 overflow-y-auto"
                                        onCloseAutoFocus={(e) => e.preventDefault()}
                                    >
                                        <SelectItem value="all" className="text-white hover:bg-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-3 w-3" />
                                            All Channels
                                        </div>
                                        </SelectItem>
                                        {availableChannels.map(channel => (
                                        <SelectItem 
                                            key={channel.id} 
                                            value={channel.id} 
                                            className="text-white hover:bg-gray-700 cursor-pointer"
                                            onSelect={(e) => {
                                            e.preventDefault()
                                            toggleChannelForBlockedLink(index, channel.id)
                                            }}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-2">
                                                <Hash className="h-3 w-3" />
                                                {channel.name}
                                            </div>
                                            {rule.channels.includes(channel.id) && (
                                                <span className="text-blue-400 text-sm font-bold">✓</span>
                                            )}
                                            </div>
                                        </SelectItem>
                                        ))}
                                        <div className="p-2 border-t border-gray-600 mt-2">
                                        <p className="text-xs text-gray-400 text-center">
                                            Click outside to close
                                        </p>
                                        </div>
                                    </SelectContent>
                                    </Select>
                                </div>
                                
                                {/* Selected Channels Display */}
                                {rule.channels.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                    {rule.channels.map(channelId => {
                                        const channel = availableChannels.find(ch => ch.id === channelId)
                                        return channel ? (
                                        <Badge 
                                            key={channelId} 
                                            variant="secondary" 
                                            className="bg-blue-600/20 text-blue-300 border-blue-500/30 text-xs flex items-center gap-1"
                                        >
                                            {channel.name}
                                            <button
                                            onClick={() => toggleChannelForBlockedLink(index, channelId)}
                                            className="ml-1 hover:text-red-400 transition-colors"
                                            >
                                            ×
                                            </button>
                                        </Badge>
                                        ) : null
                                    })}
                                    </div>
                                )}
                                
                                <p className="text-xs text-gray-400 mt-2">
                                    {rule.channels.length === 0 
                                    ? "Rule will apply to all channels" 
                                    : `Rule applies to ${rule.channels.length} selected channel(s)`
                                    }
                                </p>
                                </div>
                            </div>
                            
                            {/* Remove Button */}
                            <div className="flex justify-end">
                                <Button
                                size="sm"
                                onClick={() => removeBlockedLink(index)}
                                className="relative overflow-hidden group bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg shadow-gray-500/25 transition-all duration-300 transform hover:scale-105 rounded-lg"
                                >
                                <div className="flex items-center gap-1">
                                    <Trash2 className="h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
                                    <span className="text-xs">Remove</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </Button>
                            </div>
                            </div>
                        </div>
                        ))}
                        
                        {localProtectionSettings.links.blockedLinks.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <Link className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No blocked links or keywords added yet</p>
                            <p className="text-xs mt-1">Click "Add Rule" to start protecting your server</p>
                        </div>
                        )}
                    </div>
                    </div>
                </div>
                </CardContent>
            )}
        </Card>
    </TabsContent>
  )
};