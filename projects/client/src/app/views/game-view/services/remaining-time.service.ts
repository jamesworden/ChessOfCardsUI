import { DestroyRef, Injectable, inject } from '@angular/core';
import { timer, BehaviorSubject, Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { SecondsRemaining } from '../../../models/seconds-remaining.model';
import { GameState } from '../../../state/game.state';
import { Select, Store } from '@ngxs/store';
import { PlayerGameView } from '../../../models/player-game-view.model';
import { durationOptionsMetadata } from '../../../metadata/duration-options-metadata';
import { PlayerOrNone } from '../../../models/player-or-none.model';
import {
  CheckGuestForEmptyTimer,
  CheckHostForEmptyTimer,
} from '../../../actions/game.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class RemainingTimeService {
  readonly #store = inject(Store);
  readonly #destroyRef = inject(DestroyRef);

  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView | null>;

  @Select(GameState.waitingForServer)
  waitingForServer$!: Observable<boolean>;

  playerGameView: PlayerGameView;
  everySecond$ = timer(0, 1000);
  secondsRemaining$ = new BehaviorSubject<SecondsRemaining | null>(null);
  secondsRemainingFromLastMove$ = new BehaviorSubject<SecondsRemaining | null>(
    null
  );

  constructor() {
    this.playerGameView$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((playerGameView) => {
        if (playerGameView) {
          this.playerGameView = playerGameView;
          this.setSecondsRemainingFromLastMove(playerGameView);
        }
      });
    this.everySecond$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        withLatestFrom(
          this.secondsRemainingFromLastMove$,
          this.waitingForServer$
        )
      )
      .subscribe(([_, secondsRemainingFromLastMove, waitingFromServer]) => {
        if (
          secondsRemainingFromLastMove &&
          this.playerGameView &&
          !waitingFromServer
        ) {
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
        }
      });

    this.secondsRemainingFromLastMove$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((secondsRemaining) => {
        if (secondsRemaining) {
          if (secondsRemaining.host <= 0) {
            this.#store.dispatch(new CheckHostForEmptyTimer());
          } else if (secondsRemaining.guest <= 0) {
            this.#store.dispatch(new CheckGuestForEmptyTimer());
          }
        }
      });
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
