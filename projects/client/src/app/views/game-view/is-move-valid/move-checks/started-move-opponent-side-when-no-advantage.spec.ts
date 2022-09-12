import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { startedMoveOpponentSideWhenNoAdvantage } from './started-move-opponent-side-when-no-advantage';

describe('[Move Check]: started move opponent side when no advantage', () => {
  it('should return true if host place card attempt is guest side when there is no lane advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .setNoLaneAdvantage(0)
      .build();

    expect(startedMoveOpponentSideWhenNoAdvantage(gameState, move)).toBe(true);
  });

  it('should return false if host place card attempt is host side when there is no lane advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .setNoLaneAdvantage(0)
      .build();

    expect(startedMoveOpponentSideWhenNoAdvantage(gameState, move)).toBe(false);
  });

  it('should return true if guest place card attempt is host side when there is no lane advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .setNoLaneAdvantage(0)
      .build();

    expect(startedMoveOpponentSideWhenNoAdvantage(gameState, move)).toBe(true);
  });

  it('should return false if guest place card attempt is guest side when there is no lane advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .setNoLaneAdvantage(0)
      .build();

    expect(startedMoveOpponentSideWhenNoAdvantage(gameState, move)).toBe(false);
  });
});
