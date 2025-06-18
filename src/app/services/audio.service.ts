import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audioCtx: AudioContext | null = null;

  readonly isMuted = signal<boolean>(false);

  private readonly storageKey = 'kids_calc_muted';

  constructor() {
    this.loadMutePreference();
  }

  // ============================================================
  // PUBLIC CONTROLS
  // ============================================================

  toggleMute(): void {
    const muted = !this.isMuted();

    this.isMuted.set(muted);
    this.saveMutePreference(muted);
  }

  // ============================================================
  // CALCULATOR SOUNDS
  // ============================================================

  playPop(freq = 440): void {
    this.playTone({
      frequency: freq,
      endFrequency: freq * 1.5,
      duration: 0.09,
      type: 'sine',
      volume: 0.15
    });
  }

  playOperator(): void {
    this.playPop(587.33);
  }

  playEquals(): void {
    this.playNotes(
      [523.25, 659.25, 783.99],
      70
    );
  }

  playClear(): void {
    this.playTone({
      frequency: 600,
      endFrequency: 200,
      duration: 0.15,
      type: 'triangle',
      volume: 0.15
    });
  }

  // ============================================================
  // QUIZ SOUNDS
  // ============================================================

  playSuccess(): void {
    this.playNotes(
      [523.25, 659.25, 783.99, 1046.5],
      90
    );
  }

  playError(): void {
    this.playTone({
      frequency: 220,
      endFrequency: 180,
      duration: 0.25,
      type: 'sawtooth',
      volume: 0.12
    });
  }

  // ============================================================
  // AUDIO ENGINE
  // ============================================================

  private playTone(options: {
    frequency: number;
    endFrequency?: number;
    duration: number;
    type: OscillatorType;
    volume: number;
  }): void {

    if (this.isMuted()) {
      return;
    }

    try {
      const context = this.getAudioContext();

      if (!context) {
        return;
      }

      const now = context.currentTime;

      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = options.type;

      oscillator.frequency.setValueAtTime(
        options.frequency,
        now
      );

      if (options.endFrequency) {
        oscillator.frequency.exponentialRampToValueAtTime(
          options.endFrequency,
          now + options.duration
        );
      }

      gain.gain.setValueAtTime(
        options.volume,
        now
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + options.duration
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start(now);

      oscillator.stop(
        now + options.duration + 0.01
      );

    } catch {
      // Audio is optional.
      // The calculator continues working if audio is unavailable.
    }
  }

  private playNotes(
    frequencies: number[],
    interval: number
  ): void {

    if (this.isMuted()) {
      return;
    }

    frequencies.forEach((frequency, index) => {

      window.setTimeout(() => {

        if (!this.isMuted()) {
          this.playPop(frequency);
        }

      }, index * interval);

    });
  }

  // ============================================================
  // AUDIO CONTEXT
  // ============================================================

  private getAudioContext(): AudioContext | null {

    if (typeof window === 'undefined') {
      return null;
    }

    try {

      if (!this.audioCtx) {

        const AudioContextClass =
          window.AudioContext ??
          (
            window as unknown as {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (!AudioContextClass) {
          return null;
        }

        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        void this.audioCtx.resume();
      }

      return this.audioCtx;

    } catch {
      return null;
    }
  }

  // ============================================================
  // USER PREFERENCE
  // ============================================================

  private loadMutePreference(): void {

    if (typeof window === 'undefined') {
      return;
    }

    try {

      const savedMute =
        localStorage.getItem(this.storageKey);

      if (savedMute !== null) {
        this.isMuted.set(savedMute === 'true');
      }

    } catch {
      // Ignore localStorage errors.
    }
  }

  private saveMutePreference(muted: boolean): void {

    if (typeof window === 'undefined') {
      return;
    }

    try {

      localStorage.setItem(
        this.storageKey,
        String(muted)
      );

    } catch {
      // Ignore localStorage errors.
    }
  }
}