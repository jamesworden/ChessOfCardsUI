import { Card, Kind, Suit, PlayerOrNone } from '@client/models';
import { GameStateBuilder } from '../../../testing/game-state-builder';
import { PlaceCardAttemptBuilder } from '../../../testing/place-card-attempt-builder';
import { capturedAllFollowingRows } from './captured-all-following-rows';

describe('[Move Check Shared Logic]: captured all following rows', () => {
  it('should return true when guest plays card on their first position', () => {
    const gameState = new GameStateBuilder().setIsHost(false).build();

    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetRowIndex(6)
      .build();

    const result = capturedAllFollowingRows(gameState, placeCardAttempt);

    expect(result).toBeTrue();
  });

  it('should return true when guest plays card on their second position and the first has a card of theirs', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(5)
      .build();

    const card: Card = {
      Kind: Kind.Ace,
      Suit: Suit.Spades,
      PlayedBy: PlayerOrNone.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 6)
      .setIsHost(false)
      .build();

    const result = capturedAllFollowingRows(gameState, placeCardAttempt);

    expect(result).toBeTrue();
  });

  it('should return false when guest plays card on their second position and the first has a host card', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(5)
      .build();

    const card: Card = {
      Kind: Kind.Ace,
      Suit: Suit.Spades,
      PlayedBy: PlayerOrNone.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 6)
      .setIsHost(false)
      .build();

    const result = capturedAllFollowingRows(gameState, placeCardAttempt);

    expect(result).toBe(false);
  });
});
