import { Component, Input, OnChanges } from '@angular/core';
import { CardModel } from '../../../../models/card.model';
import { PlayerOrNoneModel } from '../../../../models/player-or-none-model';
import { ResponsiveSizeService } from '../../services/responsive-size.service';

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

  tiltDegrees = 0;

  constructor(public responsiveSizeService: ResponsiveSizeService) {}

  ngOnChanges() {
    this.tiltCardIfMiddle();
  }

  tiltCardIfMiddle() {
    const nobodyPlayedCard = this.isPlayedBy === PlayerOrNoneModel.None;

    if (nobodyPlayedCard || !this.isMiddleCard) {
      return;
    }

    const hostCardAndIsHost =
      this.isHost && this.isPlayedBy === PlayerOrNoneModel.Host;
    const guestCardAndIsGuest =
      !this.isHost && this.isPlayedBy === PlayerOrNoneModel.Guest;
    const playerPlayedCard = hostCardAndIsHost || guestCardAndIsGuest;

    this.tiltDegrees = playerPlayedCard ? 45 : -45;
  }
}
