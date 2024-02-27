import { Component, inject } from '@angular/core';
import { ToggleNavbar } from '../../actions/navbar.actions';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavbarState } from '../../state/navbar.state';
import { fadeInOutAnimation } from '../../animations/fade-in-out.animation';

@Component({
  selector: 'app-hamburger-menu-button',
  templateUrl: './hamburger-menu-button.component.html',
  styleUrl: './hamburger-menu-button.component.css',
  animations: [fadeInOutAnimation],
})
export class HamburgerMenuButtonComponent {
  readonly #store = inject(Store);

  @Select(NavbarState.isOpen)
  isOpen$!: Observable<boolean>;

  toggleHamburgerMenu() {
    this.#store.dispatch(new ToggleNavbar());
  }
}
