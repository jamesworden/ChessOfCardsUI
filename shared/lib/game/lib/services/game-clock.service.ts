import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { GameState } from '../state/game.state';
import { Observable, of, timer } from 'rxjs';
import { PlayerGameView } from '@shared/models';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GameClockService {
  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView>;

  @Select(GameState.opponentIsDisconnected)
  opponentIsDisconnected$!: Observable<boolean>;

  public readonly opponentDisconnectClock$ = this.opponentIsDisconnected$.pipe(
    map((opponentIsDisconnected) =>
      opponentIsDisconnected ? timer(0, 1000) : of(null)
    ),
    switchMap((timer) => timer),
    map((timeElapsed) =>
      typeof timeElapsed === 'number' ? 30 - timeElapsed : null
    )
  );

  public readonly remainingTimeClocks$ = this.playerGameView$.pipe(
    map((playerGameView) =>
      !playerGameView || playerGameView.hasEnded ? of(0) : timer(0, 1000)
    ),
    switchMap((timer) => timer),
    withLatestFrom(this.playerGameView$),
    map(([timeElapsed, playerGameView]) => {
      if (!playerGameView) {
        return {
          player: this.getClockDisplay(0),
          opponent: this.getClockDisplay(0),
        };
      }

      let playerSecondsRemaining = playerGameView.isHost
        ? playerGameView.hostSecondsRemaining
        : playerGameView.guestSecondsRemaining;

      let opponentSecondsRemaining = playerGameView.isHost
        ? playerGameView.guestSecondsRemaining
        : playerGameView.hostSecondsRemaining;

      const isPlayersTurn =
        (playerGameView.isHost && playerGameView.isHostPlayersTurn) ||
        (!playerGameView.isHost && !playerGameView.isHostPlayersTurn);

      if (isPlayersTurn) {
        playerSecondsRemaining -= timeElapsed;
      } else {
        opponentSecondsRemaining -= timeElapsed;
      }

      return {
        player: this.getClockDisplay(playerSecondsRemaining),
        opponent: this.getClockDisplay(opponentSecondsRemaining),
      };
    })
  );

  private getClockDisplay(seconds: number) {
    if (seconds <= 0) {
      return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return (
      minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds
    );
  }
}
