
export enum Market {
  FOREX = 'Forex',
  CRYPTO = 'Crypto',
  STOCKS = 'Stocks',
  FUTURES = 'Futures',
  OPTIONS = 'Options'
}

export interface TradingSession {
  id: string;
  userId: string;
  username: string;
  date: string; // ISO string
  market: Market;
  duration: number; // in minutes
  pnl: number;
  notes?: string;
  isPublished: boolean;

}

export interface User {
  id: string;
  username: string;
  handle: string;
  avatar: string;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  activeDays: string[]; // ISO Date strings (YYYY-MM-DD)
}
