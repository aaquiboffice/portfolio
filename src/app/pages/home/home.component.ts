import { AfterViewInit, Component, DestroyRef, NgZone, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HeroComponent } from '../../components/hero/hero.component';
import { AboutComponent } from '../../components/about/about.component';
import { ExperienceComponent } from '../../components/experience/experience.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { ContactComponent } from '../../components/contact/contact.component';

const SECTION_IDS = ['home', 'about', 'experience', 'projects', 'contact'] as const;
type SectionId = typeof SECTION_IDS[number];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    ContactComponent
  ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

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
    this.suppressScrollSpyUntil = Date.now() + 900;

    requestAnimationFrame(() => {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior });
        return;
      }
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior, block: 'start' });
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
