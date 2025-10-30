'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Target, Zap, Trophy } from 'lucide-react';

interface TypingStats {
  wpm: number;
  accuracy: number;
  time: number;
  errors: number;
  bestWpm: number;
  gamesPlayed: number;
}

const SAMPLE_TEXTS = [
  "In the evolving world of technology, programming plays an important role in shaping our digital future.",
  "Artificial intelligence is changing the way we interact with technology and opening new horizons for creativity.",
  "Continuous learning is the key to success in the information age and rapid technological development.",
  "The Internet has made the world a small village and connected people across continents and different cultures.",
  "Big data helps companies make better decisions and understand customer needs.",
  "Cybersecurity has become a top priority in a world increasingly dependent on technology.",
  "E-commerce has changed the way we shop and made products available around the clock.",
  "Virtual reality provides new immersive experiences in education, entertainment and medicine."
];

const DIFFICULTY_LEVELS = {
  easy: { name: 'Easy', timeLimit: 120, targetWpm: 20 },
  medium: { name: 'Medium', timeLimit: 90, targetWpm: 35 },
  hard: { name: 'Hard', timeLimit: 60, targetWpm: 50 }
};

type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

const TypingSpeedGame: React.FC = () => {
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    time: 0,
    errors: 0,
    bestWpm: 0,
    gamesPlayed: 0
  });
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load stats from localStorage
  useEffect(() => {
    const bestWpm = parseInt(localStorage.getItem('typing-best-wpm') || '0');
    const gamesPlayed = parseInt(localStorage.getItem('typing-games-played') || '0');
    setStats(prev => ({
      ...prev,
      bestWpm,
      gamesPlayed
    }));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [gameState, timeLeft]);

  const startGame = () => {
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setCurrentText(randomText);
    setUserInput('');
    setGameState('playing');
    setStartTime(Date.now());
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const finishGame = () => {
    setGameState('finished');
    calculateStats();
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const calculateStats = () => {
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wordsTyped = userInput.trim().split(' ').length;
    const wpm = Math.round(wordsTyped / timeElapsed);
    
    let correctChars = 0;
    let errors = 0;
    
    for (let i = 0; i < Math.min(userInput.length, currentText.length); i++) {
      if (userInput[i] === currentText[i]) {
        correctChars++;
      } else {
        errors++;
      }
    }
    
    const accuracy = Math.round((correctChars / Math.max(userInput.length, 1)) * 100);
    const newBestWpm = Math.max(wpm, stats.bestWpm);
    const newGamesPlayed = stats.gamesPlayed + 1;
    
    localStorage.setItem('typing-best-wpm', newBestWpm.toString());
    localStorage.setItem('typing-games-played', newGamesPlayed.toString());
    
    setStats({
      wpm,
      accuracy,
      time: Math.round(timeElapsed * 60),
      errors,
      bestWpm: newBestWpm,
      gamesPlayed: newGamesPlayed
    });
  };

  const resetGame = () => {
    setGameState('waiting');
    setUserInput('');
    setCurrentText('');
    setTimeLeft(DIFFICULTY_LEVELS[difficulty].timeLimit);
  };

  const getCharacterStatus = (index: number) => {
    if (index >= userInput.length) return 'pending';
    return userInput[index] === currentText[index] ? 'correct' : 'incorrect';
  };

  const getProgressPercentage = () => {
    if (!currentText) return 0;
    return Math.min((userInput.length / currentText.length) * 100, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (gameState !== 'playing') return;
    
    const value = e.target.value;
    setUserInput(value);
    
    // Auto-finish when text is completed
    if (value.length >= currentText.length) {
      finishGame();
    }
  };

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-yellow-500" />
          Typing Speed Game
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test your typing speed and accuracy in English
        </p>
      </div>

      {/* Difficulty Selection */}
      {gameState === 'waiting' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">اختر مستوى الصعوبة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4">
              {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
                <Button
                  key={key}
                  variant={difficulty === key ? 'default' : 'outline'}
                  onClick={() => setDifficulty(key as DifficultyLevel)}
                  className="flex flex-col items-center p-4 h-auto"
                >
                  <span className="font-bold">{level.name}</span>
                  <span className="text-sm opacity-75">{level.timeLimit}s</span>
                  <span className="text-xs opacity-60">{level.targetWpm} WPM</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">Speed</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.wpm}</div>
            <div className="text-sm text-gray-500">WPM</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
            <div className="text-sm text-gray-500">Correct</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">Time</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{timeLeft}</div>
            <div className="text-sm text-gray-500">seconds</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Best Score</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.bestWpm}</div>
            <div className="text-sm text-gray-500">WPM</div>
          </CardContent>
        </Card>
      </div>

      {/* Game Area */}
      {gameState !== 'waiting' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Text to Type</CardTitle>
              <Badge variant={difficulty === 'easy' ? 'secondary' : difficulty === 'medium' ? 'default' : 'destructive'}>
                {DIFFICULTY_LEVELS[difficulty].name}
              </Badge>
            </div>
            <Progress value={getProgressPercentage()} className="w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Text Display */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-lg leading-relaxed font-mono" dir="rtl">
                {currentText.split('').map((char, index) => {
                  const status = getCharacterStatus(index);
                  return (
                    <span
                      key={index}
                      className={`${
                        status === 'correct'
                          ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                          : status === 'incorrect'
                          ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200'
                          : index === userInput.length
                          ? 'bg-blue-200 dark:bg-blue-800 animate-pulse'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Input Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Type the text here:
              </label>
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                disabled={gameState !== 'playing'}
                className="w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                rows={4}
                dir="rtl"
                placeholder="Start typing here..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {gameState === 'finished' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-green-600 dark:text-green-400">
              🎉 Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.wpm}</div>
                <div className="text-sm text-gray-500">WPM</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{stats.errors}</div>
                <div className="text-sm text-gray-500">Errors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.time}ث</div>
                <div className="text-sm text-gray-500">Time Taken</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-center space-y-2">
              <div className="text-lg">
                {stats.wpm >= DIFFICULTY_LEVELS[difficulty].targetWpm ? (
                  <span className="text-green-600 font-semibold">🏆 Excellent! You exceeded the target</span>
                ) : (
                  <span className="text-orange-600 font-semibold">💪 Try again to improve your score</span>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Games played: {stats.gamesPlayed} • Best score: {stats.bestWpm} WPM
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {gameState === 'waiting' && (
          <Button onClick={startGame} size="lg" className="px-8">
            Start Game
          </Button>
        )}
        
        {gameState === 'playing' && (
          <Button onClick={finishGame} variant="destructive" size="lg">
            End Game
          </Button>
        )}
        
        {gameState === 'finished' && (
          <div className="flex gap-4">
            <Button onClick={resetGame} size="lg">
              New Game
            </Button>
            <Button onClick={startGame} variant="outline" size="lg">
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingSpeedGame;