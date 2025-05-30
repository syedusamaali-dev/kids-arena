import { Injectable, signal, inject } from '@angular/core';
import { QuizDifficulty, QuizQuestion } from '../models/calculator.types';
import { AudioService } from './audio.service';
import { SpeechService } from './speech.service';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private audioService = inject(AudioService);
  private speechService = inject(SpeechService);

  readonly currentQuestion = signal<QuizQuestion | null>(null);
  readonly score = signal<number>(0);
  readonly streak = signal<number>(0);
  readonly stars = signal<number>(0);
  readonly difficulty = signal<QuizDifficulty>('easy');
  readonly isAnswered = signal<boolean>(false);
  readonly selectedAnswer = signal<number | null>(null);
  readonly isCorrect = signal<boolean | null>(null);

  constructor() {
    const savedStars = localStorage.getItem('kids_calc_stars');
    if (savedStars) {
      this.stars.set(parseInt(savedStars, 10) || 0);
    }
  }

  setDifficulty(diff: QuizDifficulty) {
    this.difficulty.set(diff);
    this.generateNewQuestion();
  }

  generateNewQuestion() {
    this.isAnswered.set(false);
    this.selectedAnswer.set(null);
    this.isCorrect.set(null);

    const diff = this.difficulty();
    let n1 = 0, n2 = 0;
    let ops: ('+' | '-' | '×' | '÷')[] = ['+', '-'];

    if (diff === 'easy') {
      n1 = Math.floor(Math.random() * 9) + 1;
      n2 = Math.floor(Math.random() * 9) + 1;
      ops = ['+', '-'];
    } else if (diff === 'medium') {
      n1 = Math.floor(Math.random() * 20) + 5;
      n2 = Math.floor(Math.random() * 15) + 1;
      ops = ['+', '-', '×'];
    } else {
      n1 = Math.floor(Math.random() * 12) + 2;
      n2 = Math.floor(Math.random() * 10) + 2;
      ops = ['×', '÷'];
    }

    const op = ops[Math.floor(Math.random() * ops.length)];

    // Ensure subtraction yields non-negative numbers for kids
    if (op === '-' && n1 < n2) {
      const temp = n1;
      n1 = n2;
      n2 = temp;
    }

    // Ensure division results in neat whole numbers
    if (op === '÷') {
      const product = n1 * n2;
      n1 = product;
    }

    let ans = 0;
    switch (op) {
      case '+': ans = n1 + n2; break;
      case '-': ans = n1 - n2; break;
      case '×': ans = n1 * n2; break;
      case '÷': ans = n1 / n2; break;
    }

    // Generate 3 distractors
    const optionsSet = new Set<number>();
    optionsSet.add(ans);
    while (optionsSet.size < 4) {
      const offset = (Math.floor(Math.random() * 6) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = Math.max(0, ans + offset);
      optionsSet.add(wrong);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

    const question: QuizQuestion = {
      num1: n1,
      num2: n2,
      operator: op,
      answer: ans,
      options
    };

    this.currentQuestion.set(question);

    // Speak out question
    this.speechService.speak(`What is ${n1} ${op} ${n2}?`);
  }

  submitAnswer(choice: number) {
    if (this.isAnswered()) return;

    const q = this.currentQuestion();
    if (!q) return;

    this.isAnswered.set(true);
    this.selectedAnswer.set(choice);

    if (choice === q.answer) {
      this.isCorrect.set(true);
      const newStreak = this.streak() + 1;
      this.streak.set(newStreak);
      this.score.set(this.score() + 10 * newStreak);
      
      const newStars = this.stars() + 1;
      this.stars.set(newStars);
      localStorage.setItem('kids_calc_stars', String(newStars));

      this.audioService.playSuccess();
      this.speechService.speak('Awesome! You got it right!');

      // Confetti Burst!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    } else {
      this.isCorrect.set(false);
      this.streak.set(0);
      this.audioService.playError();
      this.speechService.speak(`Oops! The correct answer is ${q.answer}`);
    }
  }

  resetQuiz() {
    this.score.set(0);
    this.streak.set(0);
    this.generateNewQuestion();
  }
}
