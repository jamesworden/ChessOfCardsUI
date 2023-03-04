import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { SignalrService } from '../../services/SignalRService';
import { ServerState } from '../../state/server.state';
import { SubscriptionManager } from '../../util/subscription-manager';
import { ModalComponent } from '../game-view/components/modal/modal.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-host-or-join-view',
  templateUrl: './host-or-join-view.component.html',
  styleUrls: ['./host-or-join-view.component.css'],
})
export class HostOrJoinViewComponent {
  private sm = new SubscriptionManager();

  @Select(ServerState.isConnectedToServer)
  isConnectedToServer$: Observable<boolean>;

  isConnectedToServer = false;

  constructor(
    private store: Store,
    private signalrService: SignalrService,
    private modal: MatDialog
  ) {
    this.sm.add(
      this.isConnectedToServer$.subscribe((isConnectedToServer) => {
        this.isConnectedToServer = isConnectedToServer;
      })
    );
  }

  onHostGame() {
    if (this.isConnectedToServer) {
      this.store.dispatch(new UpdateView(View.Host));
    } else {
      this.openRetryConnectionModal();
    }
  }

  onJoinGame() {
    if (this.isConnectedToServer) {
      this.store.dispatch(new UpdateView(View.Join));
    } else {
      this.openRetryConnectionModal();
    }
  }

  onBack() {
    this.store.dispatch(new UpdateView(View.Home));
  }

  openRetryConnectionModal() {
    const modalRef = this.modal.open(ModalComponent, {
      width: '250px',
      data: {
        message: 'Could not connect to the server! Please try again.',
      },
    });

    modalRef.afterClosed().subscribe(() => {
      this.signalrService.connectToServer();
    });
  }
}
