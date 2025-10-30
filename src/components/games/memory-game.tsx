"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trophy, Clock, Target } from "lucide-react"

type CardType = {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  onGameEnd?: (score: number, moves: number, time: number) => void
}

const emojis = ['🎮', '🎯', '🏆', '⭐', '🎲', '🎪', '🎨', '🎭']

export default function MemoryGame({ onGameEnd }: MemoryGameProps) {
  const [cards, setCards] = useState<CardType[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [bestScore, setBestScore] = useState<{moves: number, time: number} | null>(null)

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('memory-game-best')
    if (saved) {
      setBestScore(JSON.parse(saved))
    }
    setIsLoaded(true)
  }, [])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, gameOver])

  // Initialize game
  const initializeGame = () => {
    const shuffledEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }))
    
    setCards(shuffledEmojis)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameStarted(false)
    setGameOver(false)
    setTime(0)
  }

  // Start game
  const startGame = () => {
    if (cards.length === 0) {
      initializeGame()
    }
    setGameStarted(true)
  }

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!gameStarted || gameOver) return
    
    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1)
      
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(c => c.id === firstId)
      const secondCard = cards.find(c => c.id === secondId)
      
      if (firstCard?.emoji === secondCard?.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ))
          setMatches(prev => {
            const newMatches = prev + 1
            if (newMatches === emojis.length) {
              // Game completed
              setGameOver(true)
              setGameStarted(false)
              
              // Check for best score
              const currentScore = { moves: moves + 1, time: time }
              if (!bestScore || 
                  currentScore.moves < bestScore.moves || 
                  (currentScore.moves === bestScore.moves && currentScore.time < bestScore.time)) {
                setBestScore(currentScore)
                localStorage.setItem('memory-game-best', JSON.stringify(currentScore))
              }
              
              if (onGameEnd) onGameEnd(calculateScore(moves + 1, time), moves + 1, time)
            }
            return newMatches
          })
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ))
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const calculateScore = (moves: number, time: number): number => {
    const baseScore = 1000
    const movePenalty = moves * 10
    const timePenalty = time * 2
    return Math.max(0, baseScore - movePenalty - timePenalty)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Initialize on mount
  useEffect(() => {
    if (isLoaded) {
      initializeGame()
    }
  }, [isLoaded])

  if (!isLoaded) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 w-full h-full">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">جاري التحميل...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-black p-4">
      <Card className="bg-gray-900/50 border-gray-800 w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            🧠 لعبة الذاكرة
          </CardTitle>
          <div className="flex items-center gap-2">
            {bestScore && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                <Trophy className="h-3 w-3 mr-1" />
                {bestScore.moves}م
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
            <div className="text-blue-400 font-bold text-lg">{moves}</div>
            <div className="text-xs text-gray-400">الحركات</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
            <div className="text-green-400 font-bold text-lg">{matches}/{emojis.length}</div>
            <div className="text-xs text-gray-400">المطابقات</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
            <div className="text-purple-400 font-bold text-lg">{formatTime(time)}</div>
            <div className="text-xs text-gray-400">الوقت</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          <div className="grid grid-cols-4 gap-2 bg-gray-800 p-4 rounded-lg">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={!gameStarted || gameOver || card.isMatched}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-2xl
                  transition-all duration-300 border-2
                  ${card.isFlipped || card.isMatched 
                    ? 'bg-white border-gray-300 transform scale-105' 
                    : 'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-500 hover:scale-105'
                  }
                  ${!gameStarted || gameOver || card.isMatched ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${card.isMatched ? 'opacity-75' : ''}
                `}
              >
                {card.isFlipped || card.isMatched ? (
                  <span className="animate-bounce">{card.emoji}</span>
                ) : (
                  <span className="text-white text-lg">?</span>
                )}
              </button>
            ))}
          </div>

          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold mb-2">أحسنت!</h3>
                <div className="space-y-1 text-sm text-gray-300 mb-4">
                  <p>الحركات: {moves}</p>
                  <p>الوقت: {formatTime(time)}</p>
                  <p>النقاط: {calculateScore(moves, time)}</p>
                </div>
                <Button onClick={initializeGame} className="bg-green-600 hover:bg-green-700">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  العب مرة أخرى
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {!gameStarted && !gameOver && (
            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
              <Target className="h-4 w-4 mr-2" />
              ابدأ اللعب
            </Button>
          )}
          <Button onClick={initializeGame} variant="outline" className="border-gray-600">
            <RotateCcw className="h-4 w-4 mr-2" />
            إعادة تشغيل
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400">
          <p>اضغط على الكروت لكشفها</p>
          <p>ابحث عن الأزواج المتطابقة</p>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}