import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { nonConsecutivePlaceCardAttempts } from './non-consecutive-place-card-attempts';

describe('[Move Check]: non consecutive place card attempts', () => {
  it('should return true if there is a gap in place card attempts (not counting middle row)', () => {
    const indexZero = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(0)
      .build();

    const indexTwo = new PlaceCardAttemptBuilder().setTargetRowIndex(2).build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(indexZero)
      .addPlaceCardAttempt(indexTwo)
      .build();

    expect(nonConsecutivePlaceCardAttempts(move)).toBe(true);
  });

  // it('should return false if there is no gap in host place card attempts (not counting middle row)', () => {
  //   const indexOne = new PlaceCardAttemptBuilder().setTargetRowIndex(1).build();

  //   const indexTwo = new PlaceCardAttemptBuilder().setTargetRowIndex(2).build();

  //   const indexFour = new PlaceCardAttemptBuilder()
  //     .setTargetRowIndex(4)
  //     .build();

  //   const indexFive = new PlaceCardAttemptBuilder()
  //     .setTargetRowIndex(5)
  //     .build();

  //   const move = new MoveBuilder()
  //     .addPlaceCardAttempt(indexOne)
  //     .addPlaceCardAttempt(indexTwo)
  //     .addPlaceCardAttempt(indexFour)
  //     .addPlaceCardAttempt(indexFive)
  //     .build();

  //   expect(nonConsecutivePlaceCardAttempts(move)).toBe(false);
  // });

  // it('should return true if there is a gap in guest place card attempts (not counting middle row)', () => {
  //   const indexSix = new PlaceCardAttemptBuilder().setTargetRowIndex(6).build();

  //   const indexFour = new PlaceCardAttemptBuilder()
  //     .setTargetRowIndex(4)
  //     .build();

  //   const move = new MoveBuilder()
  //     .addPlaceCardAttempt(indexSix)
  //     .addPlaceCardAttempt(indexFour)
  //     .build();

  //   expect(nonConsecutivePlaceCardAttempts(move)).toBe(true);
  // });

  // it('should return false if there is no gap in guest place card attempts (not counting middle row)', () => {
  //   const indexFive = new PlaceCardAttemptBuilder()
  //     .setTargetRowIndex(5)
  //     .build();

  //   const indexFour = new PlaceCardAttemptBuilder()
  //     .setTargetRowIndex(4)
  //     .build();

  //   const indexTwo = new PlaceCardAttemptBuilder().setTargetRowIndex(2).build();

  //   const indexOne = new PlaceCardAttemptBuilder().setTargetRowIndex(1).build();

  //   const move = new MoveBuilder()
  //     .addPlaceCardAttempt(indexFive)
  //     .addPlaceCardAttempt(indexFour)
  //     .addPlaceCardAttempt(indexTwo)
  //     .addPlaceCardAttempt(indexOne)
  //     .build();

  //   expect(nonConsecutivePlaceCardAttempts(move)).toBe(false);
  // });
});
