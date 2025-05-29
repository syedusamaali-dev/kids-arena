import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from '../../services/calculator.service';

@Component({
  selector: 'app-keypad',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="keypad-grid">
      <!-- Row 1 -->
      <button class="btn btn-action" (click)="calcService.clearAll()" title="Clear All">C</button>
      <button class="btn btn-action" (click)="calcService.backspace()" title="Backspace">⌫</button>
      <button class="btn btn-action" (click)="calcService.percentage()" title="Percentage">%</button>
      <button class="btn btn-operator" (click)="calcService.handleOperator('÷')" title="Divide">÷</button>

      <!-- Row 2 -->
      <button class="btn btn-number" (click)="calcService.inputDigit('7')">7</button>
      <button class="btn btn-number" (click)="calcService.inputDigit('8')">8</button>
      <button class="btn btn-number" (click)="calcService.inputDigit('9')">9</button>
      <button class="btn btn-operator" (click)="calcService.handleOperator('×')" title="Multiply">×</button>

      <!-- Row 3 -->
      <button class="btn btn-number" (click)="calcService.inputDigit('4')">4</button>
      <button class="btn btn-number" (click)="calcService.inputDigit('5')">5</button>
      <button class="btn btn-number" (click)="calcService.inputDigit('6')">6</button>
      <button class="btn btn-operator" (click)="calcService.handleOperator('-')" title="Subtract">-</button>

      <!-- Row 4 -->
      <button class="btn btn-number" (click)="calcService.inputDigit('1')">1</button>
      <button class="btn btn-number" (click)="calcService.inputDigit('2')">2</button>
      <button class="btn btn-number" (click)="calcService.inputDigit('3')">3</button>
      <button class="btn btn-operator" (click)="calcService.handleOperator('+')" title="Add">+</button>

      <!-- Row 5 -->
      <button class="btn btn-action" (click)="calcService.toggleSign()" title="Toggle Sign">±</button>
      <button class="btn btn-number" (click)="calcService.inputDigit('0')">0</button>
      <button class="btn btn-number" (click)="calcService.inputDecimal()">.</button>
      <button class="btn btn-equals" (click)="calcService.calculateEquals()" title="Calculate Equals">=</button>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .keypad-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      width: 100%;
      margin-top: 8px;
    }

    .btn {
      height: 62px;
      border-radius: $radius-md;
      font-family: $font-primary;
      font-size: 1.6rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid transparent;
      box-shadow: $shadow-button-default;
      @include bouncy-interactive;

      &.btn-number {
        background: var(--btn-number-bg);
        color: var(--btn-number-text);
        border-color: var(--btn-number-border);
      }

      &.btn-operator {
        background: var(--btn-operator-bg);
        color: var(--btn-operator-text);
        font-size: 1.9rem;
      }

      &.btn-action {
        background: var(--btn-action-bg);
        color: var(--btn-action-text);
        font-size: 1.4rem;
      }

      &.btn-equals {
        background: var(--btn-equals-bg);
        color: var(--btn-equals-text);
        font-size: 2.2rem;
      }
    }

    @media (max-height: 680px) {
      .btn {
        height: 52px;
        font-size: 1.4rem;
      }
    }
  `]
})
export class KeypadComponent {
  calcService = inject(CalculatorService);
}
