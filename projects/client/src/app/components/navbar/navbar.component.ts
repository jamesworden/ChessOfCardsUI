import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { Breakpoint } from '../../models/breakpoint.model';
import { ResponsiveSizeService } from '../../views/game-view/services/responsive-size.service';
import { UpdateView } from '../../actions/view.actions';
import { View } from '../../views';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly Breakpoint = Breakpoint;

  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #store = inject(Store);

  readonly breakpoint$ = this.#responsiveSizeService.breakpoint$;
  readonly hamburgerMenuOpen$ = new BehaviorSubject<boolean>(false);

  updateView(view: View) {
    this.#store.dispatch(new UpdateView(view));
  }

  toggleHamburgerMenu() {
    const currentValue = this.hamburgerMenuOpen$.getValue();
    this.hamburgerMenuOpen$.next(!currentValue);
  }
}
