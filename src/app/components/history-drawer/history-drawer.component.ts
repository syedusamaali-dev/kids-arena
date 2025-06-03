
import { Component, inject } from '@angular/core';

import { CalculatorService } from '../../services/calculator.service';
import { HistoryItem } from '../../models/calculator.types';

@Component({
  selector: 'app-history-drawer',
  standalone: true,
  imports: [],
  template: `
    @if (calcService.isDrawerOpen()) {

      <!-- Overlay -->
      <div
        class="drawer-overlay"
        role="presentation"
        (click)="closeDrawer()"
      ></div>

      <!-- Drawer -->
      <aside
        class="drawer-panel animate-pop"
        aria-label="Calculation history"
        role="dialog"
        aria-modal="true"
      >

        <!-- Header -->
        <header class="drawer-header">

          <div class="title">
            <span aria-hidden="true">📜</span>
            <span>Calculation History</span>
          </div>

          <button
            type="button"
            class="close-btn"
            aria-label="Close calculation history"
            title="Close Drawer"
            (click)="closeDrawer()"
          >
            ✕
          </button>

        </header>

        <!-- Body -->
        <div class="drawer-body">

          @if (calcService.history().length === 0) {

            <!-- Empty State -->
            <div class="empty-history">

              <div
                class="empty-icon"
                aria-hidden="true"
              >
                🎈
              </div>

              <p>No history yet!</p>

              <span class="sub">
                Do some fun math equations above!
              </span>

            </div>

          } @else {

            <!-- History List -->
            <div class="history-list">

              @for (
                item of calcService.history();
                track item.id
              ) {

                <button
                  type="button"
                  class="history-card"
                  title="Use this result"
                  (click)="useHistoryItem(item)"
                >

                  <span class="expr">
                    {{ item.expression }} =
                  </span>

                  <span class="res">
                    {{ item.result }}
                  </span>

                </button>

              }

            </div>

          }

        </div>

        <!-- Footer -->
        @if (calcService.history().length > 0) {

          <footer class="drawer-footer">

            <button
              type="button"
              class="clear-history-btn"
              (click)="clearHistory()"
            >
              🗑️ Clear History
            </button>

          </footer>

        }

      </aside>
    }
  `,

  styles: [`
    @use '../../../styles/variables' as *;

    /* =========================
       Overlay
    ========================= */

    .drawer-overlay {
      position: fixed;
      inset: 0;

      background: rgba(0, 0, 0, 0.35);

      backdrop-filter: blur(4px);

      z-index: 200;

      cursor: pointer;
    }

    /* =========================
       Drawer
    ========================= */

    .drawer-panel {
      position: fixed;

      top: 0;
      right: 0;
      bottom: 0;

      display: flex;
      flex-direction: column;

      width: 320px;
      max-width: 85vw;

      background: var(--card-bg);

      backdrop-filter: blur(20px);

      border-left: 3px solid var(--card-border);

      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);

      z-index: 210;

      overflow: hidden;
    }

    /* =========================
       Header
    ========================= */

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      flex-shrink: 0;

      padding: 18px 20px;

      border-bottom: 2px solid var(--card-border);
    }

    .title {
      display: flex;
      align-items: center;
      gap: 8px;

      color: var(--text-color);

      font-size: 1.1rem;
      font-weight: 700;
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 34px;
      height: 34px;

      padding: 0;

      border: none;
      border-radius: 50%;

      background: rgba(0, 0, 0, 0.08);

      color: var(--text-color);

      font-size: 1rem;
      font-weight: 700;

      cursor: pointer;

      transition:
        background-color 0.2s ease,
        transform 0.15s ease;

      &:hover {
        background: rgba(255, 118, 117, 0.3);
        transform: rotate(5deg);
      }

      &:focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
      }
    }

    /* =========================
       Body
    ========================= */

    .drawer-body {
      flex: 1;

      padding: 16px;

      overflow-y: auto;
      overscroll-behavior: contain;
    }

    /* =========================
       Empty State
    ========================= */

    .empty-history {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      height: 100%;

      padding: 20px;

      color: var(--text-muted);

      text-align: center;
    }

    .empty-icon {
      margin-bottom: 10px;

      font-size: 3rem;

      animation: float 2.5s ease-in-out infinite;
    }

    .empty-history p {
      margin: 0;

      font-size: 1.1rem;
      font-weight: 700;
    }

    .sub {
      margin-top: 5px;

      font-size: 0.85rem;

      opacity: 0.8;
    }

    /* =========================
       History List
    ========================= */

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* =========================
       History Card
    ========================= */

    .history-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      width: 100%;

      padding: 14px 16px;

      border: 2px solid var(--card-border);
      border-radius: $radius-md;

      background: rgba(255, 255, 255, 0.4);

      color: var(--text-color);

      font-family: inherit;

      text-align: left;

      cursor: pointer;

      transition:
        transform 0.2s ease,
        background-color 0.2s ease,
        border-color 0.2s ease;

      &:hover {
        transform: translateY(-2px);

        background: rgba(255, 255, 255, 0.7);

        border-color: var(--accent-color);
      }

      &:focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
      }
    }

    .expr {
      color: var(--text-muted);

      font-size: 0.9rem;
      font-weight: 600;

      word-break: break-all;
    }

    .res {
      margin-top: 2px;

      color: var(--text-color);

      font-size: 1.4rem;
      font-weight: 700;

      word-break: break-all;
    }

    /* =========================
       Footer
    ========================= */

    .drawer-footer {
      flex-shrink: 0;

      padding: 16px;

      border-top: 2px solid var(--card-border);
    }

    .clear-history-btn {
      width: 100%;

      padding: 12px;

      border: none;
      border-radius: $radius-pill;

      background: #ff7675;
      color: #ffffff;

      font-family: $font-primary;
      font-size: 0.95rem;
      font-weight: 700;

      cursor: pointer;

      @include bouncy-interactive;

      &:focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
      }
    }

    /* =========================
       Animation
    ========================= */

    @keyframes float {
      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-6px);
      }
    }

    /* =========================
       Mobile
    ========================= */

    @media (max-width: 480px) {
      .drawer-panel {
        width: min(320px, 90vw);
      }

      .drawer-header {
        padding: 16px;
      }

      .drawer-body {
        padding: 12px;
      }

      .drawer-footer {
        padding: 12px;
      }
    }
  `]
})
export class HistoryDrawerComponent {

  readonly calcService = inject(CalculatorService);

  closeDrawer(): void {
    if (this.calcService.isDrawerOpen()) {
      this.calcService.toggleDrawer();
    }
  }

  useHistoryItem(item: HistoryItem): void {
    this.calcService.useHistoryItem(item);
  }

  clearHistory(): void {
    this.calcService.clearHistory();
  }
}

