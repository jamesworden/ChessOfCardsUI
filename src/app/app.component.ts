import { Component } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SignalrService } from './services/SignalRService';
import { Views } from './constants';
import { JoinGameEvent } from './events';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Lanes';
  showWarningMessage = false;
  views = Views;
  currentView = Views.Home;

  constructor(public signalrService: SignalrService) {
    signalrService.gameStarted.subscribe(() => {
      this.currentView = Views.Game;
    });
  }

  onClickHostGameEvent() {
    const isConnectedToServer =
      this.signalrService.connectionEstablished$.getValue();
    if (!isConnectedToServer) {
      this.showWarningMessage = true;
      return;
    }

    this.signalrService.createGame();
    this.currentView = Views.Host;
  }

  onClickJoinGameEvent() {
    const isConnectedToServer =
      this.signalrService.connectionEstablished$.getValue();
    if (!isConnectedToServer) {
      this.showWarningMessage = true;
      return;
    }

    this.currentView = Views.Join;
  }
}
