
import { Component, inject, OnInit } from '@angular/core';

import { QuizService } from '../../services/quiz.service';
import { QuizDifficulty } from '../../models/calculator.types';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [],
  template: `
    <div class="quiz-container animate-pop">

      <!-- =========================
           Quiz Header
      ========================= -->

      <div class="quiz-header">

        <!-- Stats -->
        <div
          class="stats-row"
          aria-label="Quiz statistics"
        >

          <div
            class="stat-badge stars"
            title="Total Stars Earned"
          >
            <span
              class="icon"
              aria-hidden="true"
            >
              ⭐
            </span>

            <span class="val">
              {{ quizService.stars() }}
            </span>
          </div>

          <div
            class="stat-badge score"
            title="Current Score"
          >
            <span
              class="icon"
              aria-hidden="true"
            >
              🏆
            </span>

            <span class="val">
              {{ quizService.score() }}
            </span>
          </div>

          @if (quizService.streak() > 1) {

            <div
              class="stat-badge streak animate-wiggle"
              title="Current Streak"
            >
              <span
                class="icon"
                aria-hidden="true"
              >
                🔥
              </span>

              <span class="val">
                {{ quizService.streak() }}x Streak!
              </span>
            </div>

          }

        </div>

        <!-- Difficulty -->
        <div
          class="difficulty-pills"
          role="group"
          aria-label="Quiz difficulty"
        >

          @for (difficulty of difficulties; track difficulty.value) {

            <button
              type="button"
              class="diff-btn"
              [class.active]="
                quizService.difficulty() === difficulty.value
              "
              [attr.aria-pressed]="
                quizService.difficulty() === difficulty.value
              "
              (click)="setDifficulty(difficulty.value)"
            >
              {{ difficulty.label }}
            </button>

          }

        </div>

      </div>

      <!-- =========================
           Question
      ========================= -->

      @if (quizService.currentQuestion(); as question) {

        <section
          class="question-card"
          aria-labelledby="question-title"
        >

          <div
            id="question-title"
            class="question-title"
          >
            Solve the Puzzle!
          </div>

          <div
            class="question-expression"
            aria-live="polite"
          >
            {{ question.num1 }}
            {{ question.operator }}
            {{ question.num2 }}
            =
            <span
              class="q-mark"
              aria-hidden="true"
            >
              ?
            </span>
          </div>

        </section>

        <!-- =========================
             Answer Options
        ========================= -->

        <div
          class="options-grid"
          role="group"
          aria-label="Answer choices"
        >

          @for (
            option of question.options;
            track option
          ) {

            <button
              type="button"
              class="option-card"
              [class.correct]="
                quizService.isAnswered() &&
                option === question.answer
              "
              [class.wrong]="
                quizService.isAnswered() &&
                quizService.selectedAnswer() === option &&
                option !== question.answer
              "
              [disabled]="quizService.isAnswered()"
              [attr.aria-label]="'Answer ' + option"
              (click)="submitAnswer(option)"
            >
              {{ option }}
            </button>

          }

        </div>

        <!-- =========================
             Answer Feedback
        ========================= -->

        @if (quizService.isAnswered()) {

          <div
            class="feedback-section animate-pop"
            aria-live="polite"
          >

            @if (quizService.isCorrect()) {

              <div class="feedback-msg success">
                🎉 Super Job! That's Correct!
              </div>

            } @else {

              <div class="feedback-msg error">
                💡 Good try!
                The correct answer was {{ question.answer }}.
              </div>

            }

            <button
              type="button"
              class="next-question-btn"
              (click)="nextQuestion()"
            >
              Next Question ➡️
            </button>

          </div>

        }

      }

    </div>
  `,

  styles: [`
    @use '../../../styles/variables' as *;

    /* =========================
       Container
    ========================= */

    .quiz-container {
      display: flex;
      flex-direction: column;
      gap: 16px;

      width: 100%;
    }

    /* =========================
       Header
    ========================= */

    .quiz-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* =========================
       Stats
    ========================= */

    .stats-row {
      display: flex;
      align-items: center;

      gap: 10px;

      width: 100%;
    }

    .stat-badge {
      display: flex;
      align-items: center;
      gap: 6px;

      padding: 6px 14px;

      border: 2px solid var(--card-border);
      border-radius: $radius-pill;

      background: var(--card-bg);
      color: var(--text-color);

      font-size: 0.95rem;
      font-weight: 700;

      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

      white-space: nowrap;

      &.stars {
        background: var(--badge-bg);
      }

      &.streak {
        margin-left: auto;

        background: #ff7675;
        color: #ffffff;
      }
    }

    .icon {
      display: inline-flex;
      align-items: center;
    }

    /* =========================
       Difficulty
    ========================= */

    .difficulty-pills {
      display: flex;
      justify-content: center;

      gap: 8px;

      width: 100%;
    }

    .diff-btn {
      flex: 1;

      padding: 8px 12px;

      border: 2px solid var(--card-border);
      border-radius: $radius-pill;

      background: rgba(255, 255, 255, 0.3);
      color: var(--text-color);

      font-family: $font-primary;
      font-size: 0.85rem;
      font-weight: 700;

      cursor: pointer;

      @include bouncy-interactive;

      &:focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
      }

      &.active {
        border-color: transparent;

        background: var(--accent-color);
        color: #ffffff;

        box-shadow: 0 4px 12px var(--accent-glow);
      }
    }

    /* =========================
       Question Card
    ========================= */

    .question-card {
      padding: 24px;

      border: 3px solid var(--card-border);
      border-radius: $radius-lg;

      background: var(--display-bg);
      color: var(--display-text);

      text-align: center;

      box-shadow: inset 0 6px 15px rgba(0, 0, 0, 0.3);
    }

    .question-title {
      margin-bottom: 8px;

      color: var(--display-trace);

      font-size: 0.9rem;
      font-weight: 700;

      letter-spacing: 1px;

      text-transform: uppercase;
    }

    .question-expression {
      font-family: $font-mono;
      font-size: 2.8rem;
      font-weight: 700;

      white-space: nowrap;
    }

    .q-mark {
      color: #fde047;

      animation: pulseStar 1.5s infinite;
    }

    /* =========================
       Options
    ========================= */

    .options-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));

      gap: 12px;
    }

    .option-card {
      display: flex;
      align-items: center;
      justify-content: center;

      height: 70px;

      padding: 8px;

      border: 3px solid var(--btn-number-border);
      border-radius: $radius-md;

      background: var(--btn-number-bg);
      color: var(--btn-number-text);

      font-family: $font-mono;
      font-size: 2.2rem;
      font-weight: 700;

      cursor: pointer;

      box-shadow: $shadow-button-default;

      @include bouncy-interactive;

      &:focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
      }

      &:disabled {
        cursor: default;
      }

      &.correct {
        border-color: #55efc4 !important;

        background: #00b894 !important;
        color: #ffffff !important;

        animation: celebrateBounce 0.5s ease-in-out;
      }

      &.wrong {
        border-color: #ff7675 !important;

        background: #d63031 !important;
        color: #ffffff !important;

        animation: errorShake 0.4s ease-in-out;
      }
    }

    /* =========================
       Feedback
    ========================= */

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

      font-size: 1.05rem;
      font-weight: 700;

      text-align: center;

      &.success {
        border: 2px solid #00b894;

        background: rgba(0, 184, 148, 0.2);
        color: #00b894;
      }

      &.error {
        border: 2px solid #d63031;

        background: rgba(214, 48, 49, 0.2);
        color: #d63031;
      }
    }

    /* =========================
       Next Question
    ========================= */

    .next-question-btn {
      width: 100%;

      padding: 14px;

      border: none;
      border-radius: $radius-pill;

      background: var(--btn-equals-bg);
      color: #ffffff;

      font-family: $font-primary;
      font-size: 1.1rem;
      font-weight: 700;

      cursor: pointer;

      @include bouncy-interactive;

      &:focus-visible {
        outline: 3px solid var(--accent-color);
        outline-offset: 2px;
      }
    }

    /* =========================
       Mobile
    ========================= */

    @media (max-width: 480px) {
      .stats-row {
        gap: 6px;
      }

      .stat-badge {
        padding: 6px 9px;

        font-size: 0.8rem;
      }

      .difficulty-pills {
        gap: 5px;
      }

      .diff-btn {
        padding: 7px 6px;

        font-size: 0.75rem;
      }

      .question-card {
        padding: 18px 12px;
      }

      .question-expression {
        font-size: 2.2rem;
      }

      .option-card {
        height: 62px;

        font-size: 1.8rem;
      }
    }

    @media (max-width: 360px) {
      .stats-row {
        flex-wrap: wrap;
      }

      .stat-badge.streak {
        margin-left: 0;
      }

      .question-expression {
        font-size: 1.9rem;
      }

      .options-grid {
        gap: 8px;
      }
    }

    /* =========================
       Reduced Motion
    ========================= */

    @media (prefers-reduced-motion: reduce) {
      .q-mark {
        animation: none;
      }
    }
  `]
})
export class QuizComponent implements OnInit {

  private readonly quizService = inject(QuizService);

  readonly difficulties: ReadonlyArray<{
    value: QuizDifficulty;
    label: string;
  }> = [
    {
      value: 'easy',
      label: '🌱 Easy'
    },
    {
      value: 'medium',
      label: '🚀 Medium'
    },
    {
      value: 'hard',
      label: '🔥 Hard'
    }
  ];

  ngOnInit(): void {
    if (!this.quizService.currentQuestion()) {
      this.quizService.generateNewQuestion();
    }
  }

  setDifficulty(difficulty: QuizDifficulty): void {
    this.quizService.setDifficulty(difficulty);
  }

  submitAnswer(answer: number): void {
    this.quizService.submitAnswer(answer);
  }

  nextQuestion(): void {
    this.quizService.generateNewQuestion();
  }
}

