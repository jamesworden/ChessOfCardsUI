import { KindModel } from '../../../../../models/kind.model';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { placeCardAttemptsHaveDifferentKinds } from './place-card-attempts-have-different-kinds';

describe('[Move Check]: place card attempts have different kinds', () => {
  it('should return true when place card attempts have different kinds', () => {
    const ace = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Ace)
      .build();

    const eight = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Eight)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(ace)
      .addPlaceCardAttempt(eight)
      .build();

    expect(placeCardAttemptsHaveDifferentKinds(move)).toBeTrue();
  });

  it('should return false when place card attempts have same kinds', () => {
    const ace = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Ace)
      .build();

    const anotherAce = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Ace)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(ace)
      .addPlaceCardAttempt(anotherAce)
      .build();

    expect(placeCardAttemptsHaveDifferentKinds(move)).toBe(false);
  });
});
