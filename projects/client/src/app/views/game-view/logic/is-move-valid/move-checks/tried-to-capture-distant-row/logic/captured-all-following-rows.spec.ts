import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
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

    const card: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Guest,
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

    const card: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 6)
      .setIsHost(false)
      .build();

    const result = capturedAllFollowingRows(gameState, placeCardAttempt);

    expect(result).toBe(false);
  });
});
