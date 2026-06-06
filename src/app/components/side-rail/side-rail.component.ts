import { AfterViewInit, Component, DestroyRef, NgZone, inject, signal } from '@angular/core';
import { LenisService } from '../../services/lenis.service';

interface SectionDot {
  id: string;
  label: string;
}

@Component({
  selector: 'app-side-rail',
  standalone: true,
  templateUrl: './side-rail.component.html',
  styleUrl: './side-rail.component.scss'
})
export class SideRailComponent implements AfterViewInit {
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly lenis = inject(LenisService);

  readonly sections: SectionDot[] = [
    { id: 'home',       label: 'Home' },
    { id: 'about',      label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'education',  label: 'Education' },
    { id: 'projects',   label: 'Projects' },
    { id: 'contact',    label: 'Contact' }
  ];

  readonly activeId = signal<string>('home');
  readonly scrollPct = signal(0);

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      let rafId: number | null = null;

      const update = () => {
        rafId = null;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        this.scrollPct.set(Math.round(Math.min(100, Math.max(0, pct))));

        const trigger = window.scrollY + window.innerHeight / 3;
        let current = this.sections[0]!.id;
        for (const s of this.sections) {
          const el = document.getElementById(s.id);
          if (el && trigger >= el.offsetTop) current = s.id;
        }
        if (current !== this.activeId()) this.activeId.set(current);
      };

      const onScroll = () => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(update);
      };

      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
        if (rafId !== null) cancelAnimationFrame(rafId);
      });
    });
  }

  jumpTo(id: string): void {
    if (id === 'home') {
      this.lenis.scrollTo(0, { offset: 0 });
    } else {
      const el = document.getElementById(id);
      if (el) this.lenis.scrollTo(el, { offset: -90 });
    }
  }
}
