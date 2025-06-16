import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizService } from '../../services/quiz.service';
import { QuizDifficulty } from '../../models/calculator.types';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quiz-container animate-pop">
      <!-- Quiz Header Controls -->
      <div class="quiz-header">
        <div class="stats-row">
          <div class="stat-badge stars" title="Total Stars Earned">
            <span class="icon">⭐</span>
            <span class="val">{{ quizService.stars() }}</span>
          </div>

          <div class="stat-badge score" title="Current Score">
            <span class="icon">🏆</span>
            <span class="val">{{ quizService.score() }}</span>
          </div>

          @if (quizService.streak() > 1) {
            <div class="stat-badge streak animate-wiggle" title="Current Streak">
              <span class="icon">🔥</span>
              <span class="val">{{ quizService.streak() }}x Streak!</span>
            </div>
          }
        </div>

        <!-- Difficulty Pills -->
        <div class="difficulty-pills">
          <button 
            class="diff-btn" 
            [class.active]="quizService.difficulty() === 'easy'" 
            (click)="quizService.setDifficulty('easy')"
          >
            🌱 Easy
          </button>
          <button 
            class="diff-btn" 
            [class.active]="quizService.difficulty() === 'medium'" 
            (click)="quizService.setDifficulty('medium')"
          >
            🚀 Medium
          </button>
          <button 
            class="diff-btn" 
            [class.active]="quizService.difficulty() === 'hard'" 
            (click)="quizService.setDifficulty('hard')"
          >
            🔥 Hard
          </button>
        </div>
      </div>

      <!-- Question Card -->
      @if (quizService.currentQuestion(); as q) {
        <div class="question-card">
          <div class="question-title">Solve the Puzzle!</div>
          <div class="question-expression">
            {{ q.num1 }} {{ q.operator }} {{ q.num2 }} = <span class="q-mark">?</span>
          </div>
        </div>

        <!-- Multiple Choice Grid -->
        <div class="options-grid">
          @for (option of q.options; track option) {
            <button 
              class="option-card"
              [class.correct]="quizService.isAnswered() && option === q.answer"
              [class.wrong]="quizService.isAnswered() && quizService.selectedAnswer() === option && option !== q.answer"
              [disabled]="quizService.isAnswered()"
              (click)="quizService.submitAnswer(option)"
            >
              {{ option }}
            </button>
          }
        </div>

        <!-- Result Feedback Banner & Next Button -->
        @if (quizService.isAnswered()) {
          <div class="feedback-section animate-pop">
            @if (quizService.isCorrect()) {
              <div class="feedback-msg success">
                🎉 Super Job! That's Correct!
              </div>
            } @else {
              <div class="feedback-msg error">
                💡 Good try! The correct answer was {{ q.answer }}.
              </div>
            }

            <button class="next-question-btn" (click)="quizService.generateNewQuestion()">
              Next Question ➡️
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    @use '../../../styles/variables' as *;

    .quiz-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .quiz-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .stats-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .stat-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: $radius-pill;
      background: var(--card-bg);
      border: 2px solid var(--card-border);
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-color);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

      &.stars { background: var(--badge-bg); }
      &.streak { background: #ff7675; color: #ffffff; }
    }

    .difficulty-pills {
      display: flex;
      gap: 8px;
      justify-content: center;

      .diff-btn {
        flex: 1;
        padding: 8px 12px;
        border-radius: $radius-pill;
        border: 2px solid var(--card-border);
        background: rgba(255, 255, 255, 0.3);
        color: var(--text-color);
        font-family: $font-primary;
        font-weight: 700;
        font-size: 0.85rem;
        @include bouncy-interactive;

        &.active {
          background: var(--accent-color);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 4px 12px var(--accent-glow);
        }
      }
    }

    .question-card {
      padding: 24px;
      border-radius: $radius-lg;
      background: var(--display-bg);
      border: 3px solid var(--card-border);
      color: var(--display-text);
      text-align: center;
      box-shadow: inset 0 6px 15px rgba(0, 0, 0, 0.3);

      .question-title {
        font-size: 0.9rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--display-trace);
        margin-bottom: 8px;
      }

      .question-expression {
        font-size: 2.8rem;
        font-weight: 700;
        font-family: $font-mono;

        .q-mark {
          color: #fde047;
          animation: pulseStar 1.5s infinite;
        }
      }
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .option-card {
        height: 70px;
        border-radius: $radius-md;
        background: var(--btn-number-bg);
        border: 3px solid var(--btn-number-border);
        color: var(--btn-number-text);
        font-family: $font-mono;
        font-size: 2.2rem;
        font-weight: 700;
        box-shadow: $shadow-button-default;
        @include bouncy-interactive;

        &.correct {
          background: #00b894 !important;
          color: #ffffff !important;
          border-color: #55efc4 !important;
          animation: celebrateBounce 0.5s ease-in-out;
        }

        &.wrong {
          background: #d63031 !important;
          color: #ffffff !important;
          border-color: #ff7675 !important;
          animation: errorShake 0.4s ease-in-out;
        }
      }
    }

    .feedback-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin-top: 6px;

      .feedback-msg {
        width: 100%;
        padding: 12px;
        border-radius: $radius-md;
        font-weight: 700;
        text-align: center;
        font-size: 1.05rem;

        &.success {
          background: rgba(0, 184, 148, 0.2);
          border: 2px solid #00b894;
          color: #00b894;
        }

        &.error {
          background: rgba(214, 48, 49, 0.2);
          border: 2px solid #d63031;
          color: #d63031;
        }
      }

      .next-question-btn {
        width: 100%;
        padding: 14px;
        border-radius: $radius-pill;
        border: none;
        background: var(--btn-equals-bg);
        color: #ffffff;
        font-family: $font-primary;
        font-weight: 700;
        font-size: 1.1rem;
        @include bouncy-interactive;
      }
    }
  `]
})
export class QuizComponent implements OnInit {
  quizService = inject(QuizService);

  ngOnInit() {
    if (!this.quizService.currentQuestion()) {
      this.quizService.generateNewQuestion();
    }
  }
}
