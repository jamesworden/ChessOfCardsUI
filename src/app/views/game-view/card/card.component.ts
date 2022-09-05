import { Component, Input, OnChanges } from '@angular/core';
import { PlayerOrNoneModel } from 'src/app/models/player-or-none-model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnChanges {
  @Input() cardImageFileName: string;
  @Input() playerCanDrag = false;
  @Input() suit: string;
  @Input() kind: string;
  @Input() isMiddleCard: boolean;
  @Input() isPlayedBy: PlayerOrNoneModel;
  @Input() isHost: boolean;
  @Input() joker = false;

  tiltDegrees = 0;

  constructor() {}

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
}
