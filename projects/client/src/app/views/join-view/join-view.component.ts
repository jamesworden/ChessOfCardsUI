import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { SignalrService } from '../../services/SignalRService';
import { SubscriptionManager } from '../../util/subscription-manager';

@Component({
  selector: 'app-join-view',
  templateUrl: './join-view.component.html',
  styleUrls: ['./join-view.component.css'],
})
export class JoinViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  gameCodeIsInvalid = false;
  gameCodeInput = '';

  constructor(public signalrService: SignalrService, private store: Store) {
    this.sm.add(
      signalrService.gameCodeIsInvalid$.subscribe((invalidGameCode) => {
        this.gameCodeIsInvalid = invalidGameCode;
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  onInputChanged() {
    if (this.gameCodeInput.length === 4) {
      const upperCaseGameCode = this.gameCodeInput.toUpperCase();
      this.signalrService.joinGame(upperCaseGameCode);
      return;
    }

    this.gameCodeIsInvalid = false;
  }

  onBack() {
    this.store.dispatch(new UpdateView(View.HostOrJoin));
  }
}
