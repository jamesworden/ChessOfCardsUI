import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { suitOrKindNotMatchLastCardPlayed } from './suit-or-kind-not-match-last-card-played';
import { Card, Kind, PlayerOrNone, Suit } from '@shared/models';

describe('[Move Check]: suit or kind not match and not played ace to nuke row', () => {
  it('should return true when host played card that does not match suit or kind of last card played', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Spades)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const lastCardPlayed: Card = {
      Kind: Kind.King,
      Suit: Suit.Clubs,
      PlayedBy: PlayerOrNone.None,
    };

    const gameState = new GameStateBuilder()
      .setLastCardPlayedOnLane(lastCardPlayed, 0)
      .setIsHost(true)
      .build();

    const result = suitOrKindNotMatchLastCardPlayed(gameState, move);

    expect(result).toBeTrue();
  });

  it('should return true when guest played card that does not match suit or kind of last card played', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Spades)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const lastCardPlayed: Card = {
      Kind: Kind.King,
      Suit: Suit.Clubs,
      PlayedBy: PlayerOrNone.None,
    };

    const gameState = new GameStateBuilder()
      .setLastCardPlayedOnLane(lastCardPlayed, 0)
      .setIsHost(false)
      .build();

    const result = suitOrKindNotMatchLastCardPlayed(gameState, move);

    expect(result).toBeTrue();
  });

  it('should return false when host played card that matches suit of last card played', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const lastCardPlayed: Card = {
      Kind: Kind.King,
      Suit: Suit.Clubs,
      PlayedBy: PlayerOrNone.None,
    };

    const gameState = new GameStateBuilder()
      .setLastCardPlayedOnLane(lastCardPlayed, 0)
      .setIsHost(true)
      .build();

    const result = suitOrKindNotMatchLastCardPlayed(gameState, move);

    expect(result).toBe(false);
  });

  it('should return false when guest played card that does match kind of last card played', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Ace)
      .setCardSuit(Suit.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const lastCardPlayed: Card = {
      Kind: Kind.Ace,
      Suit: Suit.Diamonds,
      PlayedBy: PlayerOrNone.None,
    };

    const gameState = new GameStateBuilder()
      .setLastCardPlayedOnLane(lastCardPlayed, 0)
      .setIsHost(false)
      .build();

    const result = suitOrKindNotMatchLastCardPlayed(gameState, move);

    expect(result).toBe(false);
  });
});
