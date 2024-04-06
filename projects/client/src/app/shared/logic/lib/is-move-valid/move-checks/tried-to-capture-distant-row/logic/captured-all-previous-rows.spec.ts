import { Card, Kind, Suit, PlayerOrNone } from '@client/models';
import { GameStateBuilder } from '../../../testing/game-state-builder';
import { PlaceCardAttemptBuilder } from '../../../testing/place-card-attempt-builder';
import { capturedAllPreviousRows } from './captured-all-previous-rows';

describe('[Move Check Shared Logic]: captured all previous rows', () => {
  it('should return true when host plays card on their first position', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const gameState = new GameStateBuilder().setIsHost(true).build();

    const result = capturedAllPreviousRows(gameState, placeCardAttempt);

    expect(result).toBeTrue();
  });

  it('should return true when host plays card on their second position and the first has a card of theirs', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(1)
      .build();

    const card: Card = {
      Kind: Kind.Ace,
      Suit: Suit.Spades,
      PlayedBy: PlayerOrNone.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(true)
      .build();

    const result = capturedAllPreviousRows(gameState, placeCardAttempt);

    expect(result).toBeTrue();
  });

  it('should return false when host plays card on their second position and the first has a guest card', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setTargetLaneIndex(0)
      .setTargetRowIndex(1)
      .build();

    const card: Card = {
      Kind: Kind.Ace,
      Suit: Suit.Spades,
      PlayedBy: PlayerOrNone.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(true)
      .build();

    const result = capturedAllPreviousRows(gameState, placeCardAttempt);

    expect(result).toBe(false);
  });
});
