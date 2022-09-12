import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { startedMovePlayerSideWhenPlayerHasAdvantage } from './started-move-player-side-when-player-has-advantage';

describe('[Move Check]: started move player side when player has advantage', () => {
  it('should return true when host moves to their first position when they have the advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setHostLaneAdvantage(0)
      .setIsHost(true)
      .build();

    const result = startedMovePlayerSideWhenPlayerHasAdvantage(gameState, move);

    expect(result).toBe(true);
  });

  it('should return false when host moves to their first position when guest has the advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setGuestLaneAdvantage(0)
      .setIsHost(true)
      .build();

    const result = startedMovePlayerSideWhenPlayerHasAdvantage(gameState, move);

    expect(result).toBe(false);
  });

  it('should return false when host moves to their last position when they have the advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setHostLaneAdvantage(0)
      .setIsHost(true)
      .build();

    const result = startedMovePlayerSideWhenPlayerHasAdvantage(gameState, move);

    expect(result).toBe(false);
  });

  it('should return true when guest moves to their first position when they have the advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setGuestLaneAdvantage(0)
      .setIsHost(false)
      .build();

    const result = startedMovePlayerSideWhenPlayerHasAdvantage(gameState, move);

    expect(result).toBe(true);
  });

  it('should return false when guest moves to their first position when host has the advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setHostLaneAdvantage(0)
      .setIsHost(false)
      .build();

    const result = startedMovePlayerSideWhenPlayerHasAdvantage(gameState, move);

    expect(result).toBe(false);
  });

  it('should return false when guest moves to their last position when they have the advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setGuestLaneAdvantage(0)
      .setIsHost(false)
      .build();

    const result = startedMovePlayerSideWhenPlayerHasAdvantage(gameState, move);

    expect(result).toBe(false);
  });
});
