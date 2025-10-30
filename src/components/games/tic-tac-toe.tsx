"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Trophy, Users } from "lucide-react"

type Player = 'X' | 'O' | null
type Board = Player[]

interface TicTacToeProps {
  onGameEnd?: (winner: Player, isDraw: boolean) => void
}

export default function TicTacToe({ onGameEnd }: TicTacToeProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X')
  const [winner, setWinner] = useState<Player>(null)
  const [isDraw, setIsDraw] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ]

  const checkWinner = (board: Board): Player => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    return null
  }

  const checkDraw = (board: Board): boolean => {
    return board.every(cell => cell !== null) && !checkWinner(board)
  }

  const handleCellClick = (index: number) => {
    if (board[index] || gameOver) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameWinner = checkWinner(newBoard)
    const gameDraw = checkDraw(newBoard)

    if (gameWinner) {
      setWinner(gameWinner)
      setGameOver(true)
      setScores(prev => ({
        ...prev,
        [gameWinner]: prev[gameWinner] + 1
      }))
      if (onGameEnd) onGameEnd(gameWinner, false)
    } else if (gameDraw) {
      setIsDraw(true)
      setGameOver(true)
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
      if (onGameEnd) onGameEnd(null, true)
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setWinner(null)
    setIsDraw(false)
    setGameOver(false)
  }

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
    resetGame()
  }

  const getWinningCells = (): number[] => {
    if (!winner) return []
    
    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (board[a] === winner && board[b] === winner && board[c] === winner) {
        return combination
      }
    }
    return []
  }

  const winningCells = getWinningCells()

  return (
    <Card className="bg-gray-900/50 border-gray-800 max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            ⭕ إكس أو (XO)
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Users className="h-3 w-3 mr-1" />
              اللاعب: {currentPlayer}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Board */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
            <div className="text-blue-400 font-bold text-lg">{scores.X}</div>
            <div className="text-xs text-gray-400">اللاعب X</div>
          </div>
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-2">
            <div className="text-gray-400 font-bold text-lg">{scores.draws}</div>
            <div className="text-xs text-gray-400">التعادل</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
            <div className="text-red-400 font-bold text-lg">{scores.O}</div>
            <div className="text-xs text-gray-400">اللاعب O</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-2 bg-gray-800 p-4 rounded-lg">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={gameOver || cell !== null}
                className={`
                  aspect-square bg-gray-700 hover:bg-gray-600 rounded-lg
                  flex items-center justify-center text-2xl font-bold
                  transition-all duration-200 border-2
                  ${winningCells.includes(index) ? 'border-yellow-400 bg-yellow-400/20' : 'border-transparent'}
                  ${cell === 'X' ? 'text-blue-400' : cell === 'O' ? 'text-red-400' : 'text-gray-400'}
                  ${!gameOver && !cell ? 'hover:scale-105 cursor-pointer' : ''}
                  ${gameOver || cell ? 'cursor-not-allowed' : ''}
                `}
              >
                {cell}
              </button>
            ))}
          </div>

          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                {winner ? (
                  <>
                    <div className="text-4xl mb-2">
                      {winner === 'X' ? '🎉' : '🏆'}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      فاز اللاعب {winner}!
                    </h3>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-2">🤝</div>
                    <h3 className="text-xl font-bold mb-2">تعادل!</h3>
                  </>
                )}
                <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  لعبة جديدة
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Game Status */}
        {!gameOver && (
          <div className="text-center">
            <p className="text-gray-400">
              اللاعب الحالي: <span className={`font-bold ${currentPlayer === 'X' ? 'text-blue-400' : 'text-red-400'}`}>{currentPlayer}</span>
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button onClick={resetGame} variant="outline" className="border-gray-600">
            <RotateCcw className="h-4 w-4 mr-2" />
            إعادة تعيين اللعبة
          </Button>
          <Button onClick={resetScores} variant="outline" className="border-gray-600">
            <Trophy className="h-4 w-4 mr-2" />
            مسح النقاط
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-400">
          <p>انقر على أي مربع فارغ للعب</p>
          <p>الهدف: احصل على ثلاثة رموز في صف واحد</p>
        </div>
      </CardContent>
    </Card>
  )
}