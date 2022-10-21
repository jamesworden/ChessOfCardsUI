import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { SignalrService } from '../../services/SignalRService';
import { SubscriptionManager } from '../../util/subscription-manager';

@Component({
  selector: 'app-join-view',
  templateUrl: './join-view.component.html',
  styleUrls: ['./join-view.component.css'],
})
export class JoinViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Output() backButtonClicked = new EventEmitter();

  gameCodeIsInvalid = false;
  gameCodeInput = '';

  constructor(public signalrService: SignalrService) {
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

  onBackButtonClicked() {
    this.backButtonClicked.emit();
  }
}
