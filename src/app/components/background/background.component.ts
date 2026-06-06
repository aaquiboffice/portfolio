import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-background',
  standalone: true,
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss'
})
export class BackgroundComponent {
  @ViewChild('orbs', { static: true }) orbs!: ElementRef<HTMLDivElement>;

  readonly glyphs: { ch: string; x: number; y: number; delay: number; dur: number; size: number; rot: number }[] = [
    { ch: '</>',  x: 8,  y: 18, delay: 0,    dur: 22, size: 22, rot: -8  },
    { ch: '{ }',  x: 88, y: 22, delay: -4,   dur: 26, size: 26, rot: 12  },
    { ch: '=>',   x: 14, y: 72, delay: -8,   dur: 20, size: 28, rot: -4  },
    { ch: '( )',  x: 82, y: 70, delay: -12,  dur: 28, size: 24, rot: 6   },
    { ch: '*',    x: 50, y: 12, delay: -2,   dur: 18, size: 18, rot: 0   },
    { ch: '#',    x: 30, y: 88, delay: -6,   dur: 24, size: 22, rot: 8   },
    { ch: '\\\\', x: 70, y: 90, delay: -10,  dur: 22, size: 20, rot: -10 },
    { ch: '$',    x: 4,  y: 50, delay: -14,  dur: 26, size: 22, rot: 4   },
    { ch: '@',    x: 94, y: 50, delay: -16,  dur: 24, size: 20, rot: -6  }
  ];

  @HostListener('window:mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    const orbEls = this.orbs.nativeElement.querySelectorAll<HTMLElement>('.orb');
    orbEls.forEach((orb, i) => {
      const factor = (i + 1) * 0.5;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }
}
