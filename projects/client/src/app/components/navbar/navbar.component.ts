import { Component, inject } from '@angular/core';
import { Select } from '@ngxs/store';
import { Breakpoint } from '../../models/breakpoint.model';
import { ResponsiveSizeService } from '../../views/game-view/services/responsive-size.service';
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

  readonly breakpoint$ = this.#responsiveSizeService.breakpoint$;
}
