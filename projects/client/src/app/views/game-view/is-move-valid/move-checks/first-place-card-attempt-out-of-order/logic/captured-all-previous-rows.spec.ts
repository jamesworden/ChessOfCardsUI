import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from '../../../testing/game-state-builder';
import { capturedAllPreviousRows } from './captured-all-previous-rows';

describe('[Move Check Shared Logic]: captured all previous rows', () => {
  it('should return true when host plays card on their first position', () => {
    const targetRowIndex = 0;
    const playerIsHost = true;
    const gameState = new GameStateBuilder().build();
    const lane = gameState.Lanes[0];

    const result = capturedAllPreviousRows(lane, targetRowIndex, playerIsHost);

    expect(result).toBe(true);
  });

  it('should return true when host plays card on their second position and the first has a card of theirs', () => {
    const targetRowIndex = 1;
    const playerIsHost = true;

    const card: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .build();

    const lane = gameState.Lanes[0];

    const result = capturedAllPreviousRows(lane, targetRowIndex, playerIsHost);

    expect(result).toBe(true);
  });

  it('should return false when host plays card on their second position and the first has a guest card', () => {
    const targetRowIndex = 1;
    const playerIsHost = true;

    const card: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .build();

    const lane = gameState.Lanes[0];

    const result = capturedAllPreviousRows(lane, targetRowIndex, playerIsHost);

    expect(result).toBe(false);
  });
});
