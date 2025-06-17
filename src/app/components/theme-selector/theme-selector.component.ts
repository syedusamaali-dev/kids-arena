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

      <!-- Theme Trigger -->
      <button
        type="button"
        class="theme-trigger-btn"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="true"
        title="Change Theme"
        (click)="toggleDropdown()"
      >
        <span class="theme-icon" aria-hidden="true">
          {{ activeThemeIcon }}
        </span>

        <span class="theme-label">
          Theme
        </span>
      </button>

      @if (isOpen()) {

        <!-- Backdrop -->
        <div
          class="theme-backdrop"
          aria-hidden="true"
          (click)="closeDropdown()"
        ></div>

        <!-- Dropdown -->
        <div
          class="theme-dropdown animate-pop"
          role="menu"
          aria-label="Choose your theme"
        >

          <div class="dropdown-header">
            Choose Your Theme 🎨
          </div>

          <div class="theme-options">

            @for (theme of themes; track theme.id) {

              <button
                type="button"
                class="theme-option-btn"
                role="menuitem"
                [class.active]="currentTheme === theme.id"
                [attr.aria-current]="currentTheme === theme.id ? 'true' : null"
                (click)="selectTheme(theme.id)"
              >

                <span
                  class="t-icon"
                  aria-hidden="true"
                >
                  {{ theme.icon }}
                </span>

                <span class="t-name">
                  {{ theme.name }}
                </span>

                <span
                  class="t-badge"
                  [style.background-color]="theme.previewColor"
                  aria-hidden="true"
                ></span>

              </button>

            }

          </div>

        </div>
      }

    </div>
  `,

  styles: [`
    @use '../../../styles/variables' as *;

    :host {
      display: inline-block;
    }

    .theme-selector-wrapper {
      position: relative;
    }

    /* --------------------------------
       Theme Trigger
    -------------------------------- */

    .theme-trigger-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;

      padding: 6px 14px;

      border-radius: $radius-pill;
      border: 2px solid var(--card-border);

      background: var(--card-bg);
      color: var(--text-color);

      font-family: $font-primary;
      font-weight: 600;
      font-size: 0.9rem;

      cursor: pointer;

      box-shadow:
        0 4px 10px rgba(0, 0, 0, 0.08);

      @include bouncy-interactive;

      .theme-icon {
        font-size: 1.2rem;
        line-height: 1;
      }

      .theme-label {
        line-height: 1;
      }
    }

    /* --------------------------------
       Background Overlay
    -------------------------------- */

    .theme-backdrop {
      position: fixed;
      inset: 0;

      background: transparent;

      z-index: 90;
    }

    /* --------------------------------
       Dropdown
    -------------------------------- */

    .theme-dropdown {
      position: absolute;

      top: calc(100% + 8px);
      right: 0;

      width: 220px;
      max-width: calc(100vw - 24px);

      padding: 14px;

      border-radius: $radius-md;

      @include glass-panel;

      z-index: 100;
    }

    /* --------------------------------
       Header
    -------------------------------- */

    .dropdown-header {
      margin-bottom: 10px;

      text-align: center;

      font-size: 0.85rem;
      font-weight: 700;

      text-transform: uppercase;
      letter-spacing: 0.5px;

      color: var(--text-muted);
    }

    /* --------------------------------
       Theme List
    -------------------------------- */

    .theme-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* --------------------------------
       Theme Option
    -------------------------------- */

    .theme-option-btn {
      width: 100%;

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

      transition:
        transform 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: translateX(4px);
      }

      &:focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
      }

      &.active {
        border-color: var(--accent-color);

        background: var(--card-bg);

        box-shadow:
          0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .t-icon {
        width: 26px;

        display: flex;
        justify-content: center;

        font-size: 1.3rem;
        line-height: 1;
      }

      .t-name {
        flex: 1;

        text-align: left;
      }

      .t-badge {
        flex-shrink: 0;

        width: 14px;
        height: 14px;

        border-radius: 50%;

        border: 2px solid #ffffff;

        box-shadow:
          0 1px 4px rgba(0, 0, 0, 0.15);
      }
    }

    /* --------------------------------
       Mobile
    -------------------------------- */

    @media (max-width: 480px) {

      .theme-label {
        display: none;
      }

      .theme-trigger-btn {
        width: 38px;
        height: 38px;
        padding: 0;
      }

      .theme-dropdown {
        width: 210px;
      }
    }

    /* --------------------------------
       Reduced Motion
    -------------------------------- */

    @media (prefers-reduced-motion: reduce) {

      .theme-option-btn {
        transition: none;

        &:hover {
          transform: none;
        }
      }
    }
  `]
})
export class ThemeSelectorComponent {

  private readonly themeService = inject(ThemeService);

  readonly isOpen = signal(false);

  /**
   * Available themes.
   */
  get themes() {
    return this.themeService.themes;
  }

  /**
   * Currently selected theme.
   */
  get currentTheme(): ThemeMode {
    return this.themeService.currentTheme();
  }

  /**
   * Icon of the currently selected theme.
   */
  get activeThemeIcon(): string {
    const currentTheme = this.currentTheme;

    return (
      this.themes.find(theme => theme.id === currentTheme)?.icon
      ?? '🎨'
    );
  }

  /**
   * Toggle theme menu.
   */
  toggleDropdown(): void {
    this.isOpen.update(open => !open);
  }

  /**
   * Close theme menu.
   */
  closeDropdown(): void {
    this.isOpen.set(false);
  }

  /**
   * Select a theme.
   */
  selectTheme(theme: ThemeMode): void {
    this.themeService.setTheme(theme);
    this.closeDropdown();
  }
}