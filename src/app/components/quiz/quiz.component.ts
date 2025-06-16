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
      <!-- Quiz Header -->
      <div class="quiz-header">
        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-badge stars" title="Total Stars Earned">
            <span class="icon">⭐</span>
            <span class="val">{{ stars }}</span>
          </div>

          <div class="stat-badge score" title="Current Score">
            <span class="icon">🏆</span>
            <span class="val">{{ score }}</span>
          </div>

          @if (streak > 1) {
            <div class="stat-badge streak animate-wiggle" title="Current Streak">
              <span class="icon">🔥</span>
              <span class="val">{{ streak }}x Streak!</span>
            </div>
          }
        </div>

        <!-- Difficulty -->
        <div class="difficulty-pills">
          <button
            type="button"
            class="diff-btn"
            [class.active]="difficulty === 'easy'"
            (click)="setDifficulty('easy')"
          >
            🌱 Easy
          </button>

          <button
            type="button"
            class="diff-btn"
            [class.active]="difficulty === 'medium'"
            (click)="setDifficulty('medium')"
          >
            🚀 Medium
          </button>

          <button
            type="button"
            class="diff-btn"
            [class.active]="difficulty === 'hard'"
            (click)="setDifficulty('hard')"
          >
            🔥 Hard
          </button>
        </div>
      </div>

      <!-- Question -->
      @if (question; as q) {
        <div class="question-card">
          <div class="question-title">Solve the Puzzle!</div>

          <div class="question-expression">
            {{ q.num1 }}
            {{ q.operator }}
            {{ q.num2 }}
            =
            <span class="q-mark">?</span>
          </div>
        </div>

        <!-- Options -->
        <div class="options-grid">
          @for (option of q.options; track option) {
            <button
              type="button"
              class="option-card"
              [class.correct]="isAnswered && option === q.answer"
              [class.wrong]="isAnswered && selectedAnswer === option && option !== q.answer"
              [disabled]="isAnswered"
              (click)="submitAnswer(option)"
            >
              {{ option }}
            </button>
          }
        </div>

        <!-- Feedback -->
        @if (isAnswered) {
          <div class="feedback-section animate-pop">
            @if (isCorrect) {
              <div class="feedback-msg success">🎉 Super Job! That's Correct!</div>
            } @else {
              <div class="feedback-msg error">
                💡 Good try! The correct answer was {{ q.answer }}.
              </div>
            }

            <button type="button" class="next-question-btn" (click)="nextQuestion()">
              Next Question ➡️
            </button>
          </div>
        }
      }
    </div>
  `,

  styles: [
    `
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

        &.stars {
          background: var(--badge-bg);
        }

        &.streak {
          background: #ff7675;
          color: #ffffff;
        }
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
          cursor: pointer;

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
      }

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
        cursor: pointer;

        @include bouncy-interactive;

        &:disabled {
          cursor: default;
        }

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

      .feedback-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        margin-top: 6px;
      }

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
        cursor: pointer;

        @include bouncy-interactive;
      }

      @media (max-width: 480px) {
        .stats-row {
          gap: 6px;
        }

        .stat-badge {
          padding: 6px 9px;
          font-size: 0.8rem;
        }

        .question-card {
          padding: 20px 12px;
        }

        .question-expression {
          font-size: 2.2rem;
        }

        .option-card {
          height: 62px;
          font-size: 1.8rem;
        }
      }
    `,
  ],
})
export class QuizComponent implements OnInit {
  private readonly quiz = inject(QuizService);

  readonly difficulties: QuizDifficulty[] = ['easy', 'medium', 'hard'];

  ngOnInit(): void {
    if (!this.quiz.currentQuestion()) {
      this.quiz.generateNewQuestion();
    }
  }

  get stars(): number {
    return this.quiz.stars();
  }

  get score(): number {
    return this.quiz.score();
  }

  get streak(): number {
    return this.quiz.streak();
  }

  get difficulty(): QuizDifficulty {
    return this.quiz.difficulty();
  }

  get question() {
    return this.quiz.currentQuestion();
  }

  get isAnswered(): boolean {
    return this.quiz.isAnswered();
  }

  get isCorrect(): boolean {
    return this.quiz.isCorrect() ?? false;
  }

  get selectedAnswer(): number | null {
    return this.quiz.selectedAnswer();
  }

  setDifficulty(difficulty: QuizDifficulty): void {
    this.quiz.setDifficulty(difficulty);
  }

  submitAnswer(answer: number): void {
    this.quiz.submitAnswer(answer);
  }

  nextQuestion(): void {
    this.quiz.generateNewQuestion();
  }
}
