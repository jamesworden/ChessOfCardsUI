import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlayedByModel } from 'src/app/models/played-by.model';

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
  @Input() isPlayedBy: PlayedByModel;
  @Input() isHost: boolean;

  tiltDegrees = 0;

  constructor() {}

  ngOnChanges() {
    const tiltRight =
      (this.isHost &&
        this.isMiddleCard &&
        this.isPlayedBy === PlayedByModel.Host) ||
      (!this.isHost &&
        this.isMiddleCard &&
        this.isPlayedBy === PlayedByModel.Host);

    const tiltLeft =
      (this.isHost &&
        this.isMiddleCard &&
        this.isPlayedBy === PlayedByModel.Guest) ||
      (!this.isHost &&
        this.isMiddleCard &&
        this.isPlayedBy === PlayedByModel.Guest);

    if (tiltRight) {
      this.tiltDegrees = 45;
    } else if (tiltLeft) {
      this.tiltDegrees = -45;
    }
  }
}
