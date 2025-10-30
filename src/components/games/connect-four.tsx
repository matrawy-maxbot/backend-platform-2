'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCoinSystem } from './coin-system';
import { Users, Coins, Trophy, RotateCcw, Target } from 'lucide-react';
import { toast } from 'sonner';

type CellValue = 'empty' | 'player1' | 'player2';
type GameResult = 'player1' | 'player2' | 'tie' | null;

interface Player {
  name: string;
  color: string;
  emoji: string;
  wins: number;
}

interface GameStats {
  gamesPlayed: number;
  player1Wins: number;
  player2Wins: number;
  ties: number;
  totalCoinsWon: number;
  totalCoinsLost: number;
}

const ROWS = 6;
const COLS = 7;

const ConnectFour: React.FC = () => {
  const { coins, spendCoins, addCoins, addTransaction } = useCoinSystem();
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'result'>('setup');
  const [board, setBoard] = useState<CellValue[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill('empty'))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [player1, setPlayer1] = useState<Player>({
    name: 'اللاعب الأول',
    color: 'bg-red-500',
    emoji: '🔴',
    wins: 0
  });
  const [player2, setPlayer2] = useState<Player>({
    name: 'اللاعب الثاني',
    color: 'bg-yellow-500',
    emoji: '🟡',
    wins: 0
  });
  const [stats, setStats] = useState<GameStats>({
    gamesPlayed: 0,
    player1Wins: 0,
    player2Wins: 0,
    ties: 0,
    totalCoinsWon: 0,
    totalCoinsLost: 0
  });

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('connect-four-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('connect-four-stats', JSON.stringify(stats));
  }, [stats]);

  const startGame = () => {
    if (coins < betAmount) {
      toast.error('ليس لديك عملات كافية للمراهنة!');
      return;
    }
    
    if (!spendCoins(betAmount)) {
      toast.error('فشل في خصم العملات!');
      return;
    }

    addTransaction({
      type: 'spend',
      amount: betAmount,
      description: `مراهنة في لعبة أربعة في خط - ${betAmount} عملة`
    });

    setGameState('playing');
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill('empty')));
    setCurrentPlayer('player1');
    setGameResult(null);
    setWinningCells([]);
  };

  const dropPiece = (col: number) => {
    if (gameState !== 'playing' || gameResult) return;

    // Find the lowest empty row in the column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 'empty') {
        row = r;
        break;
      }
    }

    if (row === -1) {
      toast.error('هذا العمود ممتلئ!');
      return;
    }

    // Update board
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    // Check for win
    const winResult = checkWin(newBoard, row, col, currentPlayer);
    if (winResult.hasWin) {
      setWinningCells(winResult.winningCells);
      setGameResult(currentPlayer);
      endGame(currentPlayer);
      return;
    }

    // Check for tie
    if (isBoardFull(newBoard)) {
      setGameResult('tie');
      endGame('tie');
      return;
    }

    // Switch player
    setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
  };

  const checkWin = (board: CellValue[][], row: number, col: number, player: 'player1' | 'player2') => {
    const directions = [
      [0, 1],   // horizontal
      [1, 0],   // vertical
      [1, 1],   // diagonal /
      [1, -1]   // diagonal \
    ];

    for (const [dr, dc] of directions) {
      const cells: [number, number][] = [[row, col]];
      
      // Check in positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === player) {
          cells.push([newRow, newCol]);
        } else {
          break;
        }
      }
      
      // Check in negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - dr * i;
        const newCol = col - dc * i;
        if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLS && board[newRow][newCol] === player) {
          cells.unshift([newRow, newCol]);
        } else {
          break;
        }
      }
      
      if (cells.length >= 4) {
        return { hasWin: true, winningCells: cells.slice(0, 4) };
      }
    }
    
    return { hasWin: false, winningCells: [] };
  };

  const isBoardFull = (board: CellValue[][]) => {
    return board[0].every(cell => cell !== 'empty');
  };

  const endGame = (result: GameResult) => {
    setGameState('result');
    
    // Handle coin rewards
    let coinsWon = 0;
    if (result === 'player1' || result === 'player2') {
      coinsWon = betAmount * 2;
      addCoins(coinsWon);
      addTransaction({
        type: 'bet_win',
        amount: coinsWon,
        description: `فوز في لعبة أربعة في خط - ${coinsWon} عملة`
      });
      
      const winner = result === 'player1' ? player1 : player2;
      toast.success(`🎉 فاز ${winner.name} وحصل على ${coinsWon} عملة!`);
      
      // Update player wins
      if (result === 'player1') {
        setPlayer1(prev => ({ ...prev, wins: prev.wins + 1 }));
      } else {
        setPlayer2(prev => ({ ...prev, wins: prev.wins + 1 }));
      }
    } else {
      // Tie - return half the bet
      coinsWon = betAmount;
      addCoins(coinsWon);
      addTransaction({
        type: 'earn',
        amount: coinsWon,
        description: `تعادل في لعبة أربعة في خط - استرداد ${coinsWon} عملة`
      });
      toast.info(`🤝 تعادل! تم استرداد ${coinsWon} عملة`);
    }
    
    // Update stats
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      player1Wins: prev.player1Wins + (result === 'player1' ? 1 : 0),
      player2Wins: prev.player2Wins + (result === 'player2' ? 1 : 0),
      ties: prev.ties + (result === 'tie' ? 1 : 0),
      totalCoinsWon: prev.totalCoinsWon + (result !== 'tie' ? coinsWon : 0),
      totalCoinsLost: prev.totalCoinsLost + (result === 'tie' ? 0 : betAmount)
    }));
  };

  const resetGame = () => {
    setGameState('setup');
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill('empty')));
    setCurrentPlayer('player1');
    setGameResult(null);
    setWinningCells([]);
  };

  const getCellClass = (row: number, col: number) => {
    const cell = board[row][col];
    const isWinning = winningCells.some(([r, c]) => r === row && c === col);
    
    let baseClass = 'w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-2xl transition-all duration-300';
    
    if (cell === 'player1') {
      baseClass += ' bg-red-500 border-red-600';
    } else if (cell === 'player2') {
      baseClass += ' bg-yellow-500 border-yellow-600';
    } else {
      baseClass += ' bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700';
    }
    
    if (isWinning) {
      baseClass += ' ring-4 ring-green-400 animate-pulse';
    }
    
    return baseClass;
  };

  const renderCell = (row: number, col: number) => {
    const cell = board[row][col];
    return (
      <div key={`${row}-${col}`} className={getCellClass(row, col)}>
        {cell === 'player1' && player1.emoji}
        {cell === 'player2' && player2.emoji}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Target className="h-8 w-8 text-blue-500" />
          أربعة في خط
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          كن أول من يصل أربع قطع في خط واحد - أفقي أو عمودي أو قطري
        </p>
      </div>

      {/* Game Setup */}
      {gameState === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle>إعداد اللعبة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">اسم اللاعب الأول (🔴)</label>
                <Input
                  value={player1.name}
                  onChange={(e) => setPlayer1(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم اللاعب الأول"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">اسم اللاعب الثاني (🟡)</label>
                <Input
                  value={player2.name}
                  onChange={(e) => setPlayer2(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="أدخل اسم اللاعب الثاني"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">مبلغ المراهنة</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                  min={10}
                  max={coins}
                  className="flex-1"
                />
                <Coins className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                رصيدك الحالي: {coins} عملة
              </div>
              
              {/* Quick Add Coins Buttons */}
              {coins < betAmount && (
                <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                    💰 تحتاج إلى المزيد من العملات للعب!
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      onClick={() => {
                        addCoins(100);
                        addTransaction({
                          type: 'earn',
                          amount: 100,
                          description: 'إضافة عملات سريعة - 100 عملة'
                        });
                        toast.success('تم إضافة 100 عملة!');
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      +100 عملة
                    </Button>
                    <Button
                      onClick={() => {
                        addCoins(500);
                        addTransaction({
                          type: 'earn',
                          amount: 500,
                          description: 'إضافة عملات سريعة - 500 عملة'
                        });
                        toast.success('تم إضافة 500 عملة!');
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      +500 عملة
                    </Button>
                    <Button
                      onClick={() => {
                        addCoins(1000);
                        addTransaction({
                          type: 'earn',
                          amount: 1000,
                          description: 'إضافة عملات سريعة - 1000 عملة'
                        });
                        toast.success('تم إضافة 1000 عملة!');
                      }}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      +1000 عملة
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <Button
              onClick={startGame}
              disabled={coins < betAmount || !player1.name.trim() || !player2.name.trim()}
              className="w-full"
              size="lg"
            >
              ابدأ اللعبة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Game Playing */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Current Player */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">دور:</span>
                  <span className="text-2xl">
                    {currentPlayer === 'player1' ? player1.emoji : player2.emoji}
                  </span>
                  <span className="font-bold">
                    {currentPlayer === 'player1' ? player1.name : player2.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold">مراهنة: {betAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Board */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center">
                <div className="inline-block bg-blue-600 p-4 rounded-lg">
                  {/* Column buttons */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {Array(COLS).fill(null).map((_, col) => (
                      <Button
                        key={col}
                        onClick={() => dropPiece(col)}
                        disabled={gameResult !== null || board[0][col] !== 'empty'}
                        variant="secondary"
                        size="sm"
                        className="w-12 h-8 p-0"
                      >
                        ↓
                      </Button>
                    ))}
                  </div>
                  
                  {/* Board */}
                  <div className="grid grid-cols-7 gap-2">
                    {board.map((row, rowIndex) =>
                      row.map((_, colIndex) => renderCell(rowIndex, colIndex))
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Result */}
      {gameState === 'result' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {gameResult === 'tie' ? '🤝 انتهت اللعبة بالتعادل!' :
               gameResult === 'player1' ? `🏆 فاز ${player1.name}!` :
               `🏆 فاز ${player2.name}!`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">
                  {gameResult === 'tie' ? `استرداد ${betAmount} عملة` :
                   `فوز بـ ${betAmount * 2} عملة ذهبية!`}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl mb-2">{player1.emoji}</div>
                <div className="font-bold">{player1.name}</div>
                <div className="text-sm text-gray-500">{player1.wins} انتصار</div>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl mb-2">{player2.emoji}</div>
                <div className="font-bold">{player2.name}</div>
                <div className="text-sm text-gray-500">{player2.wins} انتصار</div>
              </div>
            </div>
            
            <Button onClick={resetGame} className="w-full" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              لعبة جديدة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            الإحصائيات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.gamesPlayed}</div>
              <div className="text-sm text-gray-500">ألعاب لعبت</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.player1Wins}</div>
              <div className="text-sm text-gray-500">انتصارات 🔴</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.player2Wins}</div>
              <div className="text-sm text-gray-500">انتصارات 🟡</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">{stats.ties}</div>
              <div className="text-sm text-gray-500">تعادل</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectFour;