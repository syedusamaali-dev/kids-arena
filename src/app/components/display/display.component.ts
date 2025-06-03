
import { Component, inject } from '@angular/core';

import { CalculatorService } from '../../services/calculator.service';
import { AudioService } from '../../services/audio.service';
import { SpeechService } from '../../services/speech.service';

import { MascotComponent } from '../mascot/mascot.component';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [
    MascotComponent,
    ThemeSelectorComponent
  ],
  template: `
    <div class="display-container">

      <!-- Top Action Bar -->
      <div class="top-bar">

        <app-theme-selector />

        <div class="action-tools">

          <!-- Sound Toggle -->
          <button
            type="button"
            class="tool-btn"
            [class.muted]="audioService.isMuted()"
            [attr.aria-label]="
              audioService.isMuted()
                ? 'Unmute sound'
                : 'Mute sound'
            "
            [title]="
              audioService.isMuted()
                ? 'Unmute Sound'
                : 'Mute Sound'
            "
            (click)="audioService.toggleMute()"
          >
            {{ audioService.isMuted() ? '🔇' : '🔊' }}
          </button>

          <!-- Speech Toggle -->
          <button
            type="button"
            class="tool-btn"
            [class.active]="speechService.isSpeechEnabled()"
            [attr.aria-pressed]="speechService.isSpeechEnabled()"
            [attr.aria-label]="
              speechService.isSpeechEnabled()
                ? 'Disable voice readout'
                : 'Enable voice readout'
            "
            [title]="
              speechService.isSpeechEnabled()
                ? 'Voice Readout On'
                : 'Voice Readout Off'
            "
            (click)="speechService.toggleSpeech()"
          >
            🗣️
          </button>

          <!-- History Toggle -->
          <button
            type="button"
            class="tool-btn"
            aria-label="View calculation history"
            title="View History"
            (click)="calcService.toggleDrawer()"
          >
            📜
          </button>

        </div>
      </div>

      <!-- Calculator Display -->
      <div class="screen-card">

        <!-- Mascot -->
        <app-mascot
          [mood]="calcService.mascotMood()"
        />

        <!-- Numbers -->
        <div class="numbers-wrapper">

          <div class="equation-trace">
            {{ calcService.equationTrace() || ' ' }}
          </div>

          <div
            class="main-display"
            [class.font-lg]="fontSizeClass === 'font-lg'"
            [class.font-md]="fontSizeClass === 'font-md'"
            [class.font-sm]="fontSizeClass === 'font-sm'"
            [class.font-xs]="fontSizeClass === 'font-xs'"
            aria-live="polite"
            aria-atomic="true"
          >
            {{ calcService.displayValue() }}
          </div>

        </div>

      </div>

    </div>
  `,

  styles: [`
    @use '../../../styles/variables' as *;

    /* =========================
       Display Container
    ========================= */

    .display-container {
      display: flex;
      flex-direction: column;
      gap: 12px;

      width: 100%;
    }

    /* =========================
       Top Bar
    ========================= */

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;

      width: 100%;
    }

    .action-tools {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* =========================
       Action Buttons
    ========================= */

    .tool-btn {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 38px;
      height: 38px;

      padding: 0;

      border: 2px solid var(--card-border);
      border-radius: $radius-pill;

      background: var(--card-bg);

      font-size: 1.1rem;

      cursor: pointer;

      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

      @include bouncy-interactive;

      &:focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
      }

      &.muted {
        opacity: 0.6;
      }

      &.active {
        border-color: var(--accent-color);
        background: var(--badge-bg);
      }
    }

    /* =========================
       Calculator Screen
    ========================= */

    .screen-card {
      display: flex;
      align-items: center;

      width: 100%;
      min-height: 110px;

      gap: 16px;

      padding: 16px 20px;

      border: 3px solid var(--card-border);
      border-radius: $radius-lg;

      background: var(--display-bg);

      box-shadow:
        inset 0 6px 15px rgba(0, 0, 0, 0.4),
        0 10px 25px rgba(0, 0, 0, 0.15);

      overflow: hidden;
    }

    /* =========================
       Numbers
    ========================= */

    .numbers-wrapper {
      display: flex;
      flex: 1;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;

      min-width: 0;

      overflow: hidden;
    }

    .equation-trace {
      width: 100%;
      min-height: 1.4rem;

      color: var(--display-trace);

      font-size: 0.95rem;
      font-weight: 600;

      letter-spacing: 0.5px;

      text-align: right;

      word-break: break-all;

      overflow: hidden;
    }

    .main-display {
      width: 100%;

      color: var(--display-text);

      font-family: $font-mono;
      font-weight: 700;

      line-height: 1.1;
      letter-spacing: 1px;

      text-align: right;

      word-break: break-all;

      transition: font-size 0.2s ease;

      &.font-lg {
        font-size: 2.8rem;
      }

      &.font-md {
        font-size: 2.2rem;
      }

      &.font-sm {
        font-size: 1.7rem;
      }

      &.font-xs {
        font-size: 1.3rem;
      }
    }

    /* =========================
       Mobile
    ========================= */

    @media (max-width: 480px) {
      .screen-card {
        gap: 10px;
        padding: 14px;
      }

      .action-tools {
        gap: 6px;
      }

      .tool-btn {
        width: 34px;
        height: 34px;

        font-size: 1rem;
      }

      .equation-trace {
        font-size: 0.8rem;
      }

      .main-display {
        &.font-lg {
          font-size: 2.3rem;
        }

        &.font-md {
          font-size: 1.9rem;
        }

        &.font-sm {
          font-size: 1.5rem;
        }

        &.font-xs {
          font-size: 1.2rem;
        }
      }
    }
  `]
})
export class DisplayComponent {

  readonly calcService = inject(CalculatorService);
  readonly audioService = inject(AudioService);
  readonly speechService = inject(SpeechService);

  get fontSizeClass(): string {
    const length = this.calcService.displayValue().length;

    if (length > 12) {
      return 'font-xs';
    }

    if (length > 9) {
      return 'font-sm';
    }

    if (length > 6) {
      return 'font-md';
    }

    return 'font-lg';
  }
}

