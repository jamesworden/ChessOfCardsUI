import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { SignalrService } from '../../services/SignalRService';
import { SubscriptionManager } from '../../util/subscription-manager';

@Component({
  selector: 'app-host-view',
  templateUrl: './host-view.component.html',
  styleUrls: ['./host-view.component.css'],
})
export class HostViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  gameCode = '';

  constructor(public signalrService: SignalrService, private store: Store) {
    this.sm.add(
      this.signalrService.gameCode$.subscribe((gameCode) => {
        if (gameCode) {
          this.gameCode = gameCode;
        } else {
          this.signalrService.createGame();
        }
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  onBack() {
    this.store.dispatch(new UpdateView(View.HostOrJoin));
  }
}
