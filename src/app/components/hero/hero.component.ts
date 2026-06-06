import { AfterViewInit, Component, DestroyRef, ElementRef, OnInit, ViewChildren, QueryList, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import { RevealDirective } from '../../directives/reveal.directive';

interface Stat {
  target: number;
  current: number;
  label1: string;
  label2: string;
  suffix: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RevealDirective, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly words = ['scalable', 'beautiful', 'fast', 'modern', 'reliable'];
  readonly rotatingWord = signal(this.words[0]);
  readonly rotatingVisible = signal(true);

  readonly stats = signal<Stat[]>([
    { target: 1,  current: 0, label1: 'Year',         label2: 'Experience', suffix: '+' },
    { target: 2,  current: 0, label1: 'Major',        label2: 'Projects',   suffix: '+' },
    { target: 15, current: 0, label1: 'Technologies', label2: 'Mastered',   suffix: '+' }
  ]);

  @ViewChildren('statEl') statEls!: QueryList<ElementRef<HTMLDivElement>>;

  ngOnInit(): void {
    let idx = 0;
    interval(2500)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.rotatingVisible.set(false);
        setTimeout(() => {
          idx = (idx + 1) % this.words.length;
          this.rotatingWord.set(this.words[idx]!);
          this.rotatingVisible.set(true);
        }, 400);
      });
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = this.statEls.toArray().findIndex(ref => ref.nativeElement === entry.target);
          if (idx !== -1) this.animateStat(idx);
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.5 });

    this.statEls.forEach(ref => observer.observe(ref.nativeElement));
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private animateStat(index: number): void {
    const stats = [...this.stats()];
    const stat = stats[index];
    if (!stat) return;
    const inc = Math.max(1, Math.ceil(stat.target / 30));
    const tick = () => {
      stat.current += inc;
      if (stat.current >= stat.target) {
        stat.current = stat.target;
        this.stats.set([...stats]);
        return;
      }
      this.stats.set([...stats]);
      requestAnimationFrame(tick);
    };
    tick();
  }
}
