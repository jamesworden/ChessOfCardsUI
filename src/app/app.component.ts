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

  constructor(public signalrService: SignalrService) {
    this.gameCode$ = signalrService.gameCode$;
  }

  hostGameEvent() {
    this.signalrService.createGame();
    this.currentView = 'host-view';
  }
}
