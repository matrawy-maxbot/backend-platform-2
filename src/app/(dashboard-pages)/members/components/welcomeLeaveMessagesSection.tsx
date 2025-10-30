'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge"
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare,
  UserPlus,
  UserMinus,
  Crown,
  Settings,
  Eye,
  FileText,
  Hash,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function WelcomeLeaveMessagesSection({ welcomeSettings, updateWelcomeSettings, textChannels, leaveSettings, updateLeaveSettings, hasUnsavedChanges, saveSettings, saving, lastSaved, autoRoleEnabled, setAutoRoleEnabled, selectedRole, setSelectedRole, availableRoles, getRoleColor, keywordSuggestions }) {
  return  (
    <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-green-400" />
                </div>
                <div>
                    <CardTitle className="text-white">Welcome & Leave Messages</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                    Configure automatic messages for member events
                    </CardDescription>
                </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Auto-Send</span>
                </div>
            </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-8">
            {/* Enhanced Messages Section */}
            <div className="space-y-12">
            <div className="relative group mb-8">
                <div className="absolute inset-0 "></div>
                {/* Welcome Message */}
                <div className="relative space-y-4 p-5 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-green-500/20 hover:border-green-400/30 transition-all duration-300 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                    <Label className="text-gray-200 flex items-center gap-3 font-medium">
                    <div className="p-1.5 bg-green-500/20 rounded-lg">
                        <UserPlus className="h-4 w-4 text-green-400" />
                    </div>
                    <span>Welcome Message</span>
                    </Label>
                    <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{welcomeSettings.enabled ? 'Active' : 'Disabled'}</span>
                    <Switch 
                        checked={welcomeSettings.enabled} 
                        onCheckedChange={(enabled) => updateWelcomeSettings({ enabled })}
                    />
                    </div>
                </div>
                {welcomeSettings.enabled && (
                    <div className="space-y-3">
                    <Textarea 
                        value={welcomeSettings.message}
                        onChange={(e) => updateWelcomeSettings({ message: e.target.value })}
                        className="bg-gray-900/50 border-gray-600 text-gray-300 min-h-[80px] transition-colors"
                        placeholder="Enter welcome message..."
                    />
                    
                    {/* Channel Selection */}
                    <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center gap-2 text-sm">
                        <Hash className="h-4 w-4 text-green-400" />
                        Welcome Channel
                        </Label>
                        <Select value={welcomeSettings.channel} onValueChange={(channel) => updateWelcomeSettings({ channel })}>
                        <SelectTrigger className="bg-gray-900/50 border-gray-600 text-gray-300">
                            <SelectValue placeholder="Select a channel for welcome messages" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                            {textChannels && textChannels.length > 0 ? (
                            textChannels.map(channel => (
                                <SelectItem 
                                key={channel.id} 
                                value={channel.id} 
                                className="text-white hover:bg-gray-700"
                                >
                                <div className="flex items-center gap-2">
                                    <Hash className="h-3 w-3 text-gray-400" />
                                    <span>{channel.name}</span>
                                    {channel.topic && (
                                    <span className="text-xs text-gray-500 ml-2">- {channel.topic}</span>
                                    )}
                                </div>
                                </SelectItem>
                            ))
                            ) : (
                            <SelectItem value="no-channels" disabled className="text-gray-400">
                                No channels available
                            </SelectItem>
                            )}
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-xs text-green-400 mb-1 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Preview:
                        </p>
                        <p className="text-sm text-gray-300">{welcomeSettings.message.replace('{user}', '@Ahmed Mohamed').replace('{server}', 'Awesome Server')}</p>
                    </div>
                    </div>
                )}
                </div>

                {/* Leave Message */}
                <div className="relative group  mt-8">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-xl transition-all duration-300"></div>
                <div className="relative space-y-4 p-5 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-red-500/20 hover:border-red-400/30 transition-all duration-300">
                    <div className="flex items-center justify-between">
                    <Label className="text-gray-200 flex items-center gap-3 font-medium">
                        <div className="p-1.5 bg-red-500/20 rounded-lg">
                        <UserMinus className="h-4 w-4 text-red-400" />
                        </div>
                        <span>Leave Message</span>
                    </Label>
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{leaveSettings.enabled ? 'Active' : 'Disabled'}</span>
                        <Switch 
                        checked={leaveSettings.enabled} 
                        onCheckedChange={(enabled) => updateLeaveSettings({ enabled })}
                        />
                    </div>
                    </div>
                {leaveSettings.enabled && (
                    <div className="space-y-3">
                    <Textarea 
                        value={leaveSettings.message}
                        onChange={(e) => updateLeaveSettings({ message: e.target.value })}
                        className="bg-gray-900/50 border-gray-600 text-gray-300 min-h-[80px] transition-colors"
                        placeholder="Enter leave message..."
                    />
                    
                    {/* Channel Selection */}
                    <div className="space-y-2">
                        <Label className="text-gray-300 flex items-center gap-2 text-sm">
                        <Hash className="h-4 w-4 text-red-400" />
                        Send to Channel
                        </Label>
                        <Select value={leaveSettings.channel} onValueChange={(channel) => updateLeaveSettings({ channel })}>
                        <SelectTrigger className="bg-gray-900/50 border-gray-600 text-gray-300">
                            <SelectValue placeholder="Select a channel" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                            {textChannels && textChannels.length > 0 ? (
                            textChannels.map((channel) => (
                                <SelectItem 
                                key={channel.id} 
                                value={channel.id}
                                className="text-gray-300 hover:bg-gray-700"
                                >
                                <div className="flex items-center gap-2">
                                    <Hash className="h-4 w-4 text-red-400" />
                                    <span>{channel.name}</span>
                                    {channel.topic && (
                                    <span className="text-xs text-gray-500 ml-2">- {channel.topic}</span>
                                    )}
                                </div>
                                </SelectItem>
                            ))
                            ) : (
                            <SelectItem value="no-channels" disabled className="text-gray-500">
                                No channels available
                            </SelectItem>
                            )}
                        </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-xs text-red-400 mb-1 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Preview:
                        </p>
                        <p className="text-sm text-gray-300">{leaveSettings.message.replace('{user}', 'Ahmed Mohamed')}</p>
                    </div>
                    </div>
                    )}
                </div>
                </div>
            </div>
            
            {/* Save Button */}
            {hasUnsavedChanges && (
            <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300">You have unsaved changes</span>
                </div>
                <Button 
                onClick={saveSettings}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                {saving ? (
                    <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                    </>
                ) : (
                    <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                    </>
                )}
                </Button>
            </div>
            )}
            
            {/* Success Message */}
            {lastSaved && !hasUnsavedChanges && (
            <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300">
                Settings saved successfully at {new Date(lastSaved).toLocaleTimeString()}
                </span>
            </div>
            )}

            <Separator className="bg-gray-700" />

            {/* Enhanced Auto Role Section */}
            <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 rounded-xl transition-all duration-300"></div>
            <div className="relative space-y-4 p-5 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:border-purple-400/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                <Label className="text-gray-200 flex items-center gap-3 font-medium">
                    <div className="p-1.5 bg-yellow-500/20 rounded-lg">
                    <Crown className="h-4 w-4 text-yellow-400" />
                    </div>
                    <span>Auto Role Assignment</span>
                </Label>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{autoRoleEnabled ? 'Active' : 'Disabled'}</span>
                    <Switch 
                    checked={autoRoleEnabled} 
                    onCheckedChange={setAutoRoleEnabled}
                    />
                </div>
                </div>
            {autoRoleEnabled && (
                <div className="space-y-3">
                <div>
                    <Label className="text-gray-300 flex items-center gap-2 mb-2">
                    <Settings className="h-3 w-3" />
                    Select Role
                    </Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="bg-gray-900/50 border-gray-600 text-gray-300 transition-colors">
                        <SelectValue placeholder="Choose default role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                        {availableRoles.map((role) => (
                        <SelectItem key={role.id} value={role.id} className="text-gray-300">
                            <div className="flex items-center gap-2">
                            <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: getRoleColor(role.color) }}
                            />
                            {role.name}
                            </div>
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                {selectedRole && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-400 mb-1 flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Selected Role:
                    </p>
                    <div className="flex items-center gap-2">
                        <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: getRoleColor(availableRoles.find(r => r.id === selectedRole)?.color || 0) }}
                        />
                        <span className="text-sm text-gray-300">
                        {availableRoles.find(r => r.id === selectedRole)?.name}
                        </span>
                    </div>
                    </div>
                )}
                </div>
                )}
            </div>
            </div>

            {/* Enhanced Keywords Section */}
            <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl transition-all duration-300"></div>
            <div className="relative space-y-4 p-5 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-blue-500/20 hover:border-blue-400/30 transition-all duration-300">
                <Label className="text-gray-200 flex items-center gap-3 font-medium">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-400" />
                </div>
                <span>Available Keywords for Messages</span>
                </Label>
            <div className="flex flex-wrap gap-2">
                {keywordSuggestions.map((keyword) => (
                    <Badge 
                    key={keyword} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-blue-500/20 border-blue-500/30 text-blue-300 transition-colors"
                    >
                    {keyword}
                    </Badge>
                ))}
                </div>
            </div>
            </div>
            </div>
        </CardContent>
    </Card>
  )
};