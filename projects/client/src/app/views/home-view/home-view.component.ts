import { Component, inject } from '@angular/core';
import { toggleDarkMode } from '../../logic/toggle-dark-mode';
import { fadeInOutAnimation } from '@shared/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
  animations: [fadeInOutAnimation],
})
export class HomeViewComponent {
  readonly #router = inject(Router);

  toggleDarkMode() {
    toggleDarkMode();
  }

  goToGameView() {
    this.#router.navigate(['game']);
  }
}
