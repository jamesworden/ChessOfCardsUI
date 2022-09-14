import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { anyPlaceCardAttemptInMiddle } from './any-place-card-attempt-in-middle';

describe('[Move Check]: any place card attempt in middle', () => {
  it('should return true when a place card attempt is in the middle', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(3)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    expect(anyPlaceCardAttemptInMiddle(move)).toBe(true);
  });

  it('should return false when there are no place card attempts in middle', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(2)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    expect(anyPlaceCardAttemptInMiddle(move)).toBe(false);
  });
});
