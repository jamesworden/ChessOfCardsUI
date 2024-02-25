import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { DEMO_PLAYER_GAME_VIEW } from './data/demo-player-game-view';
import { ResponsiveSizeService } from '../game-view/services/responsive-size.service';
import {
  LEFT_CARD_WHEEL_CARDS,
  RIGHT_CARD_WHEEL_CARDS,
} from './data/card-wheel-cards';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css'],
})
export class HomeViewComponent {
  readonly DEMO_PLAYER_GAME_VIEW = DEMO_PLAYER_GAME_VIEW;
  readonly RIGHT_CARD_WHEEL_CARDS = RIGHT_CARD_WHEEL_CARDS;
  readonly LEFT_CARD_WHEEL_CARDS = LEFT_CARD_WHEEL_CARDS;

  readonly #store = inject(Store);
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  onHowToPlay() {
    this.#store.dispatch(new UpdateView(View.Tutorial));
  }

  onPlayAsGuest() {
    this.#store.dispatch(new UpdateView(View.HostOrJoin));
  }
}
