import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackgroundComponent } from './components/background/background.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollProgressComponent } from './components/scroll-progress/scroll-progress.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { SideRailComponent } from './components/side-rail/side-rail.component';
import { LenisService } from './services/lenis.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BackgroundComponent,
    NavComponent,
    FooterComponent,
    ScrollProgressComponent,
    PreloaderComponent,
    SideRailComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private readonly lenis = inject(LenisService);
  private readonly destroyRef = inject(DestroyRef);

  title = 'aaquib-portfolio';

  ngOnInit(): void {
    this.lenis.initialize();
    this.destroyRef.onDestroy(() => this.lenis.destroy());
  }
}
