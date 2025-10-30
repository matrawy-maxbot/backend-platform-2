"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Trophy, Star, Clock, Target, Gamepad2, Users, Zap, Coins } from "lucide-react"
import SnakeGame from "./snake-game"
import TicTacToe from "./tic-tac-toe"
import MemoryGame from "./memory-game"
import PuzzleGame from "./puzzle-game"
import TypingSpeedGame from "./typing-speed-game"
import RockPaperScissors from "./rock-paper-scissors"
import ConnectFour from "./connect-four"
import FrivGame from "./friv-game"
import Game2048 from "./game-2048"
import { CoinProvider, CoinDisplay, CoinManagementPanel } from "./coin-system"
import { frivGames, getFrivGameById } from "./friv-games-data"

type GameType = 'snake' | 'tictactoe' | 'memory' | 'puzzle' | 'typing' | 'rps' | 'connect4' | '2048' | string | null

type GameStats = {
  gamesPlayed: number
  totalScore: number
  bestScore: number
  lastPlayed: string
}

type AllGameStats = {
  snake: GameStats
  tictactoe: GameStats
  memory: GameStats
  puzzle: GameStats
  typing: GameStats
  rps: GameStats
  connect4: GameStats
  '2048': GameStats
}

interface GameManagerProps {
  selectedGame: GameType
  onGameSelect: (game: GameType) => void
  onClose: () => void
  frivGameId?: string
}

const gameInfo = {
  snake: {
    title: "لعبة الثعبان",
    emoji: "🐍",
    description: "تحكم في الثعبان واجمع الطعام",
    difficulty: "متوسط",
    category: "أركيد",
    coinReward: 10
  },
  tictactoe: {
    title: "إكس أو (XO)",
    emoji: "⭕",
    description: "لعبة استراتيجية لاعبين",
    difficulty: "سهل",
    category: "استراتيجية",
    coinReward: 15
  },
  memory: {
    title: "لعبة الذاكرة",
    emoji: "🧠",
    description: "اختبر ذاكرتك وابحث عن الأزواج",
    difficulty: "متوسط",
    category: "ذكاء",
    coinReward: 20
  },
  puzzle: {
    title: "لعبة الألغاز",
    emoji: "🧩",
    description: "رتب الأرقام في المكان الصحيح",
    difficulty: "صعب",
    category: "ألغاز",
    coinReward: 25
  },
  typing: {
    title: "لعبة سرعة الكتابة",
    emoji: "⌨️",
    description: "اختبر سرعة ودقة الكتابة",
    difficulty: "متوسط",
    category: "مهارات",
    coinReward: 15
  },
  rps: {
    title: "حجر ورقة مقص",
    emoji: "✂️",
    description: "لعبة كلاسيكية ضد الكمبيوتر",
    difficulty: "سهل",
    category: "حظ",
    coinReward: 5
  },
  connect4: {
    title: "أربعة في خط",
    emoji: "🔴",
    description: "اربط أربع قطع في خط واحد",
    difficulty: "متوسط",
    category: "استراتيجية",
    coinReward: 20
  },
  '2048': {
    title: "لعبة 2048",
    emoji: "🔢",
    description: "ادمج البلاط للوصول إلى 2048",
    difficulty: "صعب",
    category: "ألغاز",
    coinReward: 25
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'سهل': return 'text-green-400 border-green-400'
    case 'متوسط': return 'text-yellow-400 border-yellow-400'
    case 'صعب': return 'text-red-400 border-red-400'
    default: return 'text-gray-400 border-gray-400'
  }
}

