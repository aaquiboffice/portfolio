import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { TiltDirective } from '../../directives/tilt.directive';

interface ContactLink {
  href: string;
  label: string;
  icon: 'mail' | 'phone' | 'linkedin';
  external?: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealDirective, MagneticDirective, TiltDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  readonly links: ContactLink[] = [
    { href: 'mailto:aaquibrodde19@gmail.com',          label: 'aaquibrodde19@gmail.com',    icon: 'mail' },
    { href: 'https://linkedin.com/in/Aauib-rodde',     label: 'linkedin.com/in/Aauib-rodde', icon: 'linkedin', external: true }
  ];
}
