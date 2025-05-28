import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule, 
    DisplayComponent, 
    KeypadComponent, 
    QuizComponent, 
    HistoryDrawerComponent
  ],
  template: `
    <div class="calculator-app-card animate-pop">
      <!-- Mode Tabs (Calculator vs Quiz Game) -->
      <div class="mode-tabs">
        <button 
          class="tab-btn" 
          [class.active]="activeMode() === 'calculator'"
          (click)="setMode('calculator')"
        >
          🔢 Calculator
        </button>
        <button 
          class="tab-btn" 
          [class.active]="activeMode() === 'quiz'"
          (click)="setMode('quiz')"
        >
          🎮 Play & Learn
        </button>
      </div>

      <!-- Mode Content View -->
      <div class="card-body">
        @if (activeMode() === 'calculator') {
          <app-display></app-display>
          <app-keypad></app-keypad>
        } @else {
          <app-quiz></app-quiz>
        }
      </div>

      <!-- History Drawer Overlay -->
      <app-history-drawer></app-history-drawer>
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
      width: 100%;
      max-width: 440px;
      padding: 20px;
      border-radius: $radius-xl;
      @include glass-panel;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      max-height: 96dvh;
      overflow-y: auto;
    }

    .mode-tabs {
      display: flex;
      background: rgba(0, 0, 0, 0.08);
      padding: 4px;
      border-radius: $radius-pill;

      .tab-btn {
        flex: 1;
        padding: 10px 14px;
        border-radius: $radius-pill;
        border: none;
        background: transparent;
        color: var(--text-color);
        font-family: $font-primary;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.25s ease;

        &.active {
          background: var(--card-bg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          color: var(--text-color);
        }
      }
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
    }

    @media (max-width: 480px) {
      .calculator-app-card {
        padding: 14px;
        border-radius: $radius-lg;
      }
    }
  `]
})
export class CalculatorComponent {
  calcService = inject(CalculatorService);
  readonly activeMode = signal<AppMode>('calculator');

  setMode(mode: AppMode) {
    this.activeMode.set(mode);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.activeMode() !== 'calculator') return;

    const key = event.key;

    if (/\d/.test(key)) {
      this.calcService.inputDigit(key);
    } else if (key === '.' || key === ',') {
      this.calcService.inputDecimal();
    } else if (key === '+') {
      this.calcService.handleOperator('+');
    } else if (key === '-') {
      this.calcService.handleOperator('-');
    } else if (key === '*') {
      this.calcService.handleOperator('×');
    } else if (key === '/') {
      event.preventDefault();
      this.calcService.handleOperator('÷');
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      this.calcService.calculateEquals();
    } else if (key === 'Backspace') {
      this.calcService.backspace();
    } else if (key === 'Escape') {
      this.calcService.clearAll();
    } else if (key === '%') {
      this.calcService.percentage();
    }
  }
}
