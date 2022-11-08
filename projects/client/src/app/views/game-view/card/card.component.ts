import { Component, Input, OnChanges } from '@angular/core';
import { CardModel } from '../../../models/card.model';
import { PlayerOrNoneModel } from '../../../models/player-or-none-model';
import { SubscriptionManager } from '../../../util/subscription-manager';
import { ResponsiveSizeService } from '../responsive-size.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnChanges {
  @Input() cardImageFileName?: string | null;
  @Input() playerCanDrag = false;
  @Input() card: CardModel;
  @Input() isMiddleCard: boolean;
  @Input() isPlayedBy: PlayerOrNoneModel;
  @Input() isHost: boolean;
  @Input() backgroundColor?: string | null;

  private sm = new SubscriptionManager();

  tiltDegrees = 0;
  cardSize = 64;

  constructor(public responsiveSizeService: ResponsiveSizeService) {
    this.sm.add(
      responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
  }

  ngOnChanges() {
    const tiltRight =
      (this.isHost &&
        this.isMiddleCard &&
        this.isPlayedBy === PlayerOrNoneModel.Host) ||
      (!this.isHost &&
        this.isMiddleCard &&
        this.isPlayedBy === PlayerOrNoneModel.Host);

    const tiltLeft =
      (this.isHost &&
        this.isMiddleCard &&
        this.isPlayedBy === PlayerOrNoneModel.Guest) ||
      (!this.isHost &&
        this.isMiddleCard &&
        this.isPlayedBy === PlayerOrNoneModel.Guest);

    if (tiltRight) {
      this.tiltDegrees = 45;
    } else if (tiltLeft) {
      this.tiltDegrees = -45;
    }
  }

  getImageHeight() {
    const pixels = this.cardSize;
    return pixels + 'px';
  }

  getImageWidth() {
    const pixels = this.cardSize;
    return pixels + 'px';
  }
}
