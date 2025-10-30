"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"

import { 
  MessageSquare, 
  AlertTriangle, 
  Eye, 
  Plus,
  Trash2,
  UserX,
  Filter,
} from "lucide-react"

export default function BadWordsTabsContent({ localProtectionSettings, updateProtectionSetting, availableChannels, addBadWord, removeBadWord, newBadWord, setNewBadWord, handlePictureChannelToggle }) {
  return  (
    <TabsContent value="bad-words" className="space-y-6 mt-6 animate-in fade-in-0 slide-in-from-bottom-12 duration-1000 ease-out">
          <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform animate-in fade-in-0 slide-in-from-left-8 duration-800 delay-200 ease-out">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="h-5 w-5 text-yellow-500" />
                    Bad Words
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-2">
                    Add the bad words you want to block and choose the appropriate type of punishment when they are used
                  </CardDescription>
                </div>
                <Switch
                  checked={localProtectionSettings.badWords.enabled}
                  onCheckedChange={(checked) => updateProtectionSetting('badWords', 'enabled', checked)}
                />
              </div>
            </CardHeader>
            {localProtectionSettings.badWords.enabled && (
              <CardContent className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-300">
                <div className="space-y-6 pt-6 border-t border-gray-600">
                  {/* Bad Words List */}
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 min-h-[120px]">
                    <div className="flex flex-wrap gap-2">
                      {localProtectionSettings.badWords.words.map((word, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-red-500/20 text-red-400 border-red-500/30 flex items-center gap-2"
                        >
                          {word}
                          <button
                            onClick={() => removeBadWord(word)}
                            className="hover:text-red-300"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Add New Bad Word */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new bad word..."
                      value={newBadWord}
                      onChange={(e) => setNewBadWord(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      onKeyPress={(e) => e.key === 'Enter' && addBadWord()}
                    />
                    <Button
                      onClick={addBadWord}
                      className="relative overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 rounded-xl px-4 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                        <span className="hidden sm:inline">Add</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </div>
                  
                  {/* Punishment Selection */}
                  <div>
                    <Label className="text-gray-200 mb-3 block text-sm font-medium tracking-wide">Select the member's punishment</Label>
                    <div className="grid grid-cols-4 gap-3">
                      <Button
                        variant={localProtectionSettings.badWords.punishment === 'Warn message' ? 'default' : 'outline'}
                        onClick={() => updateProtectionSetting('badWords', 'punishment', 'Warn message')}
                        className={`relative overflow-hidden group transition-all duration-300 transform hover:scale-105 rounded-xl py-3 px-4 font-medium text-xs ${
                          localProtectionSettings.badWords.punishment === 'Warn message' 
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg shadow-yellow-500/25' 
                            : 'border-2 border-gray-600 text-gray-300 hover:border-yellow-400 hover:text-yellow-400 hover:bg-yellow-500/10 hover:shadow-lg hover:shadow-yellow-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Warn message</span>
                        </div>
                        {localProtectionSettings.badWords.punishment === 'Warn message' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                        )}
                      </Button>
                      <Button
                        variant={localProtectionSettings.badWords.punishment === 'none' ? 'default' : 'outline'}
                        onClick={() => updateProtectionSetting('badWords', 'punishment', 'none')}
                        className={`relative overflow-hidden group transition-all duration-300 transform hover:scale-105 rounded-xl py-3 px-4 font-medium text-xs ${
                          localProtectionSettings.badWords.punishment === 'none' 
                            ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg shadow-gray-500/25' 
                            : 'border-2 border-gray-600 text-gray-300 hover:border-gray-400 hover:text-gray-400 hover:bg-gray-500/10 hover:shadow-lg hover:shadow-gray-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>None</span>
                        </div>
                        {localProtectionSettings.badWords.punishment === 'none' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                        )}
                      </Button>
                      <Button
                        variant={localProtectionSettings.badWords.punishment === 'Mute chat' ? 'default' : 'outline'}
                        onClick={() => updateProtectionSetting('badWords', 'punishment', 'Mute chat')}
                        className={`relative overflow-hidden group transition-all duration-300 transform hover:scale-105 rounded-xl py-3 px-4 font-medium text-xs ${
                          localProtectionSettings.badWords.punishment === 'Mute chat' 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/25' 
                            : 'border-2 border-gray-600 text-gray-300 hover:border-purple-400 hover:text-purple-400 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>Mute chat</span>
                        </div>
                        {localProtectionSettings.badWords.punishment === 'Mute chat' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                        )}
                      </Button>
                      <Button
                        variant={localProtectionSettings.badWords.punishment === 'kick' ? 'default' : 'outline'}
                        onClick={() => updateProtectionSetting('badWords', 'punishment', 'kick')}
                        className={`relative overflow-hidden group transition-all duration-300 transform hover:scale-105 rounded-xl py-3 px-4 font-medium text-xs ${
                          localProtectionSettings.badWords.punishment === 'kick' 
                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25' 
                            : 'border-2 border-gray-600 text-gray-300 hover:border-red-400 hover:text-red-400 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <UserX className="h-3 w-3" />
                          <span>Kick</span>
                        </div>
                        {localProtectionSettings.badWords.punishment === 'kick' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>
  )
};