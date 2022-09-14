import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from '../../../testing/game-state-builder';
import { capturedAllFollowingRows } from './captured-all-following-rows';

describe('[Move Check Shared Logic]: captured all following rows', () => {
  it('should return true when guest plays card on their first position', () => {
    const targetRowIndex = 6;
    const playerIsHost = false;
    const gameState = new GameStateBuilder().build();
    const lane = gameState.Lanes[0];

    const result = capturedAllFollowingRows(lane, targetRowIndex, playerIsHost);

    expect(result).toBe(true);
  });

  it('should return true when guest plays card on their second position and the first has a card of theirs', () => {
    const targetRowIndex = 5;
    const playerIsHost = false;

    const card: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 6)
      .build();

    const lane = gameState.Lanes[0];

    const result = capturedAllFollowingRows(lane, targetRowIndex, playerIsHost);

    expect(result).toBe(true);
  });

  it('should return false when guest plays card on their second position and the first has a host card', () => {
    const targetRowIndex = 5;
    const playerIsHost = false;

    const card: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 6)
      .build();

    const lane = gameState.Lanes[0];

    const result = capturedAllFollowingRows(lane, targetRowIndex, playerIsHost);

    expect(result).toBe(false);
  });
});