export default function GameManager({ selectedGame, onGameSelect, onClose }: GameManagerProps) {
  const [gameStats, setGameStats] = useState<AllGameStats>({
    snake: { gamesPlayed: 0, totalScore: 0, bestScore: 0, lastPlayed: '' },
    tictactoe: { gamesPlayed: 0, totalScore: 0, bestScore: 0, lastPlayed: '' },
    memory: { gamesPlayed: 0, totalScore: 0, bestScore: 0, lastPlayed: '' },
    puzzle: { gamesPlayed: 0, totalScore: 0, bestScore: 0, lastPlayed: '' },
    typing: { gamesPlayed: 0, totalScore: 0, bestScore: 0, lastPlayed: '' },
    rps: { gamesPlayed: 0, totalScore: 0, bestScore: 0, lastPlayed: '' },
    connect4: { gamesPlayed: 0, totalScore: 0, bestScore: 0, lastPlayed: '' },
    '2048': { gamesPlayed: 0, totalScore: 0, bestScore: 0, lastPlayed: '' }
  })

  const updateGameStats = (gameType: GameType, score: number) => {
    if (!gameType) return
    
    setGameStats(prev => ({
      ...prev,
      [gameType]: {
        ...prev[gameType],
        gamesPlayed: prev[gameType].gamesPlayed + 1,
        totalScore: prev[gameType].totalScore + score,
        bestScore: Math.max(prev[gameType].bestScore, score),
        lastPlayed: new Date().toLocaleDateString('ar-SA')
      }
    }))
  }

  const handleGameEnd = (gameType: GameType) => {
    return (score: number) => {
      updateGameStats(gameType, score)
    }
  }

  const renderGameComponent = () => {
    switch (selectedGame) {
      case 'snake':
        return <SnakeGame onGameEnd={handleGameEnd('snake')} />
      case 'tictactoe':
        return <TicTacToe onGameEnd={(winner, isDraw) => {
          const score = winner ? 100 : isDraw ? 50 : 0
          updateGameStats('tictactoe', score)
        }} />
      case 'memory':
        return <MemoryGame onGameEnd={(score) => updateGameStats('memory', score)} />
      case 'puzzle':
        return <PuzzleGame onGameEnd={(moves, time) => {
          const score = Math.max(0, 1000 - moves * 10 - time * 2)
          updateGameStats('puzzle', score)
        }} />
      case 'typing':
        return <TypingSpeedGame onGameEnd={(wpm, accuracy) => {
          const score = Math.round(wpm * accuracy / 100)
          updateGameStats('typing', score)
        }} />
      case 'rps':
        return <RockPaperScissors onGameEnd={(result) => {
          const score = result === 'win' ? 10 : result === 'draw' ? 5 : 0
          updateGameStats('rps', score)
        }} />
      case 'connect4':
        return <ConnectFour onGameEnd={(winner) => {
          const score = winner === 'player' ? 100 : 0
          updateGameStats('connect4', score)
        }} />
      case '2048':
        return <Game2048 onGameEnd={(score) => updateGameStats('2048', score)} />
      default:
        // Check if it's a Friv game
        if (typeof selectedGame === 'string' && selectedGame.startsWith('friv-')) {
          const frivGame = getFrivGameById(selectedGame)
          if (frivGame) {
            return (
              <FrivGame
                gameUrl={frivGame.url}
                gameTitle={frivGame.titleAr}
                onClose={() => onGameSelect(null)}
                onGameEnd={(score) => {
                  // For now, we'll just show a success message
                  // In the future, we could add Friv game stats
                  console.log(`Friv game completed with score: ${score}`)
                }}
              />
            )
          }
        }
        return null
    }
  }

  if (selectedGame) {
    // Check if it's a Friv game
    const isFrivGame = typeof selectedGame === 'string' && selectedGame.startsWith('friv-')
    const frivGame = isFrivGame ? getFrivGameById(selectedGame) : null
    
    return (
      <CoinProvider>
        <Dialog open={true} onOpenChange={() => onClose()}>
          <DialogContent className="max-w-6xl bg-gray-900 border-gray-800">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-white flex items-center gap-2">
                  {isFrivGame && frivGame ? (
                    <>
                      <span className="text-2xl">🎮</span>
                      {frivGame.titleAr}
                      <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                        Friv
                      </Badge>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">{gameInfo[selectedGame as keyof typeof gameInfo]?.emoji}</span>
                      {gameInfo[selectedGame as keyof typeof gameInfo]?.title}
                    </>
                  )}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <CoinDisplay />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onGameSelect(null)}
                    className="border-gray-600"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    العودة
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <div className="mt-4">
              {renderGameComponent()}
            </div>
          </DialogContent>
        </Dialog>
      </CoinProvider>
    )
  }

  return (
    <CoinProvider>
      <Dialog open={true} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-5xl bg-gray-900 border-gray-800">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-2xl">
                🎮 مركز الألعاب التفاعلية
              </DialogTitle>
              <CoinDisplay />
            </div>
          </DialogHeader>
        
        <div className="mt-6 space-y-6">
          {/* Coin Management Panel */}
          <CoinManagementPanel />
          
          <Separator className="bg-gray-700" />
          
          {/* Built-in Games Grid */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Gamepad2 className="h-5 w-5" />
              الألعاب المحلية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(gameInfo).map(([gameKey, info]) => {
                const stats = gameStats[gameKey as keyof AllGameStats]
                return (
                  <Card 
                    key={gameKey} 
                    className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer group"
                    onClick={() => onGameSelect(gameKey as GameType)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{info.emoji}</div>
                          <div>
                            <CardTitle className="text-white group-hover:text-purple-400 transition-colors">
                              {info.title}
                            </CardTitle>
                            <p className="text-gray-400 text-sm">{info.description}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant="outline" className={getDifficultyColor(info.difficulty)}>
                            {info.difficulty}
                          </Badge>
                          <p className="text-xs text-gray-500">{info.category}</p>
                          <div className="flex items-center gap-1 text-xs text-yellow-400">
                            <Coins className="h-3 w-3" />
                            {info.coinReward}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Game Stats */}
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-blue-500/10 rounded p-2">
                          <div className="text-blue-400 font-bold">{stats.gamesPlayed}</div>
                          <div className="text-gray-400">مرات اللعب</div>
                        </div>
                        <div className="bg-yellow-500/10 rounded p-2">
                          <div className="text-yellow-400 font-bold">{stats.bestScore}</div>
                          <div className="text-gray-400">أفضل نتيجة</div>
                        </div>
                        <div className="bg-green-500/10 rounded p-2">
                          <div className="text-green-400 font-bold">
                            {stats.gamesPlayed > 0 ? Math.round(stats.totalScore / stats.gamesPlayed) : 0}
                          </div>
                          <div className="text-gray-400">المتوسط</div>
                        </div>
                      </div>
                      
                      {stats.lastPlayed && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          آخر لعب: {stats.lastPlayed}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <Separator className="bg-gray-700" />

          {/* Friv Games Grid */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-xl">🎮</span>
              ألعاب Friv
              <Badge variant="outline" className="bg-blue-600/20 text-blue-400 border-blue-600/30">
                جديد
              </Badge>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {frivGames.map((game) => (
                <Card 
                  key={game.id} 
                  className="bg-gray-800/50 border-gray-700 hover:border-blue-600/50 transition-all duration-300 cursor-pointer group"
                  onClick={() => onGameSelect(game.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {game.titleAr.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-white group-hover:text-blue-400 transition-colors text-sm">
                            {game.titleAr}
                          </CardTitle>
                          <p className="text-gray-400 text-xs line-clamp-2">{game.description}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={getDifficultyColor(game.difficulty)}>
                        {game.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <Coins className="h-3 w-3" />
                        {game.coinReward}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{game.category}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        {game.rating}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Overall Stats */}
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                إحصائيات عامة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                  <div className="text-purple-400 font-bold text-xl">
                    {Object.values(gameStats).reduce((sum, stats) => sum + stats.gamesPlayed, 0)}
                  </div>
                  <div className="text-gray-400 text-sm">إجمالي الألعاب</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <div className="text-yellow-400 font-bold text-xl">
                    {Math.max(...Object.values(gameStats).map(stats => stats.bestScore))}
                  </div>
                  <div className="text-gray-400 text-sm">أعلى نتيجة</div>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="text-green-400 font-bold text-xl">
                    {Object.values(gameStats).reduce((sum, stats) => sum + stats.totalScore, 0)}
                  </div>
                  <div className="text-gray-400 text-sm">إجمالي النقاط</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="text-blue-400 font-bold text-xl">
                    {Object.keys(gameInfo).length + frivGames.length}
                  </div>
                  <div className="text-gray-400 text-sm">الألعاب المتاحة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
    </CoinProvider>
  )
}