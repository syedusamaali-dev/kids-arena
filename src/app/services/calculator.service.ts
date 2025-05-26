import { Injectable, signal, inject } from '@angular/core';
import { HistoryItem, MascotMood } from '../models/calculator.types';
import { AudioService } from './audio.service';
import { SpeechService } from './speech.service';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private audioService = inject(AudioService);
  private speechService = inject(SpeechService);

  readonly displayValue = signal<string>('0');
  readonly equationTrace = signal<string>('');
  readonly mascotMood = signal<MascotMood>('happy');
  readonly history = signal<HistoryItem[]>([]);
  readonly isDrawerOpen = signal<boolean>(false);

  private firstOperand: number | null = null;
  private operator: string | null = null;
  private waitingForSecondOperand = false;

  constructor() {
    const savedHistory = localStorage.getItem('kids_calc_history');
    if (savedHistory) {
      try {
        this.history.set(JSON.parse(savedHistory));
      } catch {
        // Fallback
      }
    }
  }

  toggleDrawer() {
    this.isDrawerOpen.set(!this.isDrawerOpen());
  }

  inputDigit(digit: string) {
    // Audio pitch variation based on digit
    const pitch = 350 + (parseInt(digit, 10) || 0) * 35;
    this.audioService.playPop(pitch);

    if (this.waitingForSecondOperand) {
      this.displayValue.set(digit);
      this.waitingForSecondOperand = false;
    } else {
      const current = this.displayValue();
      if (current === '0') {
        this.displayValue.set(digit);
      } else if (current.length < 12) { // Limit length for kid friendly display
        this.displayValue.set(current + digit);
      }
    }

    this.mascotMood.set('thinking');
  }

  inputDecimal() {
    this.audioService.playPop(550);
    if (this.waitingForSecondOperand) {
      this.displayValue.set('0.');
      this.waitingForSecondOperand = false;
      return;
    }

    const current = this.displayValue();
    if (!current.includes('.')) {
      this.displayValue.set(current + '.');
    }
  }

  handleOperator(nextOperator: string) {
    this.audioService.playOperator();
    const inputValue = parseFloat(this.displayValue());

    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } else if (this.operator && !this.waitingForSecondOperand) {
      const result = this.performCalculation(this.firstOperand, inputValue, this.operator);
      if (result === 'Error') {
        this.handleError();
        return;
      }
      this.displayValue.set(String(result));
      this.firstOperand = typeof result === 'number' ? result : parseFloat(result);
    }

    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
    this.equationTrace.set(`${this.firstOperand} ${nextOperator}`);
    this.mascotMood.set('thinking');

    this.speechService.speak(`${this.displayValue()} ${nextOperator}`);
  }

  calculateEquals() {
    if (this.firstOperand === null || this.operator === null) return;

    const secondOperand = parseFloat(this.displayValue());
    const result = this.performCalculation(this.firstOperand, secondOperand, this.operator);

    if (result === 'Error') {
      this.handleError();
      return;
    }

    const resultStr = String(result);
    const fullEq = `${this.firstOperand} ${this.operator} ${secondOperand} =`;

    this.audioService.playEquals();
    this.equationTrace.set(fullEq);
    this.displayValue.set(resultStr);

    this.mascotMood.set('celebrating');

    // Speech feedback
    this.speechService.speak(`${fullEq} ${resultStr}`);

    // Add to history
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: `${this.firstOperand} ${this.operator} ${secondOperand}`,
      result: resultStr,
      timestamp: new Date()
    };
    const updatedHistory = [newItem, ...this.history().slice(0, 19)];
    this.history.set(updatedHistory);
    localStorage.setItem('kids_calc_history', JSON.stringify(updatedHistory));

    // Reset state for next calculation
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = true;
  }

  clearAll() {
    this.audioService.playClear();
    this.displayValue.set('0');
    this.equationTrace.set('');
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
    this.mascotMood.set('happy');
  }

  clearEntry() {
    this.audioService.playPop(300);
    this.displayValue.set('0');
  }

  backspace() {
    this.audioService.playPop(320);
    const current = this.displayValue();
    if (current.length > 1) {
      this.displayValue.set(current.slice(0, -1));
    } else {
      this.displayValue.set('0');
    }
  }

  toggleSign() {
    this.audioService.playPop(480);
    const val = parseFloat(this.displayValue());
    if (val !== 0) {
      this.displayValue.set(String(-val));
    }
  }

  percentage() {
    this.audioService.playPop(520);
    const val = parseFloat(this.displayValue());
    const res = val / 100;
    this.displayValue.set(String(res));
  }

  useHistoryItem(item: HistoryItem) {
    this.audioService.playPop(600);
    this.displayValue.set(item.result);
    this.equationTrace.set(item.expression + ' =');
    this.isDrawerOpen.set(false);
  }

  clearHistory() {
    this.history.set([]);
    localStorage.removeItem('kids_calc_history');
  }

  private performCalculation(op1: number, op2: number, operator: string): number | 'Error' {
    switch (operator) {
      case '+': return this.roundResult(op1 + op2);
      case '-': return this.roundResult(op1 - op2);
      case '×':
      case '*': return this.roundResult(op1 * op2);
      case '÷':
      case '/':
        if (op2 === 0) return 'Error';
        return this.roundResult(op1 / op2);
      default: return op2;
    }
  }

  private roundResult(val: number): number {
    return Math.round(val * 1000000) / 1000000;
  }

  private handleError() {
    this.audioService.playError();
    this.displayValue.set('Oops!');
    this.equationTrace.set('Cannot divide by 0');
    this.mascotMood.set('error');
    this.speechService.speak('Oops! Cannot divide by zero!');
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = true;
  }
}
