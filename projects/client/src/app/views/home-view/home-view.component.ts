import { Component, inject } from '@angular/core';
import { ResponsiveSizeService } from '../game-view/services/responsive-size.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
})
export class HomeViewComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #router = inject(Router);

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  scrollToPlayNow() {
    const playNowSection = document.getElementById('play-now-section');
    playNowSection?.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
