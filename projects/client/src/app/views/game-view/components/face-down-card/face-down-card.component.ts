import { Component, inject } from '@angular/core';
import { ResponsiveSizeService } from '../../services/responsive-size.service';

@Component({
  selector: 'app-face-down-card',
  templateUrl: './face-down-card.component.html',
  styleUrls: ['./face-down-card.component.scss'],
})
export class FaceDownCardComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService)
  
  public cardSize$ = this.#responsiveSizeService.cardSize$;
}
