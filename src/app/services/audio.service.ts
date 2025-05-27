import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioCtx: AudioContext | null = null;
  readonly isMuted = signal<boolean>(false);

  constructor() {
    const savedMute = localStorage.getItem('kids_calc_muted');
    if (savedMute !== null) {
      this.isMuted.set(savedMute === 'true');
    }
  }

  toggleMute() {
    const next = !this.isMuted();
    this.isMuted.set(next);
    localStorage.setItem('kids_calc_muted', String(next));
  }

  private initCtx() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playPop(freq: number = 440) {
    if (this.isMuted()) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch {
      // Audio context fallbacks
    }
  }

  playOperator() {
    this.playPop(587.33); // D5
  }

  playEquals() {
    if (this.isMuted()) return;
    // Play happy 3-note arpeggio C5 - E5 - G5
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playPop(freq), idx * 70);
    });
  }

  playClear() {
    if (this.isMuted()) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.16);
    } catch {
      // Audio fallback
    }
  }

  playSuccess() {
    if (this.isMuted()) return;
    // Victory Fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playPop(freq), idx * 90);
    });
  }

  playError() {
    if (this.isMuted()) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(180, this.audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.26);
    } catch {
      // Audio fallback
    }
  }
}
