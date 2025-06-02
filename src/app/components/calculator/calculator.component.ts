
import { Component, HostListener, inject, signal } from '@angular/core';

import { DisplayComponent } from '../display/display.component';
import { KeypadComponent } from '../keypad/keypad.component';
import { QuizComponent } from '../quiz/quiz.component';
import { HistoryDrawerComponent } from '../history-drawer/history-drawer.component';

import { CalculatorService } from '../../services/calculator.service';
import { AppMode } from '../../models/calculator.types';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [
    DisplayComponent,
    KeypadComponent,
    QuizComponent,
    HistoryDrawerComponent
  ],
  template: `
    <div class="calculator-app-card animate-pop">

      <!-- Mode Selection -->
      <div
        class="mode-tabs"
        role="tablist"
        aria-label="Choose learning mode"
      >
        <button
          type="button"
          class="tab-btn"
          [class.active]="activeMode() === 'calculator'"
          [attr.aria-selected]="activeMode() === 'calculator'"
          (click)="setMode('calculator')"
        >
          🔢 Calculator
        </button>

        <button
          type="button"
          class="tab-btn"
          [class.active]="activeMode() === 'quiz'"
          [attr.aria-selected]="activeMode() === 'quiz'"
          (click)="setMode('quiz')"
        >
          🎮 Play & Learn
        </button>
      </div>

      <!-- Active Mode -->
      <div class="card-body">
        @switch (activeMode()) {

          @case ('calculator') {
            <app-display />
            <app-keypad />
          }

          @case ('quiz') {
            <app-quiz />
          }

        }
      </div>

      <!-- History -->
      <app-history-drawer />

    </div>
  `,

  styles: [`
    @use '../../../styles/variables' as *;

    :host {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 100%;
      height: 100%;

      padding: 16px;
    }

    .calculator-app-card {
      position: relative;

      display: flex;
      flex-direction: column;
      gap: 16px;

      width: 100%;
      max-width: 440px;
      max-height: 96dvh;

      padding: 20px;

      border-radius: $radius-xl;

      @include glass-panel;

      overflow-y: auto;
      overflow-x: hidden;
    }

    /* -------------------------
       Mode Tabs
    ------------------------- */

    .mode-tabs {
      display: flex;
      gap: 4px;

      padding: 4px;

      background: rgba(0, 0, 0, 0.08);
      border-radius: $radius-pill;
    }

    .tab-btn {
      flex: 1;

      padding: 10px 14px;

      border: none;
      border-radius: $radius-pill;

      background: transparent;
      color: var(--text-color);

      font-family: $font-primary;
      font-size: 1rem;
      font-weight: 700;

      cursor: pointer;

      transition:
        background-color 0.25s ease,
        box-shadow 0.25s ease,
        transform 0.15s ease;

      &:hover {
        transform: translateY(-1px);
      }

      &:focus-visible {
        outline: 3px solid rgba(59, 130, 246, 0.4);
        outline-offset: 2px;
      }

      &.active {
        background: var(--card-bg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }
    }

    /* -------------------------
       Content
    ------------------------- */

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 14px;

      width: 100%;
    }

    /* -------------------------
       Mobile
    ------------------------- */

    @media (max-width: 480px) {
      :host {
        padding: 10px;
      }

      .calculator-app-card {
        padding: 14px;
        border-radius: $radius-lg;
      }

      .tab-btn {
        padding: 9px 10px;
        font-size: 0.9rem;
      }
    }
  `]
})
export class CalculatorComponent {

  private readonly calcService = inject(CalculatorService);

  readonly activeMode = signal<AppMode>('calculator');

  setMode(mode: AppMode): void {
    this.activeMode.set(mode);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyboardInput(event: KeyboardEvent): void {
    if (this.activeMode() !== 'calculator') {
      return;
    }

    this.handleCalculatorKey(event);
  }

  private handleCalculatorKey(event: KeyboardEvent): void {
    const { key } = event;

    // Numbers
    if (/^\d$/.test(key)) {
      this.calcService.inputDigit(key);
      return;
    }

    switch (key) {

      // Decimal
      case '.':
      case ',':
        this.calcService.inputDecimal();
        break;

      // Operators
      case '+':
      case '-':
        this.calcService.handleOperator(key);
        break;

      case '*':
        this.calcService.handleOperator('×');
        break;

      case '/':
        event.preventDefault();
        this.calcService.handleOperator('÷');
        break;

      // Calculate
      case 'Enter':
      case '=':
        event.preventDefault();
        this.calcService.calculateEquals();
        break;

      // Editing
      case 'Backspace':
        this.calcService.backspace();
        break;

      // Clear
      case 'Escape':
        this.calcService.clearAll();
        break;

      // Percentage
      case '%':
        this.calcService.percentage();
        break;
    }
  }
}
