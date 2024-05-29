import { Component, inject } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { toggleDarkMode } from '../../logic/toggle-dark-mode';
import { fadeInOutAnimation } from '@shared/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
  animations: [fadeInOutAnimation],
})
export class HomeViewComponent {
  readonly #router = inject(Router);
  readonly #clipboard = inject(Clipboard);
  readonly #matSnackBar = inject(MatSnackBar);

  copyToClipboard(text: string) {
    this.#clipboard.copy(text);
    this.#matSnackBar.open('Copied to clipboard.', 'Hide', {
      duration: 3000,
      verticalPosition: 'bottom',
    });
  }

  toggleDarkMode() {
    toggleDarkMode();
  }

  goToGameView() {
    this.#router.navigate(['game']);
  }
}
