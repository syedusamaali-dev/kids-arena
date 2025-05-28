import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from '../../services/calculator.service';
import { AudioService } from '../../services/audio.service';
import { SpeechService } from '../../services/speech.service';
import { MascotComponent } from '../mascot/mascot.component';
import { ThemeSelectorComponent } from '../theme-selector/theme-selector.component';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule, MascotComponent, ThemeSelectorComponent],
  template: `
    <div class="display-container">
      <!-- Top Action Bar -->
      <div class="top-bar">
        <app-theme-selector></app-theme-selector>

        <div class="action-tools">
          <!-- Audio Sound Toggle -->
          <button 
            class="tool-btn" 
            [class.muted]="audioService.isMuted()" 
            (click)="audioService.toggleMute()"
            [title]="audioService.isMuted() ? 'Unmute Sound' : 'Mute Sound'"
          >
            {{ audioService.isMuted() ? '🔇' : '🔊' }}
          </button>

          <!-- Speech Readout Toggle -->
          <button 
            class="tool-btn" 
            [class.active]="speechService.isSpeechEnabled()" 
            (click)="speechService.toggleSpeech()"
            [title]="speechService.isSpeechEnabled() ? 'Voice Readout On' : 'Voice Readout Off'"
          >
            🗣️
          </button>

          <!-- History Drawer Toggle -->
          <button class="tool-btn" (click)="calcService.toggleDrawer()" title="View History">
            📜
          </button>
        </div>
      </div>

      <!-- Display Screen & Mascot Layout -->
      <div class="screen-card">
        <app-mascot [mood]="calcService.mascotMood()"></app-mascot>

        <div class="numbers-wrapper">
          <div class="equation-trace">
            {{ calcService.equationTrace() || ' ' }}
          </div>

          <div class="main-display" [ngClass]="getFontSizeClass()">
            {{ calcService.displayValue() }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .display-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

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

    .tool-btn {
      width: 38px;
      height: 38px;
      border-radius: $radius-pill;
      border: 2px solid var(--card-border);
      background: var(--card-bg);
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      @include bouncy-interactive;

      &.muted {
        opacity: 0.6;
      }

      &.active {
        border-color: var(--accent-color);
        background: var(--badge-bg);
      }
    }

    .screen-card {
      width: 100%;
      padding: 16px 20px;
      border-radius: $radius-lg;
      background: var(--display-bg);
      box-shadow: inset 0 6px 15px rgba(0, 0, 0, 0.4), 0 10px 25px rgba(0, 0, 0, 0.15);
      border: 3px solid var(--card-border);
      display: flex;
      align-items: center;
      gap: 16px;
      min-height: 110px;
    }

    .numbers-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      overflow: hidden;
    }

    .equation-trace {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--display-trace);
      min-height: 1.4rem;
      letter-spacing: 0.5px;
      word-break: break-all;
    }

    .main-display {
      font-weight: 700;
      color: var(--display-text);
      font-family: $font-mono;
      line-height: 1.1;
      letter-spacing: 1px;
      transition: font-size 0.2s ease;
      word-break: break-all;
      text-align: right;
      width: 100%;

      &.font-lg { font-size: 2.8rem; }
      &.font-md { font-size: 2.2rem; }
      &.font-sm { font-size: 1.7rem; }
      &.font-xs { font-size: 1.3rem; }
    }
  `]
})
export class DisplayComponent {
  calcService = inject(CalculatorService);
  audioService = inject(AudioService);
  speechService = inject(SpeechService);

  getFontSizeClass(): string {
    const len = this.calcService.displayValue().length;
    if (len > 12) return 'font-xs';
    if (len > 9) return 'font-sm';
    if (len > 6) return 'font-md';
    return 'font-lg';
  }
}
