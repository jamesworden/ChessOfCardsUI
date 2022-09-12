import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { startedMoveOpponentSideWhenOpponentHasAdvantage } from './started-move-opponent-side-when-opponent-has-advantage';

describe('[Move Check]: started move opponent side when opponent has advantage', () => {
  it('should return true when host moved guest side when guest has advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .setGuestLaneAdvantage(0)
      .build();

    const result = startedMoveOpponentSideWhenOpponentHasAdvantage(
      gameState,
      move
    );

    expect(result).toBe(true);
  });

  it('should return false when host moved guest side when host has advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .setHostLaneAdvantage(0)
      .build();

    const result = startedMoveOpponentSideWhenOpponentHasAdvantage(
      gameState,
      move
    );

    expect(result).toBe(false);
  });

  it('should return true when guest moved host side when host has advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .setHostLaneAdvantage(0)
      .build();

    const result = startedMoveOpponentSideWhenOpponentHasAdvantage(
      gameState,
      move
    );

    expect(result).toBe(true);
  });

  it('should return false when guest moved host side when guest has advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .setGuestLaneAdvantage(0)
      .build();

    const result = startedMoveOpponentSideWhenOpponentHasAdvantage(
      gameState,
      move
    );

    expect(result).toBe(false);
  });
});
