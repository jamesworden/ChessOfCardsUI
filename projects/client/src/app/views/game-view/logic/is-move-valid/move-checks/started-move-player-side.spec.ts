import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { startedMovePlayerSide } from './started-move-player-side';

describe('[Move Check]: started move player side', () => {
  it('should return true when host moved player side', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(true).build();

    expect(startedMovePlayerSide(gameState, move)).toBeTrue();
  });

  it('should return true when guest moved player side', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(false).build();

    expect(startedMovePlayerSide(gameState, move)).toBeTrue();
  });

  it('should return false when host moved opponent side', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(true).build();

    expect(startedMovePlayerSide(gameState, move)).toBe(false);
  });

  it('should return false when guest moved opponent side', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(false).build();

    expect(startedMovePlayerSide(gameState, move)).toBe(false);
  });
});
