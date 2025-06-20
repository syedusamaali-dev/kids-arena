import { Injectable, inject, signal } from '@angular/core';
import {
  QuizDifficulty,
  QuizQuestion
} from '../models/calculator.types';
import { AudioService } from './audio.service';
import { SpeechService } from './speech.service';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  // ============================================================
  // SERVICES
  // ============================================================

  private readonly audioService = inject(AudioService);
  private readonly speechService = inject(SpeechService);

  // ============================================================
  // QUIZ STATE
  // ============================================================

  readonly currentQuestion =
    signal<QuizQuestion | null>(null);

  readonly score =
    signal<number>(0);

  readonly streak =
    signal<number>(0);

  readonly stars =
    signal<number>(0);

  readonly difficulty =
    signal<QuizDifficulty>('easy');

  readonly isAnswered =
    signal<boolean>(false);

  readonly selectedAnswer =
    signal<number | null>(null);

  /**
   * null = question has not been answered
   * true = correct
   * false = incorrect
   */
  readonly isCorrect =
    signal<boolean | null>(null);

  // ============================================================
  // CONFIGURATION
  // ============================================================

  private readonly starsStorageKey =
    'kids_calc_stars';

  private readonly pointsPerAnswer =
    10;

  private readonly optionsCount =
    4;

  // ============================================================
  // INITIALIZATION
  // ============================================================

  constructor() {
    this.loadStars();
  }

  // ============================================================
  // DIFFICULTY
  // ============================================================

  setDifficulty(
    difficulty: QuizDifficulty
  ): void {

    this.difficulty.set(difficulty);

    this.generateNewQuestion();
  }

  // ============================================================
  // QUESTION GENERATION
  // ============================================================

  generateNewQuestion(): void {

    this.resetQuestionState();

    const question =
      this.createQuestion(
        this.difficulty()
      );

    this.currentQuestion.set(question);

    this.speechService.speak(
      `What is ${question.num1} ${question.operator} ${question.num2}?`
    );
  }

  private createQuestion(
    difficulty: QuizDifficulty
  ): QuizQuestion {

    switch (difficulty) {

      case 'easy':
        return this.createEasyQuestion();

      case 'medium':
        return this.createMediumQuestion();

      case 'hard':
        return this.createHardQuestion();
    }
  }

  // ============================================================
  // EASY
  // ============================================================

  private createEasyQuestion(): QuizQuestion {

    let num1 =
      this.randomNumber(1, 9);

    let num2 =
      this.randomNumber(1, 9);

    const operators:
      ('+' | '-')[] = ['+', '-'];

    const operator =
      this.randomItem(operators);

    // Keep subtraction positive.
    if (
      operator === '-' &&
      num1 < num2
    ) {
      [num1, num2] =
        [num2, num1];
    }

    const answer =
      this.calculateAnswer(
        num1,
        num2,
        operator
      );

    return this.buildQuestion(
      num1,
      num2,
      operator,
      answer
    );
  }

  // ============================================================
  // MEDIUM
  // ============================================================

  private createMediumQuestion(): QuizQuestion {

    let num1 =
      this.randomNumber(5, 24);

    let num2 =
      this.randomNumber(1, 15);

    const operators:
      ('+' | '-' | '×')[] = [
        '+',
        '-',
        '×'
      ];

    const operator =
      this.randomItem(operators);

    // Keep subtraction positive.
    if (
      operator === '-' &&
      num1 < num2
    ) {
      [num1, num2] =
        [num2, num1];
    }

    const answer =
      this.calculateAnswer(
        num1,
        num2,
        operator
      );

    return this.buildQuestion(
      num1,
      num2,
      operator,
      answer
    );
  }

  // ============================================================
  // HARD
  // ============================================================

  private createHardQuestion(): QuizQuestion {

    const operators:
      ('×' | '÷')[] = [
        '×',
        '÷'
      ];

    const operator =
      this.randomItem(operators);

    if (operator === '÷') {

      // Create clean division:
      // e.g. 48 ÷ 6 = 8
      const divisor =
        this.randomNumber(2, 10);

      const answer =
        this.randomNumber(2, 12);

      const dividend =
        divisor * answer;

      return this.buildQuestion(
        dividend,
        divisor,
        '÷',
        answer
      );
    }

    const num1 =
      this.randomNumber(2, 12);

    const num2 =
      this.randomNumber(2, 10);

    const answer =
      num1 * num2;

    return this.buildQuestion(
      num1,
      num2,
      '×',
      answer
    );
  }

  // ============================================================
  // QUESTION BUILDER
  // ============================================================

  private buildQuestion(
    num1: number,
    num2: number,
    operator: '+' | '-' | '×' | '÷',
    answer: number
  ): QuizQuestion {

    const options =
      this.generateOptions(answer);

    return {
      num1,
      num2,
      operator,
      answer,
      options
    };
  }

  // ============================================================
  // ANSWER OPTIONS
  // ============================================================

  private generateOptions(
    answer: number
  ): number[] {

    const options =
      new Set<number>();

    options.add(answer);

    /**
     * Maximum attempts prevents an infinite loop
     * in unusual cases.
     */
    let attempts = 0;
    const maxAttempts = 50;

    while (
      options.size < this.optionsCount &&
      attempts < maxAttempts
    ) {

      attempts++;

      const distance =
        this.randomNumber(1, 6);

      const direction =
        Math.random() < 0.5
          ? -1
          : 1;

      const wrongAnswer =
        Math.max(
          0,
          answer + distance * direction
        );

      options.add(wrongAnswer);
    }

    // Fallback in case duplicate options occur.
    let fallback =
      Math.max(0, answer + 1);

    while (
      options.size < this.optionsCount
    ) {

      if (!options.has(fallback)) {
        options.add(fallback);
      }

      fallback++;
    }

    return this.shuffle(
      Array.from(options)
    );
  }

  // ============================================================
  // ANSWER SUBMISSION
  // ============================================================

  submitAnswer(
    choice: number
  ): void {

    if (this.isAnswered()) {
      return;
    }

    const question =
      this.currentQuestion();

    if (!question) {
      return;
    }

    this.isAnswered.set(true);
    this.selectedAnswer.set(choice);

    const correct =
      choice === question.answer;

    this.isCorrect.set(correct);

    if (correct) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer(
        question.answer
      );
    }
  }

  // ============================================================
  // CORRECT ANSWER
  // ============================================================

  private handleCorrectAnswer(): void {

    const newStreak =
      this.streak() + 1;

    const points =
      this.pointsPerAnswer *
      newStreak;

    this.streak.set(
      newStreak
    );

    this.score.update(
      current => current + points
    );

    const newStars =
      this.stars() + 1;

    this.stars.set(
      newStars
    );

    this.saveStars(
      newStars
    );

    this.audioService.playSuccess();

    this.speechService.speak(
      'Awesome! You got it right!'
    );

    this.showConfetti();
  }

  // ============================================================
  // WRONG ANSWER
  // ============================================================

  private handleWrongAnswer(
    correctAnswer: number
  ): void {

    this.streak.set(0);

    this.audioService.playError();

    this.speechService.speak(
      `Oops! The correct answer is ${correctAnswer}`
    );
  }

  // ============================================================
  // RESET
  // ============================================================

  resetQuiz(): void {

    this.score.set(0);
    this.streak.set(0);

    this.generateNewQuestion();
  }

  // ============================================================
  // QUESTION STATE
  // ============================================================

  private resetQuestionState(): void {

    this.isAnswered.set(false);
    this.selectedAnswer.set(null);
    this.isCorrect.set(null);
  }

  // ============================================================
  // CALCULATION
  // ============================================================

  private calculateAnswer(
    num1: number,
    num2: number,
    operator: '+' | '-' | '×' | '÷'
  ): number {

    switch (operator) {

      case '+':
        return num1 + num2;

      case '-':
        return num1 - num2;

      case '×':
        return num1 * num2;

      case '÷':
        return num1 / num2;
    }
  }

  // ============================================================
  // RANDOM HELPERS
  // ============================================================

  private randomNumber(
    min: number,
    max: number
  ): number {

    return Math.floor(
      Math.random() * (max - min + 1)
    ) + min;
  }

  private randomItem<T>(
    items: readonly T[]
  ): T {

    return items[
      Math.floor(
        Math.random() * items.length
      )
    ];
  }

  private shuffle<T>(
    items: T[]
  ): T[] {

    return items.sort(
      () => Math.random() - 0.5
    );
  }

  // ============================================================
  // STARS PERSISTENCE
  // ============================================================

  private loadStars(): void {

    if (typeof window === 'undefined') {
      return;
    }

    try {

      const saved =
        localStorage.getItem(
          this.starsStorageKey
        );

      if (saved !== null) {

        const value =
          Number.parseInt(
            saved,
            10
          );

        if (
          Number.isFinite(value) &&
          value >= 0
        ) {
          this.stars.set(value);
        }
      }

    } catch {
      // Ignore storage errors.
    }
  }

  private saveStars(
    stars: number
  ): void {

    if (typeof window === 'undefined') {
      return;
    }

    try {

      localStorage.setItem(
        this.starsStorageKey,
        String(stars)
      );

    } catch {
      // Ignore storage errors.
    }
  }

  // ============================================================
  // CONFETTI
  // ============================================================

  private showConfetti(): void {

    try {

      confetti({
        particleCount: 80,
        spread: 70,
        origin: {
          y: 0.6
        }
      });

    } catch {
      // Confetti is optional.
    }
  }
}