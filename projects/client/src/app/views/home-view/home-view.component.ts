import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { DEMO_PLAYER_GAME_VIEW } from './data/demo-player-game-view';
import { ResponsiveSizeService } from '../game-view/services/responsive-size.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css'],
})
export class HomeViewComponent {
  readonly DEMO_PLAYER_GAME_VIEW = DEMO_PLAYER_GAME_VIEW;

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
