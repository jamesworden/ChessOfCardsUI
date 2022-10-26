import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(
    public signalrService: SignalrService,
    public modal: MatDialog,
    public snackBar: MatSnackBar
  ) {
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

  onHowToPlay() {
    this.snackBar.open('Under construction.', 'Coming soon!', {
      duration: 1500,
      verticalPosition: 'top',
    });
  }

  onLogin() {
    this.snackBar.open('Under construction.', 'Coming soon!', {
      duration: 1500,
      verticalPosition: 'top',
    });
  }

  onGameEnded() {
    this.currentView = Views.Home;
  }

  onJoinBackButtonClicked() {
    this.currentView = Views.HostOrJoin;
  }

  onHostBackButtonClicked() {
    this.currentView = Views.HostOrJoin;
  }

  onPlayAsGuest() {
    if (this.isConnectedToServer) {
      this.currentView = Views.HostOrJoin;
      return;
    }

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
