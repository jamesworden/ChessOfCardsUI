import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { triedToReinforceWithDifferentSuit } from './tried-to-reinforce-with-different-suit';

describe('[Move Check]: tried to reinforce with different suit', () => {
  it('should return true when host tried to reinforce with different suit', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Ace)
      .setCardSuit(SuitModel.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const card: CardModel = {
      Kind: KindModel.King,
      Suit: SuitModel.Diamonds,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(true)
      .build();

    expect(triedToReinforceWithDifferentSuit(gameState, move)).toBe(true);
  });

  it('should return true when guest tried to reinforce with different suit', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Ace)
      .setCardSuit(SuitModel.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const card: CardModel = {
      Kind: KindModel.King,
      Suit: SuitModel.Diamonds,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(false)
      .build();

    expect(triedToReinforceWithDifferentSuit(gameState, move)).toBe(true);
  });

  it('should return false when host tried to reinforce with same suit', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Ace)
      .setCardSuit(SuitModel.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const card: CardModel = {
      Kind: KindModel.King,
      Suit: SuitModel.Clubs,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(true)
      .build();

    expect(triedToReinforceWithDifferentSuit(gameState, move)).toBe(false);
  });

  it('should return false when guest tried to reinforce with same suit', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Ace)
      .setCardSuit(SuitModel.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const card: CardModel = {
      Kind: KindModel.King,
      Suit: SuitModel.Clubs,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(card, 0, 0)
      .setIsHost(false)
      .build();

    expect(triedToReinforceWithDifferentSuit(gameState, move)).toBe(false);
  });
});
