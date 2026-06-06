import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-marquee',
  standalone: true,
  templateUrl: './marquee.component.html',
  styleUrl: './marquee.component.scss'
})
export class MarqueeComponent {
  @Input() items: string[] = [];
  @Input() duration = 35;        // seconds per loop
  @Input() separator = '✦';
  @Input() reverse = false;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  @Input() variant: 'plain' | 'outlined' | 'gradient' = 'gradient';

  /** Render 4 repeats so the loop is seamless on any viewport. */
  readonly repeats = [0, 1, 2, 3];
}
