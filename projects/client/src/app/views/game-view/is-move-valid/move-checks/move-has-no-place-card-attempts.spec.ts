import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { moveHasNoPlaceCardAttempts } from './move-has-no-place-card-attempts';

describe('[Move Check]: move has no place card attempts', () => {
  it('should return true if the move has no place card attempts', () => {
    const move = new MoveBuilder().build();
    expect(moveHasNoPlaceCardAttempts(move)).toBe(true);
  });

  it('should return false if the move has place card attempts', () => {
    const placeCardAttempt1 = new PlaceCardAttemptBuilder().build();
    const placeCardAttempt2 = new PlaceCardAttemptBuilder().build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt1)
      .addPlaceCardAttempt(placeCardAttempt2)
      .build();

    expect(moveHasNoPlaceCardAttempts(move)).toBe(false);
  });
});
