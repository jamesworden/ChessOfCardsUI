import { Component, Input, OnDestroy } from '@angular/core';
import { SignalrService } from '../../services/SignalRService';
import { SubscriptionManager } from '../../util/subscription-manager';

@Component({
  selector: 'app-join-view',
  templateUrl: './join-view.component.html',
  styleUrls: ['./join-view.component.css'],
})
export class JoinViewComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  @Input() invalidGameCode = false;

  gameCodeInput = '';

  constructor(public signalrService: SignalrService) {
    this.sm.add(
      signalrService.invalidGameCode$.subscribe((invalidGameCode) => {
        this.invalidGameCode = invalidGameCode;
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

    this.invalidGameCode = false;
  }
}
