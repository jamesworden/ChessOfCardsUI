import { Component, OnDestroy } from '@angular/core';
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

  constructor(public signalrService: SignalrService) {
    this.sm.add(
      this.signalrService.gameCode$.subscribe((gameCode) => {
        this.gameCode = gameCode;
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }
}
