import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';

@Component({
  selector: 'app-background',
  standalone: true,
  templateUrl: './background.component.html',
  styleUrl: './background.component.scss'
})
export class BackgroundComponent implements AfterViewInit, OnDestroy {
  private readonly zone = inject(NgZone);

  @ViewChild('cursorGlow', { static: true }) cursorGlow!: ElementRef<HTMLDivElement>;
  @ViewChild('orbs', { static: true }) orbs!: ElementRef<HTMLDivElement>;

  private mouseX = 0;
  private mouseY = 0;
  private glowX = 0;
  private glowY = 0;
  private rafId?: number;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.animateGlow());
  }

  ngOnDestroy(): void {
    if (this.rafId !== undefined) cancelAnimationFrame(this.rafId);
  }

  @HostListener('window:mousemove', ['$event'])
  onMove(e: MouseEvent): void {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.cursorGlow.nativeElement.style.opacity = '1';

    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    const orbEls = this.orbs.nativeElement.querySelectorAll<HTMLElement>('.orb');
    orbEls.forEach((orb, i) => {
      const factor = (i + 1) * 0.5;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }

  @HostListener('window:mouseleave')
  onLeave(): void {
    this.cursorGlow.nativeElement.style.opacity = '0';
  }

  private animateGlow = (): void => {
    this.glowX += (this.mouseX - this.glowX) * 0.1;
    this.glowY += (this.mouseY - this.glowY) * 0.1;
    const el = this.cursorGlow.nativeElement;
    el.style.left = this.glowX + 'px';
    el.style.top = this.glowY + 'px';
    this.rafId = requestAnimationFrame(this.animateGlow);
  };
}
