import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { ViewState } from './state/view.state';
import { View } from './views';
import { Observable } from 'rxjs';
import { NavbarState } from './state/navbar.state';
import { fadeInOutAnimation } from './animations/fade-in-out.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeInOutAnimation],
})
export class AppComponent {
  readonly View = View;

  @Select(ViewState.currentView)
  currentView$: Observable<View>;

  @Select(NavbarState.isOpen)
  isOpen$: Observable<boolean>;
}
