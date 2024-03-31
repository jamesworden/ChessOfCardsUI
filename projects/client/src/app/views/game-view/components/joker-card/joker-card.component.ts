import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';

@Component({
  selector: 'app-joker-card',
  templateUrl: './joker-card.component.html',
  styleUrls: ['./joker-card.component.scss'],
})
export class JokerCardComponent implements OnInit {
  private sm = new SubscriptionManager();

  @Input() isRedJoker: boolean;

  cardSize: number;
  imageFileName: string;
  tiltDegrees: number;
  wonBy: PlayerOrNone;
  isHost: boolean;

  constructor(public responsiveSizeService: ResponsiveSizeService) {
    this.sm.add(
      responsiveSizeService.cardSize$.subscribe((cardSize) => {
        this.cardSize = cardSize;
      })
    );
  }

  ngOnInit() {
    this.initImageFileName();
    this.initTiltDegrees();
  }

  private initImageFileName() {
    this.imageFileName = this.isRedJoker
      ? 'card_joker_red.png'
      : 'card_joker_black.png';
  }

  private initTiltDegrees() {
    const isHostAndHostWon = this.isHost && this.wonBy === PlayerOrNone.Host;
    const isGuestAndGuestWon =
      !this.isHost && this.wonBy === PlayerOrNone.Guest;
    const playerWonLane = isHostAndHostWon || isGuestAndGuestWon;
    this.tiltDegrees = playerWonLane ? 45 : -45;
  }
}
