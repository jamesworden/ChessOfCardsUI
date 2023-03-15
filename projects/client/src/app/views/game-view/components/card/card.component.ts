import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { Card } from '../../../../models/card.model';
import { PlayerOrNone } from '../../../../models/player-or-none.model';
import { ResponsiveSizeService } from '../../services/responsive-size.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnChanges, OnDestroy {
  private sm = new SubscriptionManager();

  @Input() cardImageFileName?: string | null;
  @Input() playerCanDrag = false;
  @Input() card: Card;
  @Input() isMiddleCard: boolean;
  @Input() isPlayedBy: PlayerOrNone;
  @Input() isHost: boolean;
  @Input() backgroundColor?: string | null;

  tiltDegrees = 0;
  cardSize: number;

  constructor(public responsiveSizeService: ResponsiveSizeService) {
    this.sm.add(
      responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
  }

  ngOnChanges() {
    this.tiltCardIfMiddle();
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  tiltCardIfMiddle() {
    const nobodyPlayedCard = this.isPlayedBy === PlayerOrNone.None;

    if (nobodyPlayedCard || !this.isMiddleCard) {
      return;
    }

    const hostCardAndIsHost =
      this.isHost && this.isPlayedBy === PlayerOrNone.Host;
    const guestCardAndIsGuest =
      !this.isHost && this.isPlayedBy === PlayerOrNone.Guest;
    const playerPlayedCard = hostCardAndIsHost || guestCardAndIsGuest;

    this.tiltDegrees = playerPlayedCard ? 45 : -45;
  }
}
