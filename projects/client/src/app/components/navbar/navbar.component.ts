import { Component, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Breakpoint } from '../../models/breakpoint.model';
import { ResponsiveSizeService } from '../../views/game-view/services/responsive-size.service';
import { UpdateView } from '../../actions/view.actions';
import { View } from '../../views';
import { NavbarState } from '../../state/navbar.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly Breakpoint = Breakpoint;

  @Select(NavbarState.isOpen)
  isOpen$!: Observable<boolean>;

  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #store = inject(Store);

  readonly breakpoint$ = this.#responsiveSizeService.breakpoint$;

  updateView(view: View) {
    this.#store.dispatch(new UpdateView(view));
  }
}
