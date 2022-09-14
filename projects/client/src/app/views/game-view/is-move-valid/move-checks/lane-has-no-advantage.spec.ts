import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { laneHasNoAdvantage } from './lane-has-no-advantage';

describe('[Move Check]: lane has no advantage', () => {
  it('should return true when lane has no advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setNoLaneAdvantage(0).build();

    expect(laneHasNoAdvantage(gameState, move)).toBeTrue();
  });

  it('should return false when lane has host advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setHostLaneAdvantage(0).build();

    expect(laneHasNoAdvantage(gameState, move)).toBeFalse();
  });

  it('should return false when lane has guest advantage', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setGuestLaneAdvantage(0).build();

    expect(laneHasNoAdvantage(gameState, move)).toBeFalse();
  });
});
