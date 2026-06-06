import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

interface Experience {
  type: 'work' | 'education';
  title: string;
  company: string;
  location?: string;
  period: string;
  bullets?: string[];
  description?: string;
  tech?: string[];
  showLine?: boolean;
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  readonly items: Experience[] = [
    {
      type: 'work',
      title: 'MEAN Stack Developer',
      company: 'Dealmoney Commodities Pvt Ltd.',
      location: 'Thane, Maharashtra',
      period: 'Nov 2025 — Nov 2026',
      bullets: [
        'Developed and maintained scalable web applications using <strong>MongoDB, Express, Angular, and Node.js</strong>.',
        'Built secure and optimized <strong>RESTful APIs</strong> for multiple business modules.',
        'Designed clean, responsive Angular UI screens with <strong>reusable components</strong>.',
        'Improved performance by optimizing API logic and <strong>MongoDB queries</strong>.',
        'Integrated third-party services and handled authentication, routing, and state management.',
        'Collaborated with UI/UX designers and backend teams to deliver features on time.',
        'Followed Git best practices, performed code reviews, and wrote documentation.'
      ],
      tech: ['Angular', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'REST APIs', 'Git'],
      showLine: true
    },
    {
      type: 'education',
      title: 'Bachelor of Management Studies — Marketing',
      company: 'Mahendra Laxman Mhatre Degree College · University of Mumbai',
      period: '2022 — 2025',
      description: 'Graduated with CGPA <strong>7.13</strong>. Bhiwandi, Maharashtra.'
    }
  ];
}
