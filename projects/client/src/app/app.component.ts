import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignalrService } from './services/SignalRService';
import { Views } from './views';
import { ModalComponent } from './views/game-view/modal/modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  views = Views;
  currentView = Views.Home;

  constructor(public signalrService: SignalrService, public modal: MatDialog) {
    signalrService.gameStarted$.subscribe(() => {
      this.currentView = Views.Game;
    });
  }

  onClickHostGameEvent() {
    const isConnectedToServer =
      this.signalrService.connectionEstablished$.getValue();

    if (!isConnectedToServer) {
      this.openCantConnectModal();
      return;
    }

    this.signalrService.createGame();
    this.currentView = Views.Host;
  }

  onClickJoinGameEvent() {
    const isConnectedToServer =
      this.signalrService.connectionEstablished$.getValue();

    if (!isConnectedToServer) {
      this.openCantConnectModal();
      return;
    }

    this.currentView = Views.Join;
  }

  onGameEnded() {
    this.currentView = Views.Home;
  }

  private openCantConnectModal() {
    const modalRef = this.modal.open(ModalComponent, {
      width: '250px',
      data: {
        message: 'Could not connect to the server! Please try again.',
      },
    });

    modalRef.afterClosed().subscribe(() => {
      this.signalrService.startConnection();
    });
  }
}
