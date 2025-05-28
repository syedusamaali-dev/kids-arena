import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotMood } from '../../models/calculator.types';

@Component({
  selector: 'app-mascot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mascot-container" [ngClass]="'mood-' + mood()">
      <!-- Antenna -->
      <div class="antenna">
        <div class="antenna-ball"></div>
        <div class="antenna-stick"></div>
      </div>

      <!-- Mascot Face Head -->
      <div class="mascot-head">
        <!-- Eyes -->
        <div class="eyes">
          <div class="eye left">
            <div class="pupil"></div>
          </div>
          <div class="eye right">
            <div class="pupil"></div>
          </div>
        </div>

        <!-- Mouth Expression -->
        <div class="mouth">
          @if (mood() === 'happy') {
            <div class="mouth-happy"></div>
          } @else if (mood() === 'thinking') {
            <div class="mouth-thinking"></div>
          } @else if (mood() === 'celebrating') {
            <div class="mouth-celebrate"></div>
          } @else if (mood() === 'error') {
            <div class="mouth-error"></div>
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

    :host {
      display: inline-block;
    }

    .mascot-container {
      position: relative;
      width: 70px;
      height: 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: floatMascot 4s ease-in-out infinite;

      &.mood-celebrating {
        animation: celebrateBounce 0.6s ease-in-out infinite alternate;
      }

      &.mood-error {
        animation: errorShake 0.4s ease-in-out infinite;
      }
    }

    .antenna {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: -3px;

      .antenna-ball {
        width: 14px;
        height: 14px;
        background: var(--btn-equals-bg);
        border-radius: 50%;
        box-shadow: 0 0 10px var(--accent-glow);
      }

      .antenna-stick {
        width: 3px;
        height: 8px;
        background: var(--text-color);
        opacity: 0.7;
      }
    }

    .mascot-head {
      width: 58px;
      height: 52px;
      background: var(--card-bg);
      border: 3px solid var(--card-border);
      border-radius: 20px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      padding: 4px;
      position: relative;
    }

    .eyes {
      display: flex;
      gap: 12px;

      .eye {
        width: 11px;
        height: 11px;
        background: var(--text-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .pupil {
          width: 4px;
          height: 4px;
          background: #ffffff;
          border-radius: 50%;
          transform: translate(-1px, -1px);
        }
      }
    }

    .cheeks {
      position: absolute;
      width: 100%;
      top: 24px;
      display: flex;
      justify-content: space-between;
      padding: 0 6px;
    }

    .cheek {
      position: absolute;
      width: 8px;
      height: 5px;
      background: #ff7675;
      border-radius: 50%;
      opacity: 0.6;
      top: 24px;

      &.left { left: 5px; }
      &.right { right: 5px; }
    }

    .mouth {
      margin-top: -2px;

      .mouth-happy {
        width: 14px;
        height: 7px;
        border-bottom: 3px solid var(--text-color);
        border-radius: 0 0 10px 10px;
      }

      .mouth-thinking {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2.5px solid var(--text-color);
      }

      .mouth-celebrate {
        width: 16px;
        height: 10px;
        background: #ff7675;
        border-radius: 0 0 10px 10px;
      }

      .mouth-error {
        width: 14px;
        height: 7px;
        border-top: 3px solid #e74c3c;
        border-radius: 10px 10px 0 0;
      }
    }
  `]
})
export class MascotComponent {
  readonly mood = input<MascotMood>('happy');
}
