import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { moreThanFourPlaceCardAttempts } from './more-than-four-place-card-attempts';

describe('[Move Check]: more than four place card attempts', () => {
  it('should return true where there are more than four place card attempts', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder().build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .addPlaceCardAttempt(placeCardAttempt)
      .addPlaceCardAttempt(placeCardAttempt)
      .addPlaceCardAttempt(placeCardAttempt)
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    expect(moreThanFourPlaceCardAttempts(move)).toBe(true);
  });

  it('should return false where there are less than four place card attempts', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder().build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    expect(moreThanFourPlaceCardAttempts(move)).toBe(false);
  });
});
