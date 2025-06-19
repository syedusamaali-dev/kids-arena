import { Injectable, inject, signal } from '@angular/core';
import {
  HistoryItem,
  MascotMood
} from '../models/calculator.types';
import { AudioService } from './audio.service';
import { SpeechService } from './speech.service';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  private readonly audioService = inject(AudioService);
  private readonly speechService = inject(SpeechService);

  // ============================================================
  // PUBLIC STATE
  // ============================================================

  readonly displayValue = signal<string>('0');
  readonly equationTrace = signal<string>('');
  readonly mascotMood = signal<MascotMood>('happy');
  readonly history = signal<HistoryItem[]>([]);
  readonly isDrawerOpen = signal<boolean>(false);

  // ============================================================
  // CALCULATOR STATE
  // ============================================================

  private firstOperand: number | null = null;
  private operator: string | null = null;
  private waitingForSecondOperand = false;

  private readonly historyStorageKey = 'kids_calc_history';
  private readonly maxHistoryItems = 20;
  private readonly maxDisplayLength = 12;

  constructor() {
    this.loadHistory();
  }

  // ============================================================
  // DRAWER
  // ============================================================

  toggleDrawer(): void {
    this.isDrawerOpen.update(open => !open);
  }

  // ============================================================
  // INPUT
  // ============================================================

  inputDigit(digit: string): void {

    if (!/^\d$/.test(digit)) {
      return;
    }

    const pitch = 350 + Number(digit) * 35;

    this.audioService.playPop(pitch);

    if (this.waitingForSecondOperand) {
      this.displayValue.set(digit);
      this.waitingForSecondOperand = false;
    } else {

      const current = this.displayValue();

      if (current === '0') {
        this.displayValue.set(digit);
      } else if (current.length < this.maxDisplayLength) {
        this.displayValue.update(value => value + digit);
      }
    }

    this.mascotMood.set('thinking');
  }

  inputDecimal(): void {

    this.audioService.playPop(550);

    if (this.waitingForSecondOperand) {
      this.displayValue.set('0.');
      this.waitingForSecondOperand = false;
      return;
    }

    const current = this.displayValue();

    if (!current.includes('.')) {
      this.displayValue.set(`${current}.`);
    }
  }

  // ============================================================
  // OPERATORS
  // ============================================================

  handleOperator(nextOperator: string): void {

    if (!this.isValidOperator(nextOperator)) {
      return;
    }

    this.audioService.playOperator();

    const inputValue = this.getDisplayNumber();

    if (this.firstOperand === null) {

      this.firstOperand = inputValue;

    } else if (
      this.operator !== null &&
      !this.waitingForSecondOperand
    ) {

      const result = this.performCalculation(
        this.firstOperand,
        inputValue,
        this.operator
      );

      if (result === 'Error') {
        this.handleError();
        return;
      }

      this.displayValue.set(String(result));
      this.firstOperand = result;
    }

    this.operator = nextOperator;
    this.waitingForSecondOperand = true;

    this.equationTrace.set(
      `${this.formatNumber(this.firstOperand)} ${nextOperator}`
    );

    this.mascotMood.set('thinking');

    this.speechService.speak(
      `${this.formatNumber(this.firstOperand)} ${nextOperator}`
    );
  }

  // ============================================================
  // CALCULATION
  // ============================================================

  calculateEquals(): void {

    if (
      this.firstOperand === null ||
      this.operator === null
    ) {
      return;
    }

    const secondOperand = this.getDisplayNumber();

    const result = this.performCalculation(
      this.firstOperand,
      secondOperand,
      this.operator
    );

    if (result === 'Error') {
      this.handleError();
      return;
    }

    const resultStr = String(result);

    const expression =
      `${this.formatNumber(this.firstOperand)} ` +
      `${this.operator} ` +
      `${this.formatNumber(secondOperand)}`;

    const fullEquation = `${expression} =`;

    this.audioService.playEquals();

    this.displayValue.set(resultStr);
    this.equationTrace.set(fullEquation);
    this.mascotMood.set('celebrating');

    this.speechService.speak(
      `${fullEquation} ${resultStr}`
    );

    this.addToHistory(
      expression,
      resultStr
    );

    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = true;
  }

  // ============================================================
  // CALCULATOR ACTIONS
  // ============================================================

  clearAll(): void {

    this.audioService.playClear();

    this.displayValue.set('0');
    this.equationTrace.set('');

    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;

    this.mascotMood.set('happy');
  }

  clearEntry(): void {

    this.audioService.playPop(300);

    this.displayValue.set('0');
  }

  backspace(): void {

    this.audioService.playPop(320);

    const current = this.displayValue();

    if (
      current.length > 1 &&
      current !== 'Oops!'
    ) {
      this.displayValue.set(
        current.slice(0, -1)
      );
    } else {
      this.displayValue.set('0');
    }
  }

  toggleSign(): void {

    this.audioService.playPop(480);

    const value = this.getDisplayNumber();

    if (value !== 0) {
      this.displayValue.set(
        this.formatNumber(-value)
      );
    }
  }

  percentage(): void {

    this.audioService.playPop(520);

    const value = this.getDisplayNumber();
    const result = value / 100;

    this.displayValue.set(
      this.formatNumber(result)
    );
  }

  // ============================================================
  // HISTORY
  // ============================================================

  useHistoryItem(item: HistoryItem): void {

    this.audioService.playPop(600);

    this.displayValue.set(item.result);
    this.equationTrace.set(
      `${item.expression} =`
    );

    this.isDrawerOpen.set(false);

    this.mascotMood.set('happy');
  }

  clearHistory(): void {

    this.history.set([]);

    this.removeHistoryFromStorage();
  }

  // ============================================================
  // CALCULATION ENGINE
  // ============================================================

  private performCalculation(
    op1: number,
    op2: number,
    operator: string
  ): number | 'Error' {

    switch (operator) {

      case '+':
        return this.roundResult(op1 + op2);

      case '-':
        return this.roundResult(op1 - op2);

      case '×':
      case '*':
        return this.roundResult(op1 * op2);

      case '÷':
      case '/':
        if (op2 === 0) {
          return 'Error';
        }

        return this.roundResult(op1 / op2);

      default:
        return op2;
    }
  }

  private roundResult(value: number): number {

    return Math.round(
      (value + Number.EPSILON) * 1_000_000
    ) / 1_000_000;
  }

  // ============================================================
  // HISTORY MANAGEMENT
  // ============================================================

  private addToHistory(
    expression: string,
    result: string
  ): void {

    const item: HistoryItem = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      expression,
      result,
      timestamp: new Date()
    };

    const updatedHistory = [
      item,
      ...this.history()
    ].slice(0, this.maxHistoryItems);

    this.history.set(updatedHistory);

    this.saveHistory(updatedHistory);
  }

  private loadHistory(): void {

    if (typeof window === 'undefined') {
      return;
    }

    try {

      const saved =
        localStorage.getItem(
          this.historyStorageKey
        );

      if (!saved) {
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        this.history.set(parsed);
      }

    } catch {
      this.history.set([]);
    }
  }

  private saveHistory(
    history: HistoryItem[]
  ): void {

    if (typeof window === 'undefined') {
      return;
    }

    try {

      localStorage.setItem(
        this.historyStorageKey,
        JSON.stringify(history)
      );

    } catch {
      // Ignore storage errors.
    }
  }

  private removeHistoryFromStorage(): void {

    if (typeof window === 'undefined') {
      return;
    }

    try {

      localStorage.removeItem(
        this.historyStorageKey
      );

    } catch {
      // Ignore storage errors.
    }
  }

  // ============================================================
  // ERROR HANDLING
  // ============================================================

  private handleError(): void {

    this.audioService.playError();

    this.displayValue.set('Oops!');
    this.equationTrace.set(
      'Cannot divide by 0'
    );

    this.mascotMood.set('error');

    this.speechService.speak(
      'Oops! Cannot divide by zero!'
    );

    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = true;
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private getDisplayNumber(): number {

    const value = Number(
      this.displayValue()
    );

    return Number.isFinite(value)
      ? value
      : 0;
  }

  private formatNumber(
    value: number | null
  ): string {

    if (value === null) {
      return '0';
    }

    return String(value);
  }

  private isValidOperator(
    operator: string
  ): boolean {

    return [
      '+',
      '-',
      '×',
      '÷',
      '*',
      '/'
    ].includes(operator);
  }
}