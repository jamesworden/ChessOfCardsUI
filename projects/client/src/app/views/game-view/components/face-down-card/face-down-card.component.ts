import { Component, OnDestroy } from '@angular/core';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { ResponsiveSizeService } from '../../services/responsive-size.service';

@Component({
  selector: 'app-face-down-card',
  templateUrl: './face-down-card.component.html',
  styleUrls: ['./face-down-card.component.scss'],
})
export class FaceDownCardComponent implements OnDestroy {
  private sm = new SubscriptionManager();

  cardSize: number;

  constructor(public responsiveSizeService: ResponsiveSizeService) {
    this.sm.add(
      responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }
}
