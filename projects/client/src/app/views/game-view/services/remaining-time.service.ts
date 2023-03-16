import { Injectable, OnDestroy } from '@angular/core';
import { SubscriptionManager } from '../../../util/subscription-manager';
import { timer, BehaviorSubject, Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { SecondsRemaining } from '../../../models/seconds-remaining.model';
import { GameState } from '../../../state/game.state';
import { Select } from '@ngxs/store';
import { PlayerGameView } from '../../../models/player-game-view.model';
import { durationOptionsMetadata } from '../../../metadata/duration-options-metadata';
import { PlayerOrNone } from '../../../models/player-or-none.model';

@Injectable({
  providedIn: 'root',
})
export class RemainingTimeService implements OnDestroy {
  private sm = new SubscriptionManager();

  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView>;

  playerGameView: PlayerGameView;
  everySecond$ = timer(0, 1000);
  secondsRemaining$ = new BehaviorSubject<SecondsRemaining | null>(null);
  secondsRemainingFromLastMove$ = new BehaviorSubject<SecondsRemaining | null>(
    null
  );

  constructor() {
    this.sm.add(
      this.playerGameView$.subscribe((playerGameView) => {
        if (playerGameView) {
          this.playerGameView = playerGameView;
          this.setSecondsRemainingFromLastMove(playerGameView);
        }
      })
    );
    this.sm.add(
      this.everySecond$
        .pipe(withLatestFrom(this.secondsRemainingFromLastMove$))
        .subscribe(([_, secondsRemainingFromLastMove]) => {
          if (secondsRemainingFromLastMove && this.playerGameView) {
            const { IsHostPlayersTurn } = this.playerGameView;

            if (IsHostPlayersTurn) {
              secondsRemainingFromLastMove.host--;
            } else {
              secondsRemainingFromLastMove.guest--;
            }

            const updatedSecondsRemaining = {
              host: secondsRemainingFromLastMove.host,
              guest: secondsRemainingFromLastMove.guest,
            };

            this.secondsRemainingFromLastMove$.next(updatedSecondsRemaining);

            console.log(updatedSecondsRemaining);
          }
        })
    );
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

  private setSecondsRemainingFromLastMove(playerGameView: PlayerGameView) {
    const { MovesMade, GameCreatedTimestampUTC, DurationOption } =
      playerGameView;

    const durationMetadata = durationOptionsMetadata.find(
      (metadata) => metadata.durationOption === DurationOption
    );

    if (!durationMetadata) {
      return;
    }

    const totalElapsedMs = {
      host: 0,
      guest: 0,
    };

    let lastTimestamp = new Date(GameCreatedTimestampUTC);

    for (const moveMade of MovesMade) {
      const currentTimestamp = new Date(moveMade.TimestampUTC);
      const msElapsed = currentTimestamp.getTime() - lastTimestamp.getTime();

      if (moveMade.PlayedBy === PlayerOrNone.Host) {
        totalElapsedMs.host += msElapsed;
      } else if (moveMade.PlayedBy === PlayerOrNone.Guest) {
        totalElapsedMs.guest += msElapsed;
      }

      lastTimestamp = currentTimestamp;
    }

    const totalMs = durationMetadata.minutes * 60 * 1000;

    const msRemainingFromLastMove = {
      host: totalMs - totalElapsedMs.host,
      guest: totalMs - totalElapsedMs.guest,
    };

    const secondsRemainingFromLastMove = {
      host: Math.floor(msRemainingFromLastMove.host / 1000),
      guest: Math.floor(msRemainingFromLastMove.guest / 1000),
    };

    this.secondsRemainingFromLastMove$.next(secondsRemainingFromLastMove);
  }
}
