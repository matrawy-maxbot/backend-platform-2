"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trophy, Target, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

type Tile = {
  id: number
  value: number
  merged?: boolean
}

type Board = (Tile | null)[][]

interface Game2048Props {
  onGameEnd?: (score: number) => void
}

const GRID_SIZE = 4
const INITIAL_TILES = 2

export default function Game2048({ onGameEnd }: Game2048Props) {
  const [board, setBoard] = useState<Board>(() => 
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  )
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  let nextId = 1

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('2048-best-score')
    if (saved) {
      setBestScore(parseInt(saved))
    }
    setIsLoaded(true)
  }, [])

  // Save best score to localStorage
  useEffect(() => {
    if (score > bestScore && isLoaded) {
      setBestScore(score)
      localStorage.setItem('2048-best-score', score.toString())
    }
  }, [score, bestScore, isLoaded])

  // Generate random empty position
  const getRandomEmptyPosition = useCallback((currentBoard: Board) => {
    const emptyPositions: [number, number][] = []
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!currentBoard[row][col]) {
          emptyPositions.push([row, col])
        }
      }
    }
    if (emptyPositions.length === 0) return null
    return emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
  }, [])

  // Add new tile to board
  const addNewTile = useCallback((currentBoard: Board) => {
    const position = getRandomEmptyPosition(currentBoard)
    if (!position) return currentBoard
    
    const [row, col] = position
    const newBoard = currentBoard.map(r => [...r])
    newBoard[row][col] = {
      id: nextId++,
      value: Math.random() < 0.9 ? 2 : 4
    }
    return newBoard
  }, [getRandomEmptyPosition])

  // Initialize game
  const initializeGame = useCallback(() => {
    let newBoard: Board = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
    
    // Add initial tiles
    for (let i = 0; i < INITIAL_TILES; i++) {
      newBoard = addNewTile(newBoard)
    }
    
    setBoard(newBoard)
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    setGameStarted(true)
  }, [addNewTile])

  // Move tiles in a direction
  const moveTiles = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return

    let newBoard = board.map(row => [...row])
    let newScore = score
    let moved = false

    // Clear merged flags
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newBoard[row][col]) {
          newBoard[row][col]!.merged = false
        }
      }
    }

    const moveAndMerge = (tiles: (Tile | null)[]) => {
      // Filter out null values and move tiles
      const nonEmptyTiles = tiles.filter(tile => tile !== null) as Tile[]
      const result: (Tile | null)[] = []
      
      for (let i = 0; i < nonEmptyTiles.length; i++) {
        const current = nonEmptyTiles[i]
        const next = nonEmptyTiles[i + 1]
        
        if (next && current.value === next.value && !current.merged && !next.merged) {
          // Merge tiles
          result.push({
            id: current.id,
            value: current.value * 2,
            merged: true
          })
          newScore += current.value * 2
          i++ // Skip next tile as it's merged
        } else {
          result.push(current)
        }
      }
      
      // Fill remaining positions with null
      while (result.length < GRID_SIZE) {
        result.push(null)
      }
      
      return result
    }

    if (direction === 'left') {
      for (let row = 0; row < GRID_SIZE; row++) {
        const originalRow = [...newBoard[row]]
        const newRow = moveAndMerge(newBoard[row])
        newBoard[row] = newRow
        if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
          moved = true
        }
      }
    } else if (direction === 'right') {
      for (let row = 0; row < GRID_SIZE; row++) {
        const originalRow = [...newBoard[row]]
        const reversedRow = [...newBoard[row]].reverse()
        const newRow = moveAndMerge(reversedRow).reverse()
        newBoard[row] = newRow
        if (JSON.stringify(originalRow) !== JSON.stringify(newRow)) {
          moved = true
        }
      }
    } else if (direction === 'up') {
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = []
        for (let row = 0; row < GRID_SIZE; row++) {
          column.push(newBoard[row][col])
        }
        const originalColumn = [...column]
        const newColumn = moveAndMerge(column)
        for (let row = 0; row < GRID_SIZE; row++) {
          newBoard[row][col] = newColumn[row]
        }
        if (JSON.stringify(originalColumn) !== JSON.stringify(newColumn)) {
          moved = true
        }
      }
    } else if (direction === 'down') {
      for (let col = 0; col < GRID_SIZE; col++) {
        const column = []
        for (let row = 0; row < GRID_SIZE; row++) {
          column.push(newBoard[row][col])
        }
        const originalColumn = [...column]
        const reversedColumn = [...column].reverse()
        const newColumn = moveAndMerge(reversedColumn).reverse()
        for (let row = 0; row < GRID_SIZE; row++) {
          newBoard[row][col] = newColumn[row]
        }
        if (JSON.stringify(originalColumn) !== JSON.stringify(newColumn)) {
          moved = true
        }
      }
    }

    if (moved) {
      // Add new tile
      newBoard = addNewTile(newBoard)
      setBoard(newBoard)
      setScore(newScore)
      
      // Check for 2048 tile (win condition)
      if (!gameWon) {
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            if (newBoard[row][col]?.value === 2048) {
              setGameWon(true)
              break
            }
          }
        }
      }
      
      // Check for game over
      if (isGameOver(newBoard)) {
        setGameOver(true)
        onGameEnd?.(newScore)
      }
    }
  }, [board, score, gameOver, gameWon, addNewTile, onGameEnd])

  // Check if game is over
  const isGameOver = useCallback((currentBoard: Board) => {
    // Check for empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!currentBoard[row][col]) return false
      }
    }
    
    // Check for possible merges
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const current = currentBoard[row][col]
        if (!current) continue
        
        // Check right neighbor
        if (col < GRID_SIZE - 1) {
          const right = currentBoard[row][col + 1]
          if (right && current.value === right.value) return false
        }
        
        // Check bottom neighbor
        if (row < GRID_SIZE - 1) {
          const bottom = currentBoard[row + 1][col]
          if (bottom && current.value === bottom.value) return false
        }
      }
    }
    
    return true
  }, [])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          moveTiles('up')
          break
        case 'ArrowDown':
          e.preventDefault()
          moveTiles('down')
          break
        case 'ArrowLeft':
          e.preventDefault()
          moveTiles('left')
          break
        case 'ArrowRight':
          e.preventDefault()
          moveTiles('right')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, gameOver, moveTiles])

  // Get tile color based on value
  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      2: 'bg-gray-100 text-gray-800',
      4: 'bg-gray-200 text-gray-800',
      8: 'bg-orange-200 text-orange-800',
      16: 'bg-orange-300 text-orange-900',
      32: 'bg-orange-400 text-white',
      64: 'bg-orange-500 text-white',
      128: 'bg-yellow-300 text-white',
      256: 'bg-yellow-400 text-white',
      512: 'bg-yellow-500 text-white',
      1024: 'bg-yellow-600 text-white',
      2048: 'bg-yellow-700 text-white',
    }
    return colors[value] || 'bg-purple-500 text-white'
  }

  const formatScore = (num: number) => {
    return num.toLocaleString()
  }

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-64">جاري التحميل...</div>
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Target className="h-6 w-6 text-yellow-400" />
          لعبة 2048
        </h1>
        <p className="text-gray-400 text-sm">
          ادمج البلاطات للوصول إلى 2048!
        </p>
      </div>

      {/* Score Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center">
          <div className="text-white font-bold text-lg">{formatScore(score)}</div>
          <div className="text-gray-400 text-xs">النقاط</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
          <div className="text-yellow-400 font-bold text-lg">{formatScore(bestScore)}</div>
          <div className="text-gray-400 text-xs">أفضل نتيجة</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        <div className="bg-gray-800 p-2 rounded-lg">
          <div className="grid grid-cols-4 gap-2">
            {board.map((row, rowIndex) =>
              row.map((tile, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center font-bold text-sm
                    transition-all duration-200
                    ${tile 
                      ? `${getTileColor(tile.value)} ${tile.merged ? 'scale-110' : 'scale-100'}` 
                      : 'bg-gray-700'
                    }
                  `}
                >
                  {tile?.value}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Game Over Overlay */}
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
            <div className="text-center text-white space-y-4">
              <div className="text-4xl mb-2">
                {gameWon ? '🎉' : '😔'}
              </div>
              <h3 className="text-xl font-bold">
                {gameWon ? 'مبروك! وصلت إلى 2048!' : 'انتهت اللعبة!'}
              </h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p>النتيجة النهائية: {formatScore(score)}</p>
                {score === bestScore && score > 0 && (
                  <p className="text-yellow-400">🏆 رقم قياسي جديد!</p>
                )}
              </div>
              <Button 
                onClick={initializeGame}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {!gameStarted ? (
          <Button 
            onClick={initializeGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            ابدأ اللعبة
          </Button>
        ) : (
          <>
            {/* Mobile Controls */}
            <div className="grid grid-cols-3 gap-2 md:hidden">
              <div></div>
              <Button
                onClick={() => moveTiles('up')}
                disabled={gameOver}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <div></div>
              <Button
                onClick={() => moveTiles('left')}
                disabled={gameOver}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => moveTiles('down')}
                disabled={gameOver}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => moveTiles('right')}
                disabled={gameOver}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Instructions */}
            <div className="text-center text-xs text-gray-400">
              <p className="hidden md:block">استخدم مفاتيح الأسهم للحركة</p>
              <p className="md:hidden">استخدم الأزرار أعلاه للحركة</p>
            </div>
            
            <Button 
              onClick={initializeGame}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              إعادة تشغيل
            </Button>
          </>
        )}
      </div>
    </div>
  )
}