import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { startedMoveOpponentSide } from './started-move-opponent-side';

describe('[Move Check]: started move opponent side', () => {
  it('should return true when host moved guest side', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(true).build();

    expect(startedMoveOpponentSide(gameState, move)).toBe(true);
  });

  it('should return false when host moved host side', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(true).build();

    expect(startedMoveOpponentSide(gameState, move)).toBe(false);
  });

  it('should return true when guest moved host side', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(false).build();

    expect(startedMoveOpponentSide(gameState, move)).toBe(true);
  });

  it('should return false when guest moved guest side', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(false).build();

    expect(startedMoveOpponentSide(gameState, move)).toBe(false);
  });
});
