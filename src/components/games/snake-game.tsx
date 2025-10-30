"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Trophy } from "lucide-react"

type Position = {
  x: number
  y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

const GRID_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }
const GAME_SPEED = 150

interface SnakeGameProps {
  onGameEnd?: (score: number) => void
}

export default function SnakeGame({ onGameEnd }: SnakeGameProps) {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [highScore, setHighScore] = useState(0)

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake-high-score')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
    setIsLoaded(true)
  }, [])

  // Generate random food position
  const generateFood = useCallback((): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [snake])

  // Reset game
  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection('RIGHT')
    setIsPlaying(false)
    setGameOver(false)
    setScore(0)
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP')
          break
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN')
          break
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT')
          break
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT')
          break
        case ' ':
          e.preventDefault()
          setIsPlaying(!isPlaying)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, isPlaying, gameOver])

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return

    const gameInterval = setInterval(() => {
      setSnake(currentSnake => {
        const newSnake = [...currentSnake]
        const head = { ...newSnake[0] }

        // Move head based on direction
        switch (direction) {
          case 'UP':
            head.y -= 1
            break
          case 'DOWN':
            head.y += 1
            break
          case 'LEFT':
            head.x -= 1
            break
          case 'RIGHT':
            head.x += 1
            break
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true)
          setIsPlaying(false)
          if (onGameEnd) onGameEnd(score)
          return currentSnake
        }

        // Check self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true)
          setIsPlaying(false)
          if (onGameEnd) onGameEnd(score)
          return currentSnake
        }

        newSnake.unshift(head)

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => {
            const newScore = prev + 10
            if (newScore > highScore) {
              setHighScore(newScore)
              localStorage.setItem('snake-high-score', newScore.toString())
            }
            return newScore
          })
          setFood(generateFood())
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, GAME_SPEED)

    return () => clearInterval(gameInterval)
  }, [isPlaying, direction, food, gameOver, score, highScore, onGameEnd, generateFood])

  const startGame = () => {
    if (gameOver) {
      resetGame()
    }
    setIsPlaying(true)
  }

  const pauseGame = () => {
    setIsPlaying(false)
  }

  if (!isLoaded) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            🐍 Snake Game
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              <Trophy className="h-3 w-3 mr-1" />
              {highScore}
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              Score: {score}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Board */}
        <div className="relative">
          <div 
            className="grid bg-gray-800 border-2 border-gray-700 rounded-lg p-2"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
              aspectRatio: '1',
              width: '100%',
              maxWidth: '400px'
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE
              const y = Math.floor(index / GRID_SIZE)
              
              const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y
              const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y)
              const isFood = food.x === x && food.y === y
              
              return (
                <div
                  key={index}
                  className={`
                    aspect-square border border-gray-700/30 rounded-sm
                    ${isSnakeHead ? 'bg-green-400' : ''}
                    ${isSnakeBody ? 'bg-green-600' : ''}
                    ${isFood ? 'bg-red-500' : ''}
                    ${!isSnakeHead && !isSnakeBody && !isFood ? 'bg-gray-800/50' : ''}
                  `}
                >
                  {isFood && (
                    <div className="w-full h-full flex items-center justify-center text-xs">
                      🍎
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <h3 className="text-xl font-bold mb-2">Game Over!</h3>
                <p className="text-gray-300 mb-4">Final Score: {score}</p>
                <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          {!isPlaying && !gameOver && (
            <Button onClick={startGame} className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Start Game
            </Button>
          )}
          {isPlaying && (
            <Button onClick={pauseGame} variant="outline" className="border-gray-600">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={resetGame} variant="outline" className="border-gray-600">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400">
          <p>Use arrow keys to control</p>
          <p>Spacebar to pause</p>
        </div>
      </CardContent>
    </Card>
  )
}