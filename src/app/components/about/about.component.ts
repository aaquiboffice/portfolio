import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';

type SkillIcon = 'frontend' | 'backend' | 'languages' | 'database' | 'tools' | 'concepts';

interface SkillGroup {
  icon: SkillIcon;
  title: string;
  tags: string[];
}

interface MetaItem {
  label: string;
  value: string;
  online?: boolean;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective, TiltDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  preserveWhitespaces: true
})
export class AboutComponent {
  readonly meta: MetaItem[] = [
    { label: 'Location',  value: 'Thane, Maharashtra' },
    { label: 'Education', value: 'BMS, University of Mumbai' },
    { label: 'Focus',     value: 'Full-Stack Web Development' },
    { label: 'Status',    value: 'Open to opportunities', online: true }
  ];

  readonly skills: SkillGroup[] = [
    { icon: 'frontend',  title: 'Frontend',  tags: ['Angular', 'Angular Material', 'Bootstrap', 'Tailwind CSS', 'SASS/LESS', 'GSAP'] },
    { icon: 'backend',   title: 'Backend',   tags: ['Node.js', 'Express.js', 'REST APIs', 'Nginx'] },
    { icon: 'languages', title: 'Languages', tags: ['TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
    { icon: 'database',  title: 'Database',  tags: ['MongoDB', 'Mongoose'] },
    { icon: 'tools',     title: 'Tools',     tags: ['Git', 'Postman', 'VS Code', 'npm'] },
    { icon: 'concepts',  title: 'Concepts',  tags: ['RxJS', 'Routing & Guards', 'Lazy Loading', 'Auth', 'State Mgmt'] }
  ];
}
