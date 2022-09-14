import { playerHasAdvantage } from 'archive/player-has-advantage';
import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';

describe('[Move Check]: player has advantage', () => {
  it('should return true when player is host and host has lane advantage', () => {
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

    expect(playerHasAdvantage(gameState, move)).toBeTruthy();
  });

  it('should return false when player is host and guest has lane advantage', () => {});

  it('should return true when player is guest and guest has lane advantage', () => {});

  it('should return false when player is guest and host has lane advantage', () => {});
});
