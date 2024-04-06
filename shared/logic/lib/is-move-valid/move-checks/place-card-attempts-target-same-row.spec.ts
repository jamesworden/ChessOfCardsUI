import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { placeCardAttemptsTargetSameRow } from './place-card-attempts-target-same-row';

describe('[Move Check]: place card attempts target same row', () => {
  it('should return true if there are', () => {
    const pca1 = new PlaceCardAttemptBuilder().setTargetRowIndex(2).build();
    const pca2 = new PlaceCardAttemptBuilder().setTargetRowIndex(2).build();
    const pca3 = new PlaceCardAttemptBuilder().setTargetRowIndex(2).build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(pca1)
      .addPlaceCardAttempt(pca2)
      .addPlaceCardAttempt(pca3)
      .build();

    const result = placeCardAttemptsTargetSameRow(move);

    expect(result).toBeTrue();
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

    const result = placeCardAttemptsTargetSameRow(move);

    expect(result).toBe(false);
  });
});
