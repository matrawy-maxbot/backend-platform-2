'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Plus, Minus, Trophy, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface CoinContextType {
  coins: number;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  getTransactionHistory: () => Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'bet_win' | 'bet_lose' | 'daily_bonus';
  amount: number;
  description: string;
  timestamp: number;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const useCoinSystem = () => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error('useCoinSystem must be used within a CoinProvider');
  }
  return context;
};

interface CoinProviderProps {
  children: ReactNode;
}

export const CoinProvider: React.FC<CoinProviderProps> = ({ children }) => {
  const [coins, setCoins] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load coins and transactions from localStorage
    const savedCoins = localStorage.getItem('game-coins');
    const savedTransactions = localStorage.getItem('game-transactions');
    const lastDailyBonus = localStorage.getItem('last-daily-bonus');
    
    if (savedCoins) {
      setCoins(parseInt(savedCoins));
    } else {
      // Give initial coins to new users
      setCoins(1000);
      addTransaction({
        type: 'daily_bonus',
        amount: 1000,
        description: 'مكافأة المستخدم الجديد'
      });
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    
    // Check for daily bonus
    const today = new Date().toDateString();
    if (lastDailyBonus !== today) {
      setTimeout(() => {
        addCoins(100);
        addTransaction({
          type: 'daily_bonus',
          amount: 100,
          description: 'مكافأة يومية'
        });
        localStorage.setItem('last-daily-bonus', today);
        toast.success('🎁 حصلت على مكافأة يومية: 100 عملة ذهبية!');
      }, 2000);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('game-coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('game-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addCoins = (amount: number) => {
    setCoins(prev => prev + amount);
  };

  const spendCoins = (amount: number): boolean => {
    if (coins >= amount) {
      setCoins(prev => prev - amount);
      return true;
    }
    return false;
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setTransactions(prev => [newTransaction, ...prev].slice(0, 50)); // Keep only last 50 transactions
  };

  const getTransactionHistory = () => transactions;

  return (
    <CoinContext.Provider value={{
      coins,
      addCoins,
      spendCoins,
      getTransactionHistory,
      addTransaction
    }}>
      {children}
    </CoinContext.Provider>
  );
};

// Coin Display Component
export const CoinDisplay: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { coins } = useCoinSystem();
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Coins className="h-5 w-5 text-yellow-500" />
      <span className="font-bold text-yellow-600 dark:text-yellow-400">
        {coins.toLocaleString()}
      </span>
    </div>
  );
};

// Coin Management Panel
export const CoinManagementPanel: React.FC = () => {
  const { coins, addCoins, spendCoins, getTransactionHistory, addTransaction } = useCoinSystem();
  const [showHistory, setShowHistory] = useState(false);
  const transactions = getTransactionHistory();

  const handleAddCoins = (amount: number) => {
    addCoins(amount);
    addTransaction({
      type: 'earn',
      amount,
      description: `إضافة ${amount} عملة ذهبية`
    });
    toast.success(`تم إضافة ${amount} عملة ذهبية!`);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'earn':
      case 'bet_win':
      case 'daily_bonus':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'spend':
      case 'bet_lose':
        return <Minus className="h-4 w-4 text-red-500" />;
      default:
        return <Coins className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'earn':
      case 'bet_win':
      case 'daily_bonus':
        return 'text-green-600 dark:text-green-400';
      case 'spend':
      case 'bet_lose':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-yellow-500" />
            رصيد العملات الذهبية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
              {coins.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">عملة ذهبية</div>
            
            {/* Quick Actions */}
            <div className="flex justify-center gap-2 flex-wrap">
              <Button
                onClick={() => handleAddCoins(100)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                100
              </Button>
              <Button
                onClick={() => handleAddCoins(500)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                500
              </Button>
              <Button
                onClick={() => handleAddCoins(1000)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Gift className="h-4 w-4" />
                1000
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>سجل المعاملات</CardTitle>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              variant="ghost"
              size="sm"
            >
              {showHistory ? 'إخفاء' : 'عرض'}
            </Button>
          </div>
        </CardHeader>
        {showHistory && (
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  لا توجد معاملات بعد
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="font-medium text-sm">
                          {transaction.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleString('ar-SA')}
                        </div>
                      </div>
                    </div>
                    <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'spend' || transaction.type === 'bet_lose' ? '-' : '+'}
                      {transaction.amount}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            الإنجازات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant={coins >= 1000 ? 'default' : 'secondary'} className="p-2 justify-center">
              💰 جامع الذهب
              <br />
              <span className="text-xs">1000+ عملة</span>
            </Badge>
            <Badge variant={coins >= 5000 ? 'default' : 'secondary'} className="p-2 justify-center">
              👑 ملك الذهب
              <br />
              <span className="text-xs">5000+ عملة</span>
            </Badge>
            <Badge variant={transactions.length >= 10 ? 'default' : 'secondary'} className="p-2 justify-center">
              📈 متداول نشط
              <br />
              <span className="text-xs">10+ معاملة</span>
            </Badge>
            <Badge variant={transactions.filter(t => t.type === 'bet_win').length >= 5 ? 'default' : 'secondary'} className="p-2 justify-center">
              🎯 محظوظ
              <br />
              <span className="text-xs">5+ انتصارات</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoinProvider;