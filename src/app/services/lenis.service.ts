import { Injectable, NgZone, PLATFORM_ID, inject, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';

export interface LenisScrollOptions {
  offset?: number;
  immediate?: boolean;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class LenisService {
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);

  private lenis: Lenis | null = null;
  private rafId: number | null = null;

  readonly ready = signal(false);

  initialize(): void {
    if (this.lenis || !isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (prefersReducedMotion) return;

    this.zone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        lerp: 0.1
      });

      const loop = (time: number) => {
        this.lenis?.raf(time);
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);
    });

    this.ready.set(true);
  }

  scrollTo(target: string | HTMLElement | number, options: LenisScrollOptions = {}): void {
    const offset = options.offset ?? -90;
    const immediate = options.immediate ?? false;
    const duration = options.duration ?? 1.2;

    if (this.lenis) {
      this.lenis.scrollTo(target, { offset, immediate, duration });
      return;
    }

    const behavior: ScrollBehavior = immediate ? 'auto' : 'smooth';
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior });
      return;
    }
    if (typeof target === 'string') {
      const id = target.startsWith('#') ? target.slice(1) : target;
      if (!id || id === 'home') {
        window.scrollTo({ top: 0, behavior });
        return;
      }
      const el = this.doc.getElementById(id);
      el?.scrollIntoView({ behavior, block: 'start' });
      return;
    }
    target.scrollIntoView({ behavior, block: 'start' });
  }

  stop(): void { this.lenis?.stop(); }
  start(): void { this.lenis?.start(); }

  destroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.lenis?.destroy();
    this.lenis = null;
    this.rafId = null;
    this.ready.set(false);
  }
}
