export type ThemeMode = 'theme-rainbow' | 'theme-cosmic' | 'theme-dino' | 'theme-candy';

export type MascotMood = 'happy' | 'thinking' | 'celebrating' | 'error' | 'sleepy';

export type AppMode = 'calculator' | 'quiz';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷';
  answer: number;
  options: number[];
}
