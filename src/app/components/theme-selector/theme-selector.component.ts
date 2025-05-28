import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ThemeMode } from '../../models/calculator.types';

@Component({
  selector: 'app-theme-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-selector-wrapper">
      <button class="theme-trigger-btn" (click)="toggleDropdown()" title="Change Theme">
        <span class="theme-icon">{{ getActiveThemeIcon() }}</span>
        <span class="theme-label">Theme</span>
      </button>

      @if (isOpen()) {
        <div class="theme-backdrop" (click)="isOpen.set(false)"></div>
        <div class="theme-dropdown animate-pop">
          <div class="dropdown-header">Choose Your Theme 🎨</div>
          <div class="theme-options">
            @for (t of themeService.themes; track t.id) {
              <button 
                class="theme-option-btn" 
                [class.active]="themeService.currentTheme() === t.id"
                (click)="selectTheme(t.id)"
              >
                <span class="t-icon">{{ t.icon }}</span>
                <span class="t-name">{{ t.name }}</span>
                <span class="t-badge" [style.background]="t.previewColor"></span>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .theme-selector-wrapper {
      position: relative;
    }

    .theme-trigger-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: $radius-pill;
      background: var(--card-bg);
      border: 2px solid var(--card-border);
      color: var(--text-color);
      font-family: $font-primary;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      @include bouncy-interactive;

      .theme-icon {
        font-size: 1.2rem;
      }
    }

    .theme-backdrop {
      position: fixed;
      inset: 0;
      z-index: 90;
    }

    .theme-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 220px;
      padding: 14px;
      border-radius: $radius-md;
      @include glass-panel;
      z-index: 100;

      .dropdown-header {
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-muted);
        margin-bottom: 10px;
        text-align: center;
      }

      .theme-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .theme-option-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        border-radius: $radius-sm;
        border: 2px solid transparent;
        background: rgba(255, 255, 255, 0.2);
        color: var(--text-color);
        font-family: $font-primary;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.4);
          transform: translateX(4px);
        }

        &.active {
          border-color: var(--accent-color);
          background: var(--card-bg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .t-icon {
          font-size: 1.3rem;
        }

        .t-name {
          flex: 1;
          text-align: left;
        }

        .t-badge {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #ffffff;
        }
      }
    }
  `]
})
export class ThemeSelectorComponent {
  themeService = inject(ThemeService);
  readonly isOpen = signal<boolean>(false);

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  selectTheme(theme: ThemeMode) {
    this.themeService.setTheme(theme);
    this.isOpen.set(false);
  }

  getActiveThemeIcon(): string {
    const current = this.themeService.currentTheme();
    const found = this.themeService.themes.find(t => t.id === current);
    return found ? found.icon : '🎨';
  }
}
