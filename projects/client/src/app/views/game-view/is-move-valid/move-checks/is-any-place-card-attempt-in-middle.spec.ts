import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { isAnyPlaceCardAttemptInMiddle } from './is-any-place-card-attempt-in-middle';

describe('[Move Check]: is any place card attempt in middle', () => {
  it('should return true when a place card attempt is in the middle', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(3)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    expect(isAnyPlaceCardAttemptInMiddle(move)).toBe(true);
  });

  it('should return false when there are no place card attempts in middle', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(2)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    expect(isAnyPlaceCardAttemptInMiddle(move)).toBe(false);
  });
});
