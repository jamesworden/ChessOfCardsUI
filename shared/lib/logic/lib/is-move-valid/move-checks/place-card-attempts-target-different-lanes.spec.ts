import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { placeCardAttemptsTargetDifferentLanes } from './place-card-attempts-target-different-lanes';

describe('[Move Check]: place card attempts target different lanes', () => {
  it('should return true when move has place card attempts on different target lanes', () => {
    const laneIndexZero = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .build();

    const laneIndexOne = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(1)
      .build();

    const laneIndexTwo = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(2)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(laneIndexZero)
      .addPlaceCardAttempt(laneIndexOne)
      .addPlaceCardAttempt(laneIndexTwo)
      .build();

    expect(placeCardAttemptsTargetDifferentLanes(move)).toBeTrue();
  });

  it('should return false when move has place card attempts on only one target lane', () => {
    const laneIndexZero = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(3)
      .build();

    const laneIndexOne = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(3)
      .build();

    const laneIndexTwo = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(3)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(laneIndexZero)
      .addPlaceCardAttempt(laneIndexOne)
      .addPlaceCardAttempt(laneIndexTwo)
      .build();

    expect(placeCardAttemptsTargetDifferentLanes(move)).toBe(false);
  });
});
