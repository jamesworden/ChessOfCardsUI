import { Component, inject } from '@angular/core';
import { ResponsiveSizeService } from '@shared/game';

@Component({
  selector: 'game-face-down-card',
  templateUrl: './face-down-card.component.html',
  styleUrls: ['./face-down-card.component.scss'],
})
export class FaceDownCardComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
}
