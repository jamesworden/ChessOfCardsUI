import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavbarState } from './state/navbar.state';
import { fadeInOutAnimation } from './animations/fade-in-out.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInOutAnimation],
})
export class AppComponent {
  @Select(NavbarState.isOpen)
  isOpen$: Observable<boolean>;
}
