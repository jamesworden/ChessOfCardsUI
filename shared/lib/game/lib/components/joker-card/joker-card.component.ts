import { Component, Input, inject } from '@angular/core';
import { ResponsiveSizeService } from '@shared/game';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerOrNone } from '@shared/models';

@Component({
  selector: 'game-joker-card',
  templateUrl: './joker-card.component.html',
  styleUrls: ['./joker-card.component.scss'],
})
export class JokerCardComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  @Input({ required: true }) set isRedJoker(isRedJoker: boolean) {
    this.isRedJoker$.next(isRedJoker);
  }
  @Input({ required: true }) set isHost(isHost: boolean) {
    this.isHost$.next(isHost);
  }
  @Input({ required: true }) set wonBy(wonBy: PlayerOrNone) {
    this.wonBy$.next(wonBy);
  }

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  readonly isRedJoker$ = new BehaviorSubject<boolean>(false);
  readonly isHost$ = new BehaviorSubject<boolean>(false);
  readonly wonBy$ = new BehaviorSubject<PlayerOrNone>(PlayerOrNone.None);

  readonly imageFileName$ = this.isRedJoker$.pipe(
    map((isRedJoker) =>
      isRedJoker ? 'card_joker_red.png' : 'card_joker_black.png'
    )
  );

  readonly tiltDegrees$ = combineLatest([this.isHost$, this.wonBy$]).pipe(
    map(([isHost, wonBy]) => {
      const isHostAndHostWon = isHost && wonBy === PlayerOrNone.Host;
      const isGuestAndGuestWon = !isHost && wonBy === PlayerOrNone.Guest;
      const playerWonLane = isHostAndHostWon || isGuestAndGuestWon;
      return playerWonLane ? 45 : -45;
    })
  );
}
