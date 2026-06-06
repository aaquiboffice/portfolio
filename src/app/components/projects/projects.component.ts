import { Component, ElementRef } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

interface Project {
  url: string;
  title: string;
  description: string;
  tech: string[];
  reverse: boolean;
  mockType: 'fch' | 'olt';
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  readonly projects: Project[] = [
    {
      url: 'familycare.admin',
      title: 'Family Care Hospitals — Admin Portal',
      description:
        'Built the complete frontend for a hospital admin portal using <strong>Angular</strong>, ' +
        'featuring secure login flows, responsive dashboards, and rich administrative modules. ' +
        'Integrated RESTful APIs for managing hospital data with smooth interactions and a ' +
        'clean, user-friendly design — then optimized UI performance and fixed critical bugs.',
      tech: ['Angular', 'Bootstrap', 'RxJS', 'TypeScript', 'SCSS', 'REST APIs'],
      reverse: false,
      mockType: 'fch'
    },
    {
      url: 'onelifetouch.admin',
      title: 'OneLifeTouch Admin Dashboard',
      description:
        'Designed and developed a full-scale admin dashboard end-to-end using <strong>Angular</strong>. ' +
        'Built reusable UI components, dynamic modules for users, activities, reports and platform ' +
        'management, plus optimized API integrations, real-time data handling, filters, and ' +
        'role-based screens. Delivered single-handedly with lazy loading, clean UX, and ' +
        'consistent design standards.',
      tech: ['Angular', 'Guards & Routing', 'RxJS', 'TypeScript', 'REST APIs', 'Lazy Loading'],
      reverse: true,
      mockType: 'olt'
    }
  ];

  onCardMove(event: MouseEvent, card: HTMLElement): void {
    const mock = card.querySelector<HTMLElement>('.project-mock');
    if (!mock) return;
    const rect = mock.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotY = x * 10;
    const rotX = -y * 8;
    mock.style.transform =
      `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(-6px)`;
  }

  onCardLeave(card: HTMLElement): void {
    const mock = card.querySelector<HTMLElement>('.project-mock');
    if (mock) mock.style.transform = '';
  }
}
