import { Injectable, effect, signal } from '@angular/core';
import { ThemeMode } from '../models/calculator.types';

interface AppTheme {
  id: ThemeMode;
  name: string;
  icon: string;
  previewColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly currentTheme = signal<ThemeMode>('theme-rainbow');

  readonly themes: AppTheme[] = [
    {
      id: 'theme-rainbow',
      name: 'Rainbow',
      icon: '🌈',
      previewColor: '#ff7675'
    },
    {
      id: 'theme-cosmic',
      name: 'Space Galaxy',
      icon: '🚀',
      previewColor: '#8b5cf6'
    },
    {
      id: 'theme-dino',
      name: 'Dino Jungle',
      icon: '🦖',
      previewColor: '#22c55e'
    },
    {
      id: 'theme-candy',
      name: 'Candy Land',
      icon: '🦄',
      previewColor: '#f43f5e'
    }
  ];

  constructor() {
    this.loadSavedTheme();

    effect(() => {
      const theme = this.currentTheme();

      this.applyTheme(theme);
      this.saveTheme(theme);
    });
  }

  setTheme(theme: ThemeMode): void {
    if (!this.isValidTheme(theme)) {
      return;
    }

    this.currentTheme.set(theme);
  }

  private loadSavedTheme(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const savedTheme = localStorage.getItem('kids_calc_theme');

    if (
      savedTheme &&
      this.isValidTheme(savedTheme as ThemeMode)
    ) {
      this.currentTheme.set(savedTheme as ThemeMode);
    }
  }

  private applyTheme(theme: ThemeMode): void {
    if (typeof document === 'undefined') {
      return;
    }

    const body = document.body;

    // Remove only KidsCalc theme classes.
    this.themes.forEach(({ id }) => {
      body.classList.remove(id);
    });

    body.classList.add(theme);
  }

  private saveTheme(theme: ThemeMode): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem('kids_calc_theme', theme);
  }

  private isValidTheme(theme: ThemeMode): boolean {
    return this.themes.some(t => t.id === theme);
  }
}