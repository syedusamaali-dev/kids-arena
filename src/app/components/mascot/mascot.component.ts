
import { Component, input } from '@angular/core';

import { MascotMood } from '../../models/calculator.types';

@Component({
  selector: 'app-mascot',
  standalone: true,
  imports: [],
  template: `
    <div
      class="mascot-container"
      [class.mood-happy]="mood() === 'happy'"
      [class.mood-thinking]="mood() === 'thinking'"
      [class.mood-celebrating]="mood() === 'celebrating'"
      [class.mood-error]="mood() === 'error'"
      role="img"
      [attr.aria-label]="mascotLabel"
    >

      <!-- Antenna -->
      <div class="antenna" aria-hidden="true">
        <div class="antenna-ball"></div>
        <div class="antenna-stick"></div>
      </div>

      <!-- Mascot Head -->
      <div class="mascot-head" aria-hidden="true">

        <!-- Eyes -->
        <div class="eyes">
          <div class="eye left">
            <div class="pupil"></div>
          </div>

          <div class="eye right">
            <div class="pupil"></div>
          </div>
        </div>

        <!-- Mouth -->
        <div class="mouth">

          @switch (mood()) {

            @case ('happy') {
              <div class="mouth-happy"></div>
            }

            @case ('thinking') {
              <div class="mouth-thinking"></div>
            }

            @case ('celebrating') {
              <div class="mouth-celebrate"></div>
            }

            @case ('error') {
              <div class="mouth-error"></div>
            }

          }

        </div>

        <!-- Cheeks -->
        <div class="cheek left"></div>
        <div class="cheek right"></div>

      </div>

    </div>
  `,

  styles: [`
    @use '../../../styles/variables' as *;
    @use '../../../styles/animations' as *;

    /* =========================
       Host
    ========================= */

    :host {
      display: inline-block;
      flex-shrink: 0;
    }

    /* =========================
       Mascot Container
    ========================= */

    .mascot-container {
      position: relative;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      width: 70px;
      height: 70px;

      animation: floatMascot 4s ease-in-out infinite;

      &.mood-celebrating {
        animation: celebrateBounce 0.6s ease-in-out infinite alternate;
      }

      &.mood-error {
        animation: errorShake 0.4s ease-in-out infinite;
      }
    }

    /* =========================
       Antenna
    ========================= */

    .antenna {
      display: flex;
      flex-direction: column;
      align-items: center;

      margin-bottom: -3px;
    }

    .antenna-ball {
      width: 14px;
      height: 14px;

      border-radius: 50%;

      background: var(--btn-equals-bg);

      box-shadow: 0 0 10px var(--accent-glow);
    }

    .antenna-stick {
      width: 3px;
      height: 8px;

      background: var(--text-color);

      opacity: 0.7;
    }

    /* =========================
       Mascot Head
    ========================= */

    .mascot-head {
      position: relative;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;

      width: 58px;
      height: 52px;

      padding: 4px;

      border: 3px solid var(--card-border);
      border-radius: 20px;

      background: var(--card-bg);

      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
    }

    /* =========================
       Eyes
    ========================= */

    .eyes {
      display: flex;
      gap: 12px;
    }

    .eye {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 11px;
      height: 11px;

      border-radius: 50%;

      background: var(--text-color);
    }

    .pupil {
      width: 4px;
      height: 4px;

      border-radius: 50%;

      background: #ffffff;

      transform: translate(-1px, -1px);
    }

    /* =========================
       Cheeks
    ========================= */

    .cheek {
      position: absolute;

      top: 24px;

      width: 8px;
      height: 5px;

      border-radius: 50%;

      background: #ff7675;

      opacity: 0.6;

      &.left {
        left: 5px;
      }

      &.right {
        right: 5px;
      }
    }

    /* =========================
       Mouth
    ========================= */

    .mouth {
      margin-top: -2px;
    }

    .mouth-happy {
      width: 14px;
      height: 7px;

      border-bottom: 3px solid var(--text-color);
      border-radius: 0 0 10px 10px;
    }

    .mouth-thinking {
      width: 10px;
      height: 10px;

      border: 2.5px solid var(--text-color);
      border-radius: 50%;
    }

    .mouth-celebrate {
      width: 16px;
      height: 10px;

      border-radius: 0 0 10px 10px;

      background: #ff7675;
    }

    .mouth-error {
      width: 14px;
      height: 7px;

      border-top: 3px solid #e74c3c;
      border-radius: 10px 10px 0 0;
    }

    /* =========================
       Reduced Motion
    ========================= */

    @media (prefers-reduced-motion: reduce) {
      .mascot-container {
        animation: none !important;
      }
    }

    /* =========================
       Small Screens
    ========================= */

    @media (max-width: 360px) {
      .mascot-container {
        transform: scale(0.9);
        transform-origin: center;
      }
    }
  `]
})
export class MascotComponent {

  readonly mood = input<MascotMood>('happy');

  get mascotLabel(): string {
    switch (this.mood()) {
      case 'thinking':
        return 'Mascot is thinking';

      case 'celebrating':
        return 'Mascot is celebrating';

      case 'error':
        return 'Mascot looks confused';

      case 'happy':
      default:
        return 'Happy mascot';
    }
  }
}

