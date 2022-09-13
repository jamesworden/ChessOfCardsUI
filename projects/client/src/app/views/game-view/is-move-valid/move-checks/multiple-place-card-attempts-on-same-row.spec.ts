import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { multiplePlaceCardAttemptsOnSameRow } from './multiple-place-card-attempts-on-same-row';

describe('[Move Check]: multiple place card attempts on same row', () => {
  it('should return true if there are', () => {
    const pca1 = new PlaceCardAttemptBuilder().setTargetRowIndex(2).build();
    const pca2 = new PlaceCardAttemptBuilder().setTargetRowIndex(2).build();
    const pca3 = new PlaceCardAttemptBuilder().setTargetRowIndex(2).build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(pca1)
      .addPlaceCardAttempt(pca2)
      .addPlaceCardAttempt(pca3)
      .build();

    const result = multiplePlaceCardAttemptsOnSameRow(move);

    expect(result).toBe(true);
  });

  it('should return false if there are not', () => {
    const pca1 = new PlaceCardAttemptBuilder().setTargetRowIndex(0).build();
    const pca2 = new PlaceCardAttemptBuilder().setTargetRowIndex(1).build();
    const pca3 = new PlaceCardAttemptBuilder().setTargetRowIndex(2).build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(pca1)
      .addPlaceCardAttempt(pca2)
      .addPlaceCardAttempt(pca3)
      .build();

    const result = multiplePlaceCardAttemptsOnSameRow(move);

    expect(result).toBe(false);
  });
});
