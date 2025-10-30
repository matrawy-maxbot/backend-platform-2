"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"

import { 
  Shield, 
  Ban, 
  Crown,
  UserX,
} from "lucide-react"

export default function ModerationControlsTabsContent({ localProtectionSettings, updateProtectionSetting }) {
  return  (<TabsContent value="moderation" className="space-y-6 mt-6 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-out">
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform animate-in fade-in-0 slide-in-from-left-8 duration-800 delay-200 ease-out">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Crown className="h-5 w-5 text-red-500" />
                    Moderation Controls
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-2">
                    Define ban and expulsion policies and limits to protect your server from violating members
                  </CardDescription>
                </div>
                <Switch
                  checked={localProtectionSettings.moderation.enabled}
                  onCheckedChange={(value) => updateProtectionSetting('moderation', 'enabled', value)}
                />
              </div>
            </CardHeader>
            {localProtectionSettings.moderation.enabled && (
              <CardContent className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
                <div className="space-y-6 pt-6 border-t border-gray-600">
                  <div>
                    <Label className="text-white mb-3 block">Maximum kick & ban</Label>
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
                      <span className="text-4xl font-bold text-white">{localProtectionSettings.moderation.maxKickBan}</span>
                    </div>
                    <Slider
                      value={[localProtectionSettings.moderation.maxKickBan]}
                    onValueChange={(value) => updateProtectionSetting('moderation', 'maxKickBan', value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full mt-4"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-200 mb-4 block text-sm font-medium tracking-wide">Select the member's punishment</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <Button
                        variant={localProtectionSettings.moderation.memberPunishment === 'kick' ? 'default' : 'outline'}
                        onClick={() => updateProtectionSetting('moderation', 'memberPunishment', 'kick')}
                        className={`relative overflow-hidden group transition-all duration-300 transform hover:scale-105 rounded-xl py-4 px-6 font-medium text-sm ${
                          localProtectionSettings.moderation.memberPunishment === 'kick' 
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25' 
                            : 'border-2 border-gray-600 text-gray-300 hover:border-orange-400 hover:text-orange-400 hover:bg-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <UserX className="h-4 w-4" />
                          <span>Kick</span>
                        </div>
                        {localProtectionSettings.moderation.memberPunishment === 'kick' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                        )}
                      </Button>
                      <Button
                        variant={localProtectionSettings.moderation.memberPunishment === 'remove roles' ? 'default' : 'outline'}
                        onClick={() => updateProtectionSetting('moderation', 'memberPunishment', 'remove roles')}
                        className={`relative overflow-hidden group transition-all duration-300 transform hover:scale-105 rounded-xl py-4 px-6 font-medium text-sm ${
                          localProtectionSettings.moderation.memberPunishment === 'remove roles' 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-yellow-500/25' 
                            : 'border-2 border-gray-600 text-gray-300 hover:border-yellow-400 hover:text-yellow-400 hover:bg-yellow-500/10 hover:shadow-lg hover:shadow-yellow-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span>Remove Roles</span>
                        </div>
                        {localProtectionSettings.moderation.memberPunishment === 'remove roles' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                        )}
                      </Button>
                      <Button
                        variant={localProtectionSettings.moderation.memberPunishment === 'ban' ? 'default' : 'outline'}
                        onClick={() => updateProtectionSetting('moderation', 'memberPunishment', 'ban')}
                        className={`relative overflow-hidden group transition-all duration-300 transform hover:scale-105 rounded-xl py-4 px-6 font-medium text-sm ${
                          localProtectionSettings.moderation.memberPunishment === 'ban' 
                            ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg shadow-red-600/25' 
                            : 'border-2 border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Ban className="h-4 w-4" />
                          <span>Ban</span>
                        </div>
                        {localProtectionSettings.moderation.memberPunishment === 'ban' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>)
};