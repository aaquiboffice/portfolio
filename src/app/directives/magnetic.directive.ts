import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

/**
 * Subtle "magnetic" pull: the element slides slightly toward the cursor
 * on hover. Looks great on CTAs.
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true
})
export class MagneticDirective {
  private readonly el = inject(ElementRef<HTMLElement>);

  @Input('appMagnetic') strength = 0.35;

  private rafId: number | null = null;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;

  @HostListener('mousemove', ['$event'])
  onMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = event.clientX - cx;
    const dy = event.clientY - cy;

    this.targetX = dx * this.strength;
    this.targetY = dy * this.strength;
    this.tick();
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.targetX = 0;
    this.targetY = 0;
    this.tick();
  }

  private tick = (): void => {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.currentX += (this.targetX - this.currentX) * 0.18;
      this.currentY += (this.targetY - this.currentY) * 0.18;
      this.el.nativeElement.style.transform =
        `translate(${this.currentX.toFixed(2)}px, ${this.currentY.toFixed(2)}px)`;
      if (
        Math.abs(this.targetX - this.currentX) > 0.1 ||
        Math.abs(this.targetY - this.currentY) > 0.1
      ) {
        this.tick();
      }
    });
  };
}
