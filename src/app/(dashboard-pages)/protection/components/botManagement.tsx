"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"

import { 
  MessageSquare, 
  Bot,
} from "lucide-react"

export default function BotManagementTabsContent({ localProtectionSettings, updateProtectionSetting }) {
  return  (<TabsContent value="bot-management" className="space-y-6 mt-6 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-out">
    <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform animate-in fade-in-0 slide-in-from-left-8 duration-800 delay-200 ease-out">
    <CardHeader>
        <div className="flex items-center justify-between">
        <div>
            <CardTitle className="text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            Bot Management
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
            Control bot access to the server and enable protection against duplicate messages
            </CardDescription>
        </div>
        <Switch
            checked={localProtectionSettings.botManagement.enabled}
            onCheckedChange={(value) => updateProtectionSetting('botManagement', 'enabled', value)}
        />
        </div>
    </CardHeader>
    {localProtectionSettings.botManagement.enabled && (
        <CardContent className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
        <div className="space-y-4 pt-6 border-t border-[#2d3142]">
            <div className="flex items-center justify-between">
            <div>
                <Label className="text-white text-sm font-medium">Disallow the bots to enter server</Label>
                <p className="text-xs text-gray-400 mt-1">Prevent new bots from joining your server</p>
            </div>
            <Switch
                checked={localProtectionSettings.botManagement.disallowBots}
                onCheckedChange={(value) => updateProtectionSetting('botManagement', 'disallowBots', value)}
            />
            </div>
            
            <div className="flex items-center justify-between">
            <div>
                <Label className="text-white text-sm font-medium">Delete the repeated message</Label>
                <p className="text-xs text-gray-400 mt-1">Automatically remove duplicate messages</p>
            </div>
            <Switch
                checked={localProtectionSettings.botManagement.deleteRepeatedMessages}
                onCheckedChange={(value) => updateProtectionSetting('botManagement', 'deleteRepeatedMessages', value)}
            />
            </div>
        </div>
        </CardContent>
    )}
    </Card>

    {/* Anti-Spam Protection */}
    <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform animate-in fade-in-0 slide-in-from-right-8 duration-800 delay-400 ease-out">
    <CardHeader>
        <div className="flex items-center justify-between">
        <div>
            <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Anti-Spam Protection
            </CardTitle>
            <CardDescription className="text-gray-400 mt-2">
            Prevent repetitive messages and spam in the server
            </CardDescription>
        </div>
        <Switch
            id="anti-spam"
            checked={localProtectionSettings.antiSpam.enabled}
            onCheckedChange={(checked) => updateProtectionSetting('antiSpam', 'enabled', checked)}
        />
        </div>
    </CardHeader>
    <CardContent className="space-y-6">
        
        {localProtectionSettings.antiSpam.enabled && (
        <div className="space-y-6 pt-6 border-t border-gray-600 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-400">
            <div>
            <Label className="text-white mb-3 block">Message Limit per Minute</Label>
            <Slider
                value={[localProtectionSettings.antiSpam.maxMessages]}
                onValueChange={(value) => updateProtectionSetting('antiSpam', 'maxMessages', value[0])}
                max={20}
                min={1}
                step={1}
                className="w-full"
            />
            <p className="text-sm text-gray-400 mt-2">{localProtectionSettings.antiSpam.maxMessages} messages/minute</p>
            </div>
            
            <div>
            <Label className="text-white mb-3 block">Action on Violation</Label>
            <Select defaultValue="mute">
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="warn">Warning</SelectItem>
                <SelectItem value="mute">Mute</SelectItem>
                <SelectItem value="kick">Kick</SelectItem>
                <SelectItem value="ban">Ban</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>
        )}
    </CardContent>
    </Card>
</TabsContent>)
};