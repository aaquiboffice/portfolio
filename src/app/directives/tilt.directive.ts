import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

/**
 * 3D tilt with spotlight: the element rotates in perspective toward the cursor
 * and exposes --spot-x / --spot-y CSS variables (0–100%) so styles can place a
 * specular highlight that follows the mouse. Uses spring-style lerp so motion
 * has the soft, expensive feel of a real interaction, not a CSS transition.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true
})
export class TiltDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Input() tiltMax = 7;
  @Input() perspective = 1100;
  @Input() lerp = 0.14;

  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private active = false;
  private rafId: number | null = null;

  @HostListener('mouseenter')
  onEnter(): void {
    this.active = true;
    this.el.nativeElement.classList.add('is-tilting');
    this.tick();
  }

  @HostListener('mousemove', ['$event'])
  onMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    // rotateX is inverse of vertical position (top → tilt forward)
    this.targetX = (0.5 - py) * 2 * this.tiltMax;
    this.targetY = (px - 0.5) * 2 * this.tiltMax;

    const host = this.el.nativeElement;
    host.style.setProperty('--spot-x', (px * 100).toFixed(2) + '%');
    host.style.setProperty('--spot-y', (py * 100).toFixed(2) + '%');

    this.tick();
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.active = false;
    this.targetX = 0;
    this.targetY = 0;
    this.tick();
  }

  private tick = (): void => {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.currentX += (this.targetX - this.currentX) * this.lerp;
      this.currentY += (this.targetY - this.currentY) * this.lerp;

      const host = this.el.nativeElement;
      host.style.transform =
        `perspective(${this.perspective}px) ` +
        `rotateX(${this.currentX.toFixed(2)}deg) ` +
        `rotateY(${this.currentY.toFixed(2)}deg)`;

      const dx = this.targetX - this.currentX;
      const dy = this.targetY - this.currentY;
      if (Math.abs(dx) > 0.04 || Math.abs(dy) > 0.04) {
        this.tick();
      } else if (!this.active) {
        host.classList.remove('is-tilting');
        host.style.transform = '';
      }
    });
  };
}
