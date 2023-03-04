import { Component, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { SignalrService } from '../../services/SignalRService';
import { GameState } from '../../state/game.state';
import { SubscriptionManager } from '../../util/subscription-manager';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-host-view',
  templateUrl: './host-view.component.html',
  styleUrls: ['./host-view.component.css'],
})
export class HostViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Select(GameState.gameCode)
  gameCode$: Observable<string | null>;

  constructor(public signalrService: SignalrService, private store: Store) {
    this.sm.add(
      this.gameCode$.subscribe((gameCode) => {
        if (!gameCode) {
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
