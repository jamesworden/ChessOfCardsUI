import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignalrService } from './services/SignalRService';
import { SubscriptionManager } from './util/subscription-manager';
import { Views } from './views';
import { ModalComponent } from './views/game-view/modal/modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  views = Views;
  currentView = Views.Home;
  gameCode: string;
  isConnectedToServer = false;

  constructor(public signalrService: SignalrService, public modal: MatDialog) {
    this.sm.add(
      signalrService.gameStarted$.subscribe(() => {
        this.currentView = Views.Game;
      })
    );
    this.sm.add(
      this.signalrService.gameCode$.subscribe((gameCode) => {
        this.gameCode = gameCode;
      })
    );
    this.sm.add(
      this.signalrService.isConnectedToServer$.subscribe(
        (isConnectedToServer) => {
          this.isConnectedToServer = isConnectedToServer;
        }
      )
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  onHostGameButtonClicked() {
    if (!this.isConnectedToServer) {
      this.openCantConnectModal();
      return;
    }

    if (!this.gameCode) {
      this.signalrService.createGame();
    }

    this.currentView = Views.Host;
  }

  onJoinGameButtonClicked() {
    if (!this.isConnectedToServer) {
      this.openCantConnectModal();
      return;
    }

    this.currentView = Views.Join;
  }

  onBackButtonClicked() {
    this.currentView = Views.Home;
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
