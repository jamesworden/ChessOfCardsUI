import { Component, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { GameState } from '../../state/game.state';
import { SubscriptionManager } from '../../util/subscription-manager';
import { Observable } from 'rxjs';
import { CreateGame, SelectDurationOption } from '../../actions/game.actions';
import { DurationOption } from '../../models/duration-option.model';
import { PendingGameView } from '../../models/pending-game-view.model';

@Component({
  selector: 'app-host-view',
  templateUrl: './host-view.component.html',
  styleUrls: ['./host-view.component.css'],
})
export class HostViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Select(GameState.pendingGameView)
  pendingGameView$: Observable<PendingGameView | null>;

  DurationOption = DurationOption;

  gameCode: string | null = null;
  selectedDurationOption: DurationOption | null = null;

  constructor(private store: Store) {
    this.sm.add(
      this.pendingGameView$.subscribe((pendingGameView) => {
        if (pendingGameView) {
          this.gameCode = pendingGameView.GameCode;
          this.selectedDurationOption = pendingGameView.DurationOption;
        } else {
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

  selectDurationOption(durationOption: DurationOption) {
    this.store.dispatch(new SelectDurationOption(durationOption));
  }
}
