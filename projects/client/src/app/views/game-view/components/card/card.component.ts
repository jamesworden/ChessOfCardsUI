import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  HostBinding,
} from '@angular/core';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { Card } from '../../../../models/card.model';
import { PlayerOrNone } from '../../../../models/player-or-none.model';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { getCardImageFileName } from 'projects/client/src/app/util/get-asset-file-names';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnDestroy, OnInit {
  private sm = new SubscriptionManager();

  /*
   * When rearranging cards inside player hand, sometimes multiple card
   * images that are dragged end up in the same single card component host
   * element. When this happens, display: flex horisontally spaces them out.
   */
  @HostBinding('style.display') get display() {
    return this.insideVerticalContainer ? 'block' : 'flex';
  }

  /* Bug fix to reduce height when in PMC lane. Cards shift upwards for unknown reason... */
  @Input() reduceHeight = false;
  @Input() playerCanDrag = false;
  @Input() card: Card;
  @Input() isHost: boolean;
  @Input() rowIndex: number;
  @Input() wonBy: PlayerOrNone;
  @Input() laneIndex: number;
  @Input() insideVerticalContainer: boolean = false;

  cardSize: number;
  tiltDegrees = 0;
  imageFileName: string;

  constructor(public responsiveSizeService: ResponsiveSizeService) {
    this.sm.add(
      responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
  }

  ngOnInit() {
    this.initTiltDegrees();
    this.initImageFileName();
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  private initTiltDegrees() {
    const nobodyPlayedCard = this.card.PlayedBy === PlayerOrNone.None;
    const isMiddleCard = this.rowIndex === 3;

    if (nobodyPlayedCard || !isMiddleCard) {
      return;
    }

    const hostCardAndIsHost =
      this.isHost && this.card.PlayedBy === PlayerOrNone.Host;
    const guestCardAndIsGuest =
      !this.isHost && this.card.PlayedBy === PlayerOrNone.Guest;
    const playerPlayedCard = hostCardAndIsHost || guestCardAndIsGuest;

    this.tiltDegrees = playerPlayedCard ? 45 : -45;
  }

  private initImageFileName() {
    this.imageFileName = getCardImageFileName(this.card);
  }
}
