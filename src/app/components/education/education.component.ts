import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TiltDirective } from '../../directives/tilt.directive';

interface Education {
  degree: string;
  field: string;
  school: string;
  university: string;
  location: string;
  period: string;
  cgpa: string;
  highlights: string[];
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [RevealDirective, TiltDirective],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent {
  readonly items: Education[] = [
    {
      degree: 'Bachelor of Management Studies',
      field: 'Marketing',
      school: 'Mahendra Laxman Mhatre Degree College',
      university: 'University of Mumbai',
      location: 'Bhiwandi, Maharashtra',
      period: '2022 — 2025',
      cgpa: '6.40',
      highlights: [
        'Marketing & Brand Strategy',
        'Consumer Behavior',
        'Business Communication',
        'Financial Management'
      ]
    }
  ];
}
