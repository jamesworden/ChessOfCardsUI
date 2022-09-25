import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
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

    const card: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Host,
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

    const card: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(true)
      .build();

    const result = capturedAllPreviousRows(gameState, placeCardAttempt);

    expect(result).toBe(false);
  });
});
