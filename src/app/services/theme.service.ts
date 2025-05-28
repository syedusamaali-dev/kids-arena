import { Injectable, signal, effect } from '@angular/core';
import { ThemeMode } from '../models/calculator.types';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly currentTheme = signal<ThemeMode>('theme-rainbow');

  readonly themes: { id: ThemeMode; name: string; icon: string; previewColor: string }[] = [
    { id: 'theme-rainbow', name: 'Rainbow', icon: '🌈', previewColor: '#ff7675' },
    { id: 'theme-cosmic', name: 'Space Galaxy', icon: '🚀', previewColor: '#8b5cf6' },
    { id: 'theme-dino', name: 'Dino Jungle', icon: '🦖', previewColor: '#22c55e' },
    { id: 'theme-candy', name: 'Candy Land', icon: '🦄', previewColor: '#f43f5e' }
  ];

  constructor() {
    const saved = localStorage.getItem('kids_calc_theme') as ThemeMode;
    if (saved && this.themes.some(t => t.id === saved)) {
      this.currentTheme.set(saved);
    }
    
    // Synchronize body class whenever theme changes
    effect(() => {
      const theme = this.currentTheme();
      document.body.className = '';
      document.body.classList.add(theme);
      localStorage.setItem('kids_calc_theme', theme);
    });
  }

  setTheme(theme: ThemeMode) {
    this.currentTheme.set(theme);
  }
}
