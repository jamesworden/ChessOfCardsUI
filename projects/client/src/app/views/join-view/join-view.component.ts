import { Component, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { GameState } from '../../state/game.state';
import { SubscriptionManager } from '../../util/subscription-manager';
import { Observable } from 'rxjs';
import { JoinGame, SetGameCodeIsInvalid } from '../../actions/game.actions';
import { PendingGameView } from '../../models/pending-game-view.model';

@Component({
  selector: 'app-join-view',
  templateUrl: './join-view.component.html',
  styleUrls: ['./join-view.component.css'],
})
export class JoinViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Select(GameState.pendingGameView)
  pendingGameView$: Observable<PendingGameView | null>;

  @Select(GameState.gameCodeIsInvalid)
  gameCodeIsInvalid$!: Observable<boolean>;

  gameCodeIsInvalid = false;
  gameCodeInput = '';
  gameCode: string | null = null;

  constructor(private store: Store) {
    this.sm.add(
      this.gameCodeIsInvalid$.subscribe((invalidGameCode) => {
        this.gameCodeIsInvalid = invalidGameCode;
      })
    );
    this.sm.add(
      this.pendingGameView$.subscribe((pendingGameView) => {
        this.gameCode = pendingGameView?.GameCode ?? null;
      })
    );
    this.sm.add(
      this.gameCodeIsInvalid$.subscribe((gameCodeIsInvalid) => {
        this.gameCodeIsInvalid = gameCodeIsInvalid;
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  onInputChanged() {
    if (this.gameCodeInput.length !== 4) {
      this.store.dispatch(new SetGameCodeIsInvalid(false));
      return;
    }

    const upperCaseGameCode = this.gameCodeInput.toUpperCase();

    if (upperCaseGameCode === this.gameCode) {
      this.store.dispatch(new SetGameCodeIsInvalid(true));
      return;
    }

    this.store.dispatch(new JoinGame(upperCaseGameCode));
    return;
  }

  onBack() {
    this.store.dispatch(new UpdateView(View.HostOrJoin));
  }
}
