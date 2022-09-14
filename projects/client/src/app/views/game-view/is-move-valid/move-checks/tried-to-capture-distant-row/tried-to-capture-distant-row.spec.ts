import { triedToCaptureDistantRow } from '.';
import { GameStateBuilder } from '../../testing/game-state-builder';
import { MoveBuilder } from '../../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../../testing/place-card-attempt-builder';

describe('[Move Check]: tried to capture distant row', () => {
  it('should return false if host played first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(0)
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(true).build();

    expect(triedToCaptureDistantRow(gameState, move)).toBeTruthy();
  });

  it('should return false if guest played first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(6)
      .setTargetLaneIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const gameState = new GameStateBuilder().setIsHost(false).build();

    expect(triedToCaptureDistantRow(gameState, move)).toBeTruthy();
  });

  it(
    'should return true if host played second position with no first position'
  );
  it(
    'should return true if guest played second position with no first position'
  );

  it('should return false if host played first guest side position');
  it('should return false if guest played first host side position');

  it(
    'should return true if host tried to capture second position when guest has first position'
  );
  it(
    'should return true if guest tried to capture second position when host has first position'
  );
});
