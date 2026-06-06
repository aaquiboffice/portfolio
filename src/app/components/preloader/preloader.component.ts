import { AfterViewInit, Component, DestroyRef, NgZone, OnDestroy, inject, signal } from '@angular/core';

@Component({
  selector: 'app-preloader',
  standalone: true,
  templateUrl: './preloader.component.html',
  styleUrl: './preloader.component.scss'
})
export class PreloaderComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly progress = signal(0);
  readonly hiding = signal(false);
  readonly removed = signal(false);

  private rafId?: number;
  private timers: number[] = [];

  ngAfterViewInit(): void {
    // lock scroll while preloader is active
    document.body.style.overflow = 'hidden';

    this.zone.runOutsideAngular(() => {
      const duration = 1700;
      const start = performance.now();

      const tick = (now: number) => {
        const elapsed = now - start;
        const raw = Math.min(1, elapsed / duration);
        // ease-out cubic for a natural finish
        const eased = 1 - Math.pow(1 - raw, 3);
        this.progress.set(Math.round(eased * 100));

        if (raw < 1) {
          this.rafId = requestAnimationFrame(tick);
        } else {
          this.timers.push(window.setTimeout(() => this.hiding.set(true), 220));
          this.timers.push(window.setTimeout(() => {
            this.removed.set(true);
            document.body.style.overflow = '';
          }, 1300));
        }
      };
      this.rafId = requestAnimationFrame(tick);
    });

    this.destroyRef.onDestroy(() => this.cleanup());
  }

  ngOnDestroy(): void { this.cleanup(); }

  private cleanup(): void {
    if (this.rafId !== undefined) cancelAnimationFrame(this.rafId);
    for (const t of this.timers) clearTimeout(t);
    document.body.style.overflow = '';
  }
}
