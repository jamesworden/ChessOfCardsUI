import { Kind, Suit, Card, PlayerOrNone } from '@shared/models';
import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { triedToReinforceWithDifferentSuit } from './tried-to-reinforce-with-different-suit';

describe('[Move Check]: tried to reinforce with different suit', () => {
  it('should return true when host tried to reinforce with different suit', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const card: Card = {
      Kind: Kind.King,
      Suit: Suit.Diamonds,
      PlayedBy: PlayerOrNone.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(true)
      .build();

    expect(triedToReinforceWithDifferentSuit(gameState, move)).toBeTrue();
  });

  it('should return true when guest tried to reinforce with different suit', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const card: Card = {
      Kind: Kind.King,
      Suit: Suit.Diamonds,
      PlayedBy: PlayerOrNone.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(false)
      .build();

    expect(triedToReinforceWithDifferentSuit(gameState, move)).toBeTrue();
  });

  it('should return false when host tried to reinforce with same suit', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const card: Card = {
      Kind: Kind.King,
      Suit: Suit.Clubs,
      PlayedBy: PlayerOrNone.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(true)
      .build();

    expect(triedToReinforceWithDifferentSuit(gameState, move)).toBe(false);
  });

  it('should return false when guest tried to reinforce with same suit', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const card: Card = {
      Kind: Kind.King,
      Suit: Suit.Clubs,
      PlayedBy: PlayerOrNone.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(false)
      .build();

    expect(triedToReinforceWithDifferentSuit(gameState, move)).toBe(false);
  });
});
