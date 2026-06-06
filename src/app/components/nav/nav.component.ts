import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

interface NavLink {
  num: string;
  label: string;
  route: string;
  id: string;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  readonly themeService = inject(ThemeService);

  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly activeId = signal('home');

  readonly links: NavLink[] = [
    { num: '01.', label: 'Home',       route: '/',           id: 'home' },
    { num: '02.', label: 'About',      route: '/about',      id: 'about' },
    { num: '03.', label: 'Experience', route: '/experience', id: 'experience' },
    { num: '04.', label: 'Projects',   route: '/projects',   id: 'projects' },
    { num: '05.', label: 'Contact',    route: '/contact',    id: 'contact' }
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 30);

    const triggerY = window.scrollY + window.innerHeight / 3;
    let current = 'home';
    for (const link of this.links) {
      const el = document.getElementById(link.id);
      if (el && triggerY >= el.offsetTop) current = link.id;
    }
    if (current !== this.activeId()) this.activeId.set(current);
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
