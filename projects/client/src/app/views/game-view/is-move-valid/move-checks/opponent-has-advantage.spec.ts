import { opponentHasAdvantage } from 'archive/opponent-has-advantage';
import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';

describe('[Move Check]: opponent has advantage', () => {
  it('should return false when player is host and host has lane advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setHostLaneAdvantage(0)
      .setIsHost(true)
      .build();

    expect(opponentHasAdvantage(gameState, move)).toBeFalsy();
  });

  it('should return true when player is host and guest has lane advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setGuestLaneAdvantage(0)
      .setIsHost(true)
      .build();

    expect(opponentHasAdvantage(gameState, move)).toBeTruthy();
  });

  it('should return false when player is guest and guest has lane advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setGuestLaneAdvantage(0)
      .setIsHost(false)
      .build();

    expect(opponentHasAdvantage(gameState, move)).toBeFalsy();
  });

  it('should return true when player is guest and host has lane advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder()
      .setHostLaneAdvantage(0)
      .setIsHost(false)
      .build();

    expect(opponentHasAdvantage(gameState, move)).toBeTruthy();
  });
});
