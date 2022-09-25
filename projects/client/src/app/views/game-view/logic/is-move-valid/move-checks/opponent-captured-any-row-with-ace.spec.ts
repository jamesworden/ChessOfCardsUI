import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from '../testing/game-state-builder';
import { opponentCapturedAnyRowWithAce } from './opponent-captured-any-row-with-ace';

describe('[Move Check]: opponent captured any row with ace', () => {
  it('should return true when player is host and guest ace is on row 0', () => {
    const guestAce: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(guestAce, 0, 0)
      .setIsHost(true)
      .build();

    expect(opponentCapturedAnyRowWithAce(gameState)).toBeTrue();
  });

  it('should return false when player is host and host ace is on row 4', () => {
    const hostAce: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(hostAce, 0, 4)
      .setIsHost(true)
      .build();

    expect(opponentCapturedAnyRowWithAce(gameState)).toBe(false);
  });

  it('should return true when player is guest and host ace is on row 0', () => {
    const hostAce: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(hostAce, 0, 0)
      .setIsHost(false)
      .build();

    expect(opponentCapturedAnyRowWithAce(gameState)).toBeTrue();
  });

  it('should return false when player is guest and guest ace is on row 4', () => {
    const guestAce: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(guestAce, 0, 4)
      .setIsHost(false)
      .build();

    expect(opponentCapturedAnyRowWithAce(gameState)).toBe(false);
  });
});
