import { Component, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { GameState } from '../../state/game.state';
import { SubscriptionManager } from '../../util/subscription-manager';
import { Observable } from 'rxjs';
import { CreateGame } from '../../actions/game.actions';

@Component({
  selector: 'app-host-view',
  templateUrl: './host-view.component.html',
  styleUrls: ['./host-view.component.css'],
})
export class HostViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Select(GameState.gameCode)
  gameCode$: Observable<string | null>;

  constructor(private store: Store) {
    this.sm.add(
      this.gameCode$.subscribe((gameCode) => {
        if (!gameCode) {
          this.store.dispatch(new CreateGame());
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
