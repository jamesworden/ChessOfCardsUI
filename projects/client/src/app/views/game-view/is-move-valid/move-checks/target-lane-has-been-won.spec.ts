import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { targetLaneHasBeenWon } from './target-lane-has-been-won';

describe('[Move Check]: target lane has been won', () => {
  it('should return true if the target lane was won by host', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setHostWonBy(0).build();

    expect(targetLaneHasBeenWon(gameState, move)).toBe(true);
  });

  it('should return true if the target lane was won by guest', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setGuestWonBy(0).build();

    expect(targetLaneHasBeenWon(gameState, move)).toBe(true);
  });

  it('should return false if the target lane was not won', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setNoneWonBy(0).build();

    expect(targetLaneHasBeenWon(gameState, move)).toBe(false);
  });
});
