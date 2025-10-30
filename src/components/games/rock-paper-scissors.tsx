'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCoinSystem } from './coin-system';
import { Users, Coins, Trophy, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

type Choice = 'rock' | 'paper' | 'scissors' | null;
type GameResult = 'player1' | 'player2' | 'tie' | null;

interface Player {
  name: string;
  choice: Choice;
  score: number;
  totalWins: number;
}

interface GameStats {
  gamesPlayed: number;
  player1Wins: number;
  player2Wins: number;
  ties: number;
  totalCoinsWon: number;
  totalCoinsLost: number;
}

const CHOICES = {
  rock: { emoji: '🪨', name: 'حجر', beats: 'scissors' },
  paper: { emoji: '📄', name: 'ورقة', beats: 'rock' },
  scissors: { emoji: '✂️', name: 'مقص', beats: 'paper' }
};

const RockPaperScissors: React.FC = () => {
  const { coins, spendCoins, addCoins, addTransaction } = useCoinSystem();
  const [gameState, setGameState] = useState<'setup' | 'betting' | 'playing' | 'result'>('setup');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [player1, setPlayer1] = useState<Player>({
    name: 'اللاعب الأول',
    choice: null,
    score: 0,
    totalWins: 0
  });
  const [player2, setPlayer2] = useState<Player>({
    name: 'اللاعب الثاني',
    choice: null,
    score: 0,
    totalWins: 0
  });
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [maxRounds, setMaxRounds] = useState<number>(3);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [roundResult, setRoundResult] = useState<GameResult>(null);
  const [showChoices, setShowChoices] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
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
    const savedStats = localStorage.getItem('rps-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('rps-stats', JSON.stringify(stats));
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
      description: `مراهنة في لعبة حجر ورقة مقص - ${betAmount} عملة`
    });

    setGameState('playing');
    setCurrentRound(1);
    setPlayer1(prev => ({ ...prev, choice: null, score: 0 }));
    setPlayer2(prev => ({ ...prev, choice: null, score: 0 }));
    setGameResult(null);
    setRoundResult(null);
    setShowChoices(false);
  };

  const makeChoice = (player: 'player1' | 'player2', choice: Choice) => {
    if (player === 'player1') {
      setPlayer1(prev => ({ ...prev, choice }));
    } else {
      setPlayer2(prev => ({ ...prev, choice }));
    }
  };

  const playRound = () => {
    if (!player1.choice || !player2.choice) {
      toast.error('يجب على كلا اللاعبين اختيار خيار!');
      return;
    }

    setShowChoices(true);
    
    setTimeout(() => {
      const result = determineWinner(player1.choice!, player2.choice!);
      setRoundResult(result);
      
      // Update scores
      if (result === 'player1') {
        setPlayer1(prev => ({ ...prev, score: prev.score + 1 }));
      } else if (result === 'player2') {
        setPlayer2(prev => ({ ...prev, score: prev.score + 1 }));
      }
      
      setTimeout(() => {
        if (currentRound >= maxRounds || player1.score + 1 > maxRounds / 2 || player2.score + 1 > maxRounds / 2) {
          endGame();
        } else {
          nextRound();
        }
      }, 2000);
    }, 1000);
  };

  const determineWinner = (choice1: Choice, choice2: Choice): GameResult => {
    if (choice1 === choice2) return 'tie';
    if (CHOICES[choice1!].beats === choice2) return 'player1';
    return 'player2';
  };

  const nextRound = () => {
    setCurrentRound(prev => prev + 1);
    setPlayer1(prev => ({ ...prev, choice: null }));
    setPlayer2(prev => ({ ...prev, choice: null }));
    setRoundResult(null);
    setShowChoices(false);
  };

  const endGame = () => {
    let finalResult: GameResult;
    if (player1.score > player2.score) {
      finalResult = 'player1';
    } else if (player2.score > player1.score) {
      finalResult = 'player2';
    } else {
      finalResult = 'tie';
    }
    
    setGameResult(finalResult);
    setGameState('result');
    
    // Handle coin rewards
    let coinsWon = 0;
    if (finalResult === 'player1' || finalResult === 'player2') {
      coinsWon = betAmount * 2;
      addCoins(coinsWon);
      addTransaction({
        type: 'bet_win',
        amount: coinsWon,
        description: `فوز في لعبة حجر ورقة مقص - ${coinsWon} عملة`
      });
      toast.success(`🎉 فاز ${finalResult === 'player1' ? player1.name : player2.name} وحصل على ${coinsWon} عملة!`);
    } else {
      // Tie - return half the bet
      coinsWon = betAmount;
      addCoins(coinsWon);
      addTransaction({
        type: 'earn',
        amount: coinsWon,
        description: `تعادل في لعبة حجر ورقة مقص - استرداد ${coinsWon} عملة`
      });
      toast.info(`🤝 تعادل! تم استرداد ${coinsWon} عملة`);
    }
    
    // Update stats
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      player1Wins: prev.player1Wins + (finalResult === 'player1' ? 1 : 0),
      player2Wins: prev.player2Wins + (finalResult === 'player2' ? 1 : 0),
      ties: prev.ties + (finalResult === 'tie' ? 1 : 0),
      totalCoinsWon: prev.totalCoinsWon + (finalResult !== 'tie' ? coinsWon : 0),
      totalCoinsLost: prev.totalCoinsLost + (finalResult === 'tie' ? 0 : betAmount)
    }));
    
    // Update player total wins
    if (finalResult === 'player1') {
      setPlayer1(prev => ({ ...prev, totalWins: prev.totalWins + 1 }));
    } else if (finalResult === 'player2') {
      setPlayer2(prev => ({ ...prev, totalWins: prev.totalWins + 1 }));
    }
  };

  const resetGame = () => {
    setGameState('setup');
    setPlayer1(prev => ({ ...prev, choice: null, score: 0 }));
    setPlayer2(prev => ({ ...prev, choice: null, score: 0 }));
    setCurrentRound(1);
    setGameResult(null);
    setRoundResult(null);
    setShowChoices(false);
  };

  const renderChoice = (choice: Choice) => {
    if (!choice) return '❓';
    return CHOICES[choice].emoji;
  };

  const renderChoiceButtons = (player: 'player1' | 'player2') => {
    const currentPlayer = player === 'player1' ? player1 : player2;
    const isDisabled = gameState !== 'playing' || currentPlayer.choice !== null;
    
    return (
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(CHOICES).map(([key, choice]) => (
          <Button
            key={key}
            onClick={() => makeChoice(player, key as Choice)}
            disabled={isDisabled}
            variant={currentPlayer.choice === key ? 'default' : 'outline'}
            className="h-16 text-2xl flex flex-col items-center gap-1"
          >
            <span className="text-3xl">{choice.emoji}</span>
            <span className="text-xs">{choice.name}</span>
          </Button>
        ))}
      </div>
    );
  };

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-blue-500" />
          حجر ورقة مقص
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          لعبة كلاسيكية للاعبين مع نظام المراهنة بالعملات الذهبية
        </p>
      </div>

      {/* Game Setup */}
      {gameState === 'setup' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعداد اللعبة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم اللاعب الأول</label>
                  <Input
                    value={player1.name}
                    onChange={(e) => setPlayer1(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم اللاعب الأول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم اللاعب الثاني</label>
                  <Input
                    value={player2.name}
                    onChange={(e) => setPlayer2(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم اللاعب الثاني"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عدد الجولات</label>
                  <select
                    value={maxRounds}
                    onChange={(e) => setMaxRounds(parseInt(e.target.value))}
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                  >
                    <option value={3}>أفضل من 3 جولات</option>
                    <option value={5}>أفضل من 5 جولات</option>
                    <option value={7}>أفضل من 7 جولات</option>
                  </select>
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
                </div>
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
        </div>
      )}

      {/* Game Playing */}
      {gameState === 'playing' && (
        <div className="space-y-4">
          {/* Round Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">
                  الجولة {currentRound} من {maxRounds}
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold">مراهنة: {betAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Players */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player 1 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{player1.name}</span>
                  <Badge variant="outline">{player1.score} نقطة</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl mb-2">
                    {showChoices ? renderChoice(player1.choice) : '❓'}
                  </div>
                  {showChoices && player1.choice && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {CHOICES[player1.choice].name}
                    </div>
                  )}
                </div>
                {!showChoices && renderChoiceButtons('player1')}
              </CardContent>
            </Card>

            {/* Player 2 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{player2.name}</span>
                  <Badge variant="outline">{player2.score} نقطة</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl mb-2">
                    {showChoices ? renderChoice(player2.choice) : '❓'}
                  </div>
                  {showChoices && player2.choice && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {CHOICES[player2.choice].name}
                    </div>
                  )}
                </div>
                {!showChoices && renderChoiceButtons('player2')}
              </CardContent>
            </Card>
          </div>

          {/* Round Result */}
          {roundResult && (
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {roundResult === 'tie' ? '🤝 تعادل!' :
                   roundResult === 'player1' ? `🎉 فاز ${player1.name}!` :
                   `🎉 فاز ${player2.name}!`}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Play Round Button */}
          {!showChoices && player1.choice && player2.choice && (
            <Button onClick={playRound} className="w-full" size="lg">
              العب الجولة
            </Button>
          )}
        </div>
      )}

      {/* Game Result */}
      {gameState === 'result' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {gameResult === 'tie' ? '🤝 انتهت اللعبة بالتعادل!' :
                 gameResult === 'player1' ? `🏆 فاز ${player1.name}!` :
                 `🏆 فاز ${player2.name}!`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{player1.score}</div>
                  <div className="text-sm text-gray-500">{player1.name}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{player2.score}</div>
                  <div className="text-sm text-gray-500">{player2.name}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold">
                    {gameResult === 'tie' ? `استرداد ${betAmount} عملة` :
                     `فوز بـ ${betAmount * 2} عملة ذهبية!`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame} size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              لعبة جديدة
            </Button>
          </div>
        </div>
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
              <div className="text-2xl font-bold text-green-600">{stats.player1Wins}</div>
              <div className="text-sm text-gray-500">انتصارات اللاعب 1</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.player2Wins}</div>
              <div className="text-sm text-gray-500">انتصارات اللاعب 2</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.ties}</div>
              <div className="text-sm text-gray-500">تعادل</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RockPaperScissors;