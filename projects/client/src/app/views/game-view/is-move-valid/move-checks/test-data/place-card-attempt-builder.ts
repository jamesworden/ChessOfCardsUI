import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlaceCardAttemptModel } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';

export class PlaceCardAttemptBuilder {
  private placeCardAttempt: PlaceCardAttemptModel;

  constructor() {
    this.placeCardAttempt = {
      Card: {
        Kind: KindModel.Ace,
        Suit: SuitModel.Spades,
        PlayedBy: PlayerOrNoneModel.None,
      },
      TargetLaneIndex: 0,
      TargetRowIndex: 0,
    };
  }

  setCardSuit(suit: SuitModel) {
    this.placeCardAttempt.Card.Suit = suit;
    return this;
  }

  setCardKind(kind: KindModel) {
    this.placeCardAttempt.Card.Kind = kind;
    return this;
  }

  setCardPlayedBy(playedBy: PlayerOrNoneModel) {
    this.placeCardAttempt.Card.PlayedBy = playedBy;
    return this;
  }

  setTargetLaneIndex(targetLaneIndex: number) {
    this.placeCardAttempt.TargetLaneIndex = targetLaneIndex;
    return this;
  }

  setTargetRowIndex(targetRowIndex: number) {
    this.placeCardAttempt.TargetRowIndex = targetRowIndex;
    return this;
  }

  build() {
    return this.placeCardAttempt;
  }
}
