import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  readonly isSpeechEnabled = signal<boolean>(false);
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
    const saved = localStorage.getItem('kids_calc_speech');
    if (saved !== null) {
      this.isSpeechEnabled.set(saved === 'true');
    }
  }

  toggleSpeech() {
    const next = !this.isSpeechEnabled();
    this.isSpeechEnabled.set(next);
    localStorage.setItem('kids_calc_speech', String(next));
    if (next) {
      this.speak('Voice readout active!');
    } else if (this.synth) {
      this.synth.cancel();
    }
  }

  speak(text: string) {
    if (!this.isSpeechEnabled() || !this.synth) return;

    this.synth.cancel(); // Stop any pending speech

    // Format text for kids friendly pronunciation
    const formatted = text
      .replace(/\+/g, ' plus ')
      .replace(/-/g, ' minus ')
      .replace(/×|\*/g, ' times ')
      .replace(/÷|\//g, ' divided by ')
      .replace(/=/g, ' equals ');

    const utterance = new SpeechSynthesisUtterance(formatted);
    utterance.rate = 0.95; // Slightly slower, friendly rate for kids
    utterance.pitch = 1.2; // Slightly higher pitch for friendly tone
    
    // Choose a friendly English voice if available
    const voices = this.synth.getVoices();
    const friendlyVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (friendlyVoice) {
      utterance.voice = friendlyVoice;
    }

    this.synth.speak(utterance);
  }
}
