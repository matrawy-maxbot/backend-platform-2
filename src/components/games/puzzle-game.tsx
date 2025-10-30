"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trophy, Shuffle, Target } from "lucide-react"

type PuzzlePiece = {
  id: number
  value: number
  isEmpty: boolean
}

interface PuzzleGameProps {
  onGameEnd?: (moves: number, time: number) => void
}

const GRID_SIZE = 4
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE

export default function PuzzleGame({ onGameEnd }: PuzzleGameProps) {
  const [puzzle, setPuzzle] = useState<PuzzlePiece[]>([])
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [time, setTime] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [bestScore, setBestScore] = useState<{moves: number, time: number} | null>(null)

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('puzzle-game-best')
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

  // Create solved puzzle
  const createSolvedPuzzle = (): PuzzlePiece[] => {
    const pieces: PuzzlePiece[] = []
    for (let i = 0; i < TOTAL_PIECES - 1; i++) {
      pieces.push({
        id: i,
        value: i + 1,
        isEmpty: false
      })
    }
    pieces.push({
      id: TOTAL_PIECES - 1,
      value: 0,
      isEmpty: true
    })
    return pieces
  }

  // Shuffle puzzle
  const shufflePuzzle = (pieces: PuzzlePiece[]): PuzzlePiece[] => {
    const shuffled = [...pieces]
    
    // Perform random valid moves to ensure solvability
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffled.findIndex(p => p.isEmpty)
      const validMoves = getValidMoves(emptyIndex)
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
        swapPieces(shuffled, emptyIndex, randomMove)
      }
    }
    
    return shuffled
  }

  // Get valid moves for empty space
  const getValidMoves = (emptyIndex: number): number[] => {
    const moves: number[] = []
    const row = Math.floor(emptyIndex / GRID_SIZE)
    const col = emptyIndex % GRID_SIZE

    // Up
    if (row > 0) moves.push(emptyIndex - GRID_SIZE)
    // Down
    if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE)
    // Left
    if (col > 0) moves.push(emptyIndex - 1)
    // Right
    if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1)

    return moves
  }

  // Swap two pieces
  const swapPieces = (pieces: PuzzlePiece[], index1: number, index2: number) => {
    const temp = pieces[index1]
    pieces[index1] = pieces[index2]
    pieces[index2] = temp
  }

  // Check if puzzle is solved
  const isPuzzleSolved = (pieces: PuzzlePiece[]): boolean => {
    for (let i = 0; i < TOTAL_PIECES - 1; i++) {
      if (pieces[i].value !== i + 1) return false
    }
    return pieces[TOTAL_PIECES - 1].isEmpty
  }

  // Initialize game
  const initializeGame = () => {
    const solvedPuzzle = createSolvedPuzzle()
    const shuffledPuzzle = shufflePuzzle(solvedPuzzle)
    setPuzzle(shuffledPuzzle)
    setMoves(0)
    setGameStarted(false)
    setGameOver(false)
    setTime(0)
  }

  // Start game
  const startGame = () => {
    if (puzzle.length === 0) {
      initializeGame()
    }
    setGameStarted(true)
  }

  // Handle piece click
  const handlePieceClick = (clickedIndex: number) => {
    if (!gameStarted || gameOver || puzzle[clickedIndex].isEmpty) return

    const emptyIndex = puzzle.findIndex(p => p.isEmpty)
    const validMoves = getValidMoves(emptyIndex)

    if (validMoves.includes(clickedIndex)) {
      const newPuzzle = [...puzzle]
      swapPieces(newPuzzle, emptyIndex, clickedIndex)
      setPuzzle(newPuzzle)
      setMoves(prev => prev + 1)

      // Check if solved
      if (isPuzzleSolved(newPuzzle)) {
        setGameOver(true)
        setGameStarted(false)
        
        // Check for best score
        const currentScore = { moves: moves + 1, time: time }
        if (!bestScore || 
            currentScore.moves < bestScore.moves || 
            (currentScore.moves === bestScore.moves && currentScore.time < bestScore.time)) {
          setBestScore(currentScore)
          localStorage.setItem('puzzle-game-best', JSON.stringify(currentScore))
        }
        
        if (onGameEnd) onGameEnd(moves + 1, time)
      }
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Initialize on mount
  useEffect(() => {
    initializeGame()
  }, [])

  if (!isLoaded) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">جاري التحميل...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            🧩 لعبة الألغاز
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
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
            <div className="text-blue-400 font-bold text-lg">{moves}</div>
            <div className="text-xs text-gray-400">الحركات</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
            <div className="text-purple-400 font-bold text-lg">{formatTime(time)}</div>
            <div className="text-xs text-gray-400">الوقت</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          <div className="grid grid-cols-4 gap-1 bg-gray-800 p-4 rounded-lg">
            {puzzle.map((piece, index) => (
              <button
                key={piece.id}
                onClick={() => handlePieceClick(index)}
                disabled={!gameStarted || gameOver || piece.isEmpty}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-xl font-bold
                  transition-all duration-200 border-2
                  ${piece.isEmpty 
                    ? 'bg-gray-700 border-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 text-white hover:scale-105 cursor-pointer'
                  }
                  ${!gameStarted || gameOver ? 'cursor-not-allowed opacity-75' : ''}
                `}
              >
                {!piece.isEmpty && piece.value}
              </button>
            ))}
          </div>

          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold mb-2">ممتاز!</h3>
                <div className="space-y-1 text-sm text-gray-300 mb-4">
                  <p>الحركات: {moves}</p>
                  <p>الوقت: {formatTime(time)}</p>
                  {bestScore && moves <= bestScore.moves && (
                    <p className="text-yellow-400">🏆 رقم قياسي جديد!</p>
                  )}
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
            <Shuffle className="h-4 w-4 mr-2" />
            خلط جديد
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400">
          <p>اضغط على الأرقام لتحريكها</p>
          <p>رتب الأرقام من 1 إلى 15</p>
        </div>
      </CardContent>
    </Card>
  )
}