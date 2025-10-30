"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, ExternalLink, Loader2, AlertTriangle, Play, Trophy, Clock } from "lucide-react"
import { toast } from "sonner"

interface FrivGameProps {
  gameUrl: string
  gameTitle: string
  onClose: () => void
  onGameEnd?: (score: number) => void
}

export default function FrivGame({ gameUrl, gameTitle, onClose, onGameEnd }: FrivGameProps) {
  const [gameStartTime] = useState(Date.now())
  const [isGameStarted, setIsGameStarted] = useState(false)

  const handlePlayGame = () => {
    // Open game in new tab
    const gameWindow = window.open(gameUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
    
    if (gameWindow) {
      setIsGameStarted(true)
      toast.success('تم فتح اللعبة في نافذة جديدة!')
      
      // Focus on the new window
      gameWindow.focus()
    } else {
      toast.error('تعذر فتح اللعبة. يرجى السماح بالنوافذ المنبثقة.')
    }
  }

  const handleGameComplete = () => {
    const playTime = Math.floor((Date.now() - gameStartTime) / 1000)
    const score = Math.max(10, Math.floor(playTime / 10)) // Score based on play time
    onGameEnd?.(score)
    toast.success(`تم إنهاء اللعبة! حصلت على ${score} نقطة`)
    onClose()
  }

  const openInNewTab = () => {
    handlePlayGame()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              {gameTitle}
              <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                Friv
              </Badge>
            </DialogTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              className="border-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              العودة
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Game Launch Section */}
          <div className="text-center py-8">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-8 mb-6">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-white mb-2">{gameTitle}</h3>
              <p className="text-gray-400 mb-6">استعد للعب أفضل الألعاب من Friv!</p>
              
              {!isGameStarted ? (
                <Button 
                  onClick={handlePlayGame}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  ابدأ اللعب الآن
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span>اللعبة مفتوحة في نافذة جديدة</span>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={handlePlayGame}
                      variant="outline"
                      className="border-purple-600 text-purple-400 hover:bg-purple-600/20"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      فتح مرة أخرى
                    </Button>
                    <Button 
                      onClick={handleGameComplete}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      إنهاء اللعبة
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Game Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <ExternalLink className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">نافذة جديدة</h4>
                <p className="text-sm text-gray-400">تفتح اللعبة في نافذة منفصلة</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">لعب فوري</h4>
                <p className="text-sm text-gray-400">بدء سريع بدون انتظار</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">اكسب نقاط</h4>
                <p className="text-sm text-gray-400">احصل على مكافآت عند الانتهاء</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Tips */}
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">نصائح للعب:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• تأكد من السماح بالنوافذ المنبثقة في متصفحك</li>
                  <li>• استخدم وضع ملء الشاشة للحصول على أفضل تجربة</li>
                  <li>• اضغط "إنهاء اللعبة" عند الانتهاء لكسب النقاط</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}