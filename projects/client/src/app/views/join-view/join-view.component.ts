import { Component, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { SignalrService } from '../../services/SignalRService';
import { GameState } from '../../state/game.state';
import { SubscriptionManager } from '../../util/subscription-manager';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-join-view',
  templateUrl: './join-view.component.html',
  styleUrls: ['./join-view.component.css'],
})
export class JoinViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Select(GameState.gameCode)
  gameCode$: Observable<string | null>;

  gameCodeIsInvalid = false;
  gameCodeInput = '';
  gameCode: string | null = null;

  constructor(public signalrService: SignalrService, private store: Store) {
    this.sm.add(
      signalrService.gameCodeIsInvalid$.subscribe((invalidGameCode) => {
        this.gameCodeIsInvalid = invalidGameCode;
      })
    );
    this.sm.add(
      this.gameCode$.subscribe((gameCode) => {
        this.gameCode = gameCode;
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  onInputChanged() {
    if (this.gameCodeInput.length !== 4) {
      this.gameCodeIsInvalid = false;
      return;
    }

    const upperCaseGameCode = this.gameCodeInput.toUpperCase();

    if (upperCaseGameCode === this.gameCode) {
      this.gameCodeIsInvalid = true;
      return;
    }

    this.signalrService.joinGame(upperCaseGameCode);
    return;
  }

  onBack() {
    this.store.dispatch(new UpdateView(View.HostOrJoin));
  }
}
