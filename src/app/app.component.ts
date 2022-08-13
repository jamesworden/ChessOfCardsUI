import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { SignalrService } from './services/SignalRService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Lanes';
  currentView = 'home-view';
  gameCode$: Subject<string>;
  warningMessage = '';

  constructor(public signalrService: SignalrService) {
    this.gameCode$ = signalrService.gameCode$;
  }

  hostGameEvent() {
    const hasConnectedToServer =
      this.signalrService.connectionEstablished$.getValue();

    if (hasConnectedToServer) {
      this.signalrService.createGame();
      this.currentView = 'host-view';
      return;
    }

    this.warningMessage = 'Failed to connect to the server.';
  }
}
