
import { Component, inject } from '@angular/core';

import { CalculatorService } from '../../services/calculator.service';

@Component({
  selector: 'app-keypad',
  standalone: true,
  imports: [],
  template: `
    <div
      class="keypad-grid"
      aria-label="Calculator keypad"
    >

      <!-- Row 1: Actions -->
      <button
        type="button"
        class="btn btn-action"
        aria-label="Clear all"
        title="Clear All"
        (click)="clearAll()"
      >
        C
      </button>

      <button
        type="button"
        class="btn btn-action"
        aria-label="Backspace"
        title="Backspace"
        (click)="backspace()"
      >
        ⌫
      </button>

      <button
        type="button"
        class="btn btn-action"
        aria-label="Percentage"
        title="Percentage"
        (click)="percentage()"
      >
        %
      </button>

      <button
        type="button"
        class="btn btn-operator"
        aria-label="Divide"
        title="Divide"
        (click)="operator('÷')"
      >
        ÷
      </button>

      <!-- Row 2 -->
      <button
        type="button"
        class="btn btn-number"
        aria-label="7"
        (click)="digit('7')"
      >
        7
      </button>

      <button
        type="button"
        class="btn btn-number"
        aria-label="8"
        (click)="digit('8')"
      >
        8
      </button>

      <button
        type="button"
        class="btn btn-number"
        aria-label="9"
        (click)="digit('9')"
      >
        9
      </button>

      <button
        type="button"
        class="btn btn-operator"
        aria-label="Multiply"
        title="Multiply"
        (click)="operator('×')"
      >
        ×
      </button>

      <!-- Row 3 -->
      <button
        type="button"
        class="btn btn-number"
        aria-label="4"
        (click)="digit('4')"
      >
        4
      </button>

      <button
        type="button"
        class="btn btn-number"
        aria-label="5"
        (click)="digit('5')"
      >
        5
      </button>

      <button
        type="button"
        class="btn btn-number"
        aria-label="6"
        (click)="digit('6')"
      >
        6
      </button>

      <button
        type="button"
        class="btn btn-operator"
        aria-label="Subtract"
        title="Subtract"
        (click)="operator('-')"
      >
        −
      </button>

      <!-- Row 4 -->
      <button
        type="button"
        class="btn btn-number"
        aria-label="1"
        (click)="digit('1')"
      >
        1
      </button>

      <button
        type="button"
        class="btn btn-number"
        aria-label="2"
        (click)="digit('2')"
      >
        2
      </button>

      <button
        type="button"
        class="btn btn-number"
        aria-label="3"
        (click)="digit('3')"
      >
        3
      </button>

      <button
        type="button"
        class="btn btn-operator"
        aria-label="Add"
        title="Add"
        (click)="operator('+')"
      >
        +
      </button>

      <!-- Row 5 -->
      <button
        type="button"
        class="btn btn-action"
        aria-label="Toggle positive or negative"
        title="Toggle Sign"
        (click)="toggleSign()"
      >
        ±
      </button>

      <button
        type="button"
        class="btn btn-number"
        aria-label="0"
        (click)="digit('0')"
      >
        0
      </button>

      <button
        type="button"
        class="btn btn-number"
        aria-label="Decimal point"
        title="Decimal"
        (click)="decimal()"
      >
        .
      </button>

      <button
        type="button"
        class="btn btn-equals"
        aria-label="Calculate"
        title="Calculate"
        (click)="calculate()"
      >
        =
      </button>

    </div>
  `,

  styles: [`
    @use '../../../styles/variables' as *;

    /* =========================
       Keypad
    ========================= */

    .keypad-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;

      width: 100%;

      margin-top: 8px;
    }

    /* =========================
       Base Button
    ========================= */

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 62px;

      padding: 0;

      border: 2px solid transparent;
      border-radius: $radius-md;

      font-family: $font-primary;
      font-size: 1.6rem;
      font-weight: 700;

      cursor: pointer;

      box-shadow: $shadow-button-default;

      user-select: none;

      @include bouncy-interactive;

      &:focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }

    /* =========================
       Number Buttons
    ========================= */

    .btn-number {
      background: var(--btn-number-bg);
      color: var(--btn-number-text);
      border-color: var(--btn-number-border);
    }

    /* =========================
       Operator Buttons
    ========================= */

    .btn-operator {
      background: var(--btn-operator-bg);
      color: var(--btn-operator-text);

      font-size: 1.9rem;
    }

    /* =========================
       Action Buttons
    ========================= */

    .btn-action {
      background: var(--btn-action-bg);
      color: var(--btn-action-text);

      font-size: 1.4rem;
    }

    /* =========================
       Equals Button
    ========================= */

    .btn-equals {
      background: var(--btn-equals-bg);
      color: var(--btn-equals-text);

      font-size: 2.2rem;
    }

    /* =========================
       Short Screens
    ========================= */

    @media (max-height: 680px) {
      .btn {
        height: 52px;
        font-size: 1.4rem;
      }

      .btn-operator {
        font-size: 1.6rem;
      }

      .btn-action {
        font-size: 1.2rem;
      }

      .btn-equals {
        font-size: 1.9rem;
      }
    }

    /* =========================
       Mobile
    ========================= */

    @media (max-width: 480px) {
      .keypad-grid {
        gap: 8px;
      }

      .btn {
        height: 58px;
      }
    }

    @media (max-width: 360px) {
      .keypad-grid {
        gap: 6px;
      }

      .btn {
        height: 52px;
        font-size: 1.35rem;
      }

      .btn-operator {
        font-size: 1.55rem;
      }

      .btn-action {
        font-size: 1.15rem;
      }

      .btn-equals {
        font-size: 1.8rem;
      }
    }
  `]
})
export class KeypadComponent {

  private readonly calcService = inject(CalculatorService);

  digit(value: string): void {
    this.calcService.inputDigit(value);
  }

  decimal(): void {
    this.calcService.inputDecimal();
  }

  operator(value: '÷' | '×' | '-' | '+'): void {
    this.calcService.handleOperator(value);
  }

  clearAll(): void {
    this.calcService.clearAll();
  }

  backspace(): void {
    this.calcService.backspace();
  }

  percentage(): void {
    this.calcService.percentage();
  }

  toggleSign(): void {
    this.calcService.toggleSign();
  }

  calculate(): void {
    this.calcService.calculateEquals();
  }
}

