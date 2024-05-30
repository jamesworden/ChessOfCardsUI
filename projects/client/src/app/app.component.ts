import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { fadeInOutAnimation } from '@shared/animations';
import { ConnectToServer } from '@shared/game';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInOutAnimation],
})
export class AppComponent {
  readonly #store = inject(Store);

  constructor() {
    this.#store.dispatch(new ConnectToServer(environment));
  }
}
