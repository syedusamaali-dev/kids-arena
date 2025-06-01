import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from '../../services/calculator.service';
import { HistoryItem } from '../../models/calculator.types';

@Component({
  selector: 'app-history-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (calcService.isDrawerOpen()) {
      <div class="drawer-overlay" (click)="calcService.toggleDrawer()"></div>
      <div class="drawer-panel animate-pop">
        <div class="drawer-header">
          <div class="title">
            <span>📜</span> Calculation History
          </div>
          <button class="close-btn" (click)="calcService.toggleDrawer()" title="Close Drawer">✕</button>
        </div>

        <div class="drawer-body">
          @if (calcService.history().length === 0) {
            <div class="empty-history">
              <div class="empty-icon">🎈</div>
              <p>No history yet!</p>
              <span class="sub">Do some fun math equations above!</span>
            </div>
          } @else {
            <div class="history-list">
              @for (item of calcService.history(); track item.id) {
                <div class="history-card" (click)="calcService.useHistoryItem(item)" title="Tap to use result">
                  <div class="expr">{{ item.expression }} =</div>
                  <div class="res">{{ item.result }}</div>
                </div>
              }
            </div>
          }
        </div>

        @if (calcService.history().length > 0) {
          <div class="drawer-footer">
            <button class="clear-history-btn" (click)="calcService.clearHistory()">
              🗑️ Clear History
            </button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(4px);
      z-index: 200;
    }

    .drawer-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 320px;
      max-width: 85vw;
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      border-left: 3px solid var(--card-border);
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
      z-index: 210;
      display: flex;
      flex-direction: column;
    }

    .drawer-header {
      padding: 18px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid var(--card-border);

      .title {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--text-color);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .close-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: rgba(0, 0, 0, 0.08);
        color: var(--text-color);
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;

        &:hover {
          background: rgba(255, 118, 117, 0.3);
        }
      }
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .empty-history {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--text-muted);

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 10px;
      }

      p {
        font-weight: 700;
        font-size: 1.1rem;
      }

      .sub {
        font-size: 0.85rem;
        opacity: 0.8;
      }
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .history-card {
      padding: 14px 16px;
      border-radius: $radius-md;
      background: rgba(255, 255, 255, 0.4);
      border: 2px solid var(--card-border);
      cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease;

      &:hover {
        transform: scale(1.02);
        background: rgba(255, 255, 255, 0.7);
      }

      .expr {
        font-size: 0.9rem;
        color: var(--text-muted);
        font-weight: 600;
      }

      .res {
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text-color);
        margin-top: 2px;
      }
    }

    .drawer-footer {
      padding: 16px;
      border-top: 2px solid var(--card-border);

      .clear-history-btn {
        width: 100%;
        padding: 12px;
        border-radius: $radius-pill;
        border: none;
        background: #ff7675;
        color: #ffffff;
        font-family: $font-primary;
        font-weight: 700;
        font-size: 0.95rem;
        @include bouncy-interactive;
      }
    }
  `]
})
export class HistoryDrawerComponent {
  calcService = inject(CalculatorService);
}
