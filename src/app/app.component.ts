import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackgroundComponent } from './components/background/background.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScrollProgressComponent } from './components/scroll-progress/scroll-progress.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BackgroundComponent,
    NavComponent,
    FooterComponent,
    ScrollProgressComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'aaquib-portfolio';
}
