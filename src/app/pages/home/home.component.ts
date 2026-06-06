import { AfterViewInit, Component, DestroyRef, NgZone, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HeroComponent } from '../../components/hero/hero.component';
import { AboutComponent } from '../../components/about/about.component';
import { ExperienceComponent } from '../../components/experience/experience.component';
import { EducationComponent } from '../../components/education/education.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { MarqueeComponent } from '../../components/marquee/marquee.component';
import { LenisService } from '../../services/lenis.service';

const SECTION_IDS = ['home', 'about', 'experience', 'education', 'projects', 'contact'] as const;
type SectionId = typeof SECTION_IDS[number];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    EducationComponent,
    ProjectsComponent,
    ContactComponent,
    MarqueeComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly lenis = inject(LenisService);

  readonly heroMarquee = [
    'Angular', 'Node.js', 'Express', 'MongoDB', 'TypeScript',
    'RxJS', 'REST APIs', 'SCSS', 'Tailwind', 'Git'
  ];

  readonly midMarquee = [
    'MEAN Stack', 'UI / UX Focused', 'Clean Code',
    'Performance', 'Based in Mumbai', 'Open to Work'
  ];

  readonly outroMarquee = [
    "Let's Build Something Great",
    "Available for Hire",
    "Portfolio · 2026",
    "Crafted with Angular"
  ];

  private lastSyncedPath = '';
  private suppressScrollSpyUntil = 0;

  ngOnInit(): void {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(e => this.scrollToSection(this.urlToSectionId(e.urlAfterRedirects), 'smooth'));
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      const initial = this.urlToSectionId(this.router.url);
      this.scrollToSection(initial, 'auto');
    });
    this.zone.runOutsideAngular(() => this.attachScrollSpy());
  }

  private scrollToSection(id: SectionId, behavior: ScrollBehavior): void {
    this.suppressScrollSpyUntil = Date.now() + 1300;
    const immediate = behavior === 'auto';

    requestAnimationFrame(() => {
      if (id === 'home') {
        this.lenis.scrollTo(0, { immediate, offset: 0 });
        return;
      }
      const target = document.getElementById(id);
      if (target) {
        this.lenis.scrollTo(target, { immediate, offset: -90 });
      }
    });
  }

  private urlToSectionId(url: string): SectionId {
    const path = (url.split('?')[0] ?? '').split('#')[0]?.replace(/^\//, '') ?? '';
    return (SECTION_IDS as readonly string[]).includes(path) ? (path as SectionId) : 'home';
  }

  private attachScrollSpy(): void {
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (Date.now() < this.suppressScrollSpyUntil) return;
        this.syncUrlToScroll();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
  }

  private syncUrlToScroll(): void {
    const triggerY = window.scrollY + window.innerHeight / 3;
    let current: SectionId = 'home';
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el && triggerY >= el.offsetTop) current = id;
    }
    const newPath = current === 'home' ? '/' : '/' + current;
    if (newPath !== this.lastSyncedPath && newPath !== location.pathname) {
      this.lastSyncedPath = newPath;
      history.replaceState(history.state, '', newPath);
    }
  }
}
