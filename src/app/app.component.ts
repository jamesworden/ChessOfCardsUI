import { Component } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SignalrService } from './services/SignalRService';
import { Views } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Lanes';

  gameCode$: BehaviorSubject<string>;
  showWarningMessage = false;

  views = Views;
  currentView = Views.Home;

  constructor(public signalrService: SignalrService) {
    this.gameCode$ = signalrService.gameCode$;
  }

  hostGameEvent() {
    const isConnectedToServer =
      this.signalrService.connectionEstablished$.getValue();
    if (!isConnectedToServer) {
      this.showWarningMessage = true;
      return;
    }

    this.signalrService.createGame();
    this.currentView = Views.Host;
  }

  joinGameEvent() {
    const isConnectedToServer =
      this.signalrService.connectionEstablished$.getValue();
    if (!isConnectedToServer) {
      this.showWarningMessage = true;
      return;
    }

    this.signalrService.joinGame();
    this.currentView = Views.Join;
  }

  goToGameView() {
    this.currentView = Views.Game;
  }
}
