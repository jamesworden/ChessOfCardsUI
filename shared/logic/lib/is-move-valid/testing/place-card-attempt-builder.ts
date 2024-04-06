import { PlaceCardAttempt, PlayerOrNone, Kind, Suit } from '@client/models';

export class PlaceCardAttemptBuilder {
  private placeCardAttempt: PlaceCardAttempt;

  constructor() {
    this.placeCardAttempt = {
      Card: {
        Kind: Kind.Ace,
        Suit: Suit.Spades,
        PlayedBy: PlayerOrNone.None,
      },
      TargetLaneIndex: 0,
      TargetRowIndex: 0,
    };
  }

  setCardSuit(suit: Suit) {
    this.placeCardAttempt.Card.Suit = suit;
    return this;
  }

  setCardKind(kind: Kind) {
    this.placeCardAttempt.Card.Kind = kind;
    return this;
  }

  setCardPlayedBy(playedBy: PlayerOrNone) {
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
