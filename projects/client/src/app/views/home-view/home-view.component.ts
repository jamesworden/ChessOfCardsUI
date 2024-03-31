import { Component, inject } from '@angular/core';
import { DEMO_PLAYER_GAME_VIEW } from '../../metadata/demo-player-game-view';
import { ResponsiveSizeService } from '../game-view/services/responsive-size.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
})
export class HomeViewComponent {
  readonly DEMO_PLAYER_GAME_VIEW = DEMO_PLAYER_GAME_VIEW;

  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #router = inject(Router);

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
}
