import { AfterViewInit, Component, DestroyRef, NgZone, inject, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  templateUrl: './scroll-progress.component.html',
  styleUrl: './scroll-progress.component.scss'
})
export class ScrollProgressComponent implements AfterViewInit {
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly progress = signal(0);

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      let rafId: number | null = null;

      const update = () => {
        rafId = null;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        this.progress.set(Math.min(100, Math.max(0, pct)));
      };

      const onScrollOrResize = () => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(update);
      };

      update();
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize, { passive: true });

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
        if (rafId !== null) cancelAnimationFrame(rafId);
      });
    });
  }
}
