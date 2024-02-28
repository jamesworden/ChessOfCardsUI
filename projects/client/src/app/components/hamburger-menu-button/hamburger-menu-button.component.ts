import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ToggleNavbar } from '../../actions/navbar.actions';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { NavbarState } from '../../state/navbar.state';
import { fadeInOutAnimation } from '../../animations/fade-in-out.animation';
import { DEMO_PLAYER_GAME_VIEW } from '../../metadata/demo-player-game-view';
import { ResponsiveSizeService } from '../../views/game-view/services/responsive-size.service';
import { SubscriptionManager } from '../../util/subscription-manager';
import { Breakpoint } from '../../models/breakpoint.model';

@Component({
  selector: 'app-hamburger-menu-button',
  templateUrl: './hamburger-menu-button.component.html',
  styleUrl: './hamburger-menu-button.component.css',
  animations: [fadeInOutAnimation],
})
export class HamburgerMenuButtonComponent implements OnInit, OnDestroy {
  private readonly sm = new SubscriptionManager();

  readonly DEMO_PLAYER_GAME_VIEW = DEMO_PLAYER_GAME_VIEW;

  readonly #store = inject(Store);
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  @Select(NavbarState.isOpen)
  isOpen$!: Observable<boolean>;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly breakpoint$ = this.#responsiveSizeService.breakpoint$;

  ngOnInit() {
    this.sm.add(
      combineLatest([this.isOpen$, this.breakpoint$]).subscribe(
        ([isOpen, breakpoint]) => {
          if (isOpen && breakpoint !== Breakpoint.Mobile) {
            this.toggleHamburgerMenu();
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  toggleHamburgerMenu() {
    this.#store.dispatch(new ToggleNavbar());
  }
}
