import { Component, inject } from '@angular/core';
import { ToggleNavbar } from '../../actions/navbar.actions';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavbarState } from '../../state/navbar.state';
import { fadeInOutAnimation } from '../../animations/fade-in-out.animation';
import { DEMO_PLAYER_GAME_VIEW } from '../../views/home-view/data/demo-player-game-view';
import { ResponsiveSizeService } from '../../views/game-view/services/responsive-size.service';

@Component({
  selector: 'app-hamburger-menu-button',
  templateUrl: './hamburger-menu-button.component.html',
  styleUrl: './hamburger-menu-button.component.css',
  animations: [fadeInOutAnimation],
})
export class HamburgerMenuButtonComponent {
  readonly DEMO_PLAYER_GAME_VIEW = DEMO_PLAYER_GAME_VIEW;

  readonly #store = inject(Store);
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  @Select(NavbarState.isOpen)
  isOpen$!: Observable<boolean>;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  toggleHamburgerMenu() {
    this.#store.dispatch(new ToggleNavbar());
  }
}
