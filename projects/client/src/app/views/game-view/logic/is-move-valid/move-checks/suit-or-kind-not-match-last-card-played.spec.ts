import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from 'projects/client/src/app/views/game-view/is-move-valid/testing/game-state-builder';
import { MoveBuilder } from 'projects/client/src/app/views/game-view/is-move-valid/testing/move-builder';
import { PlaceCardAttemptBuilder } from 'projects/client/src/app/views/game-view/is-move-valid/testing/place-card-attempt-builder';
import { suitOrKindNotMatchLastCardPlayed } from './suit-or-kind-not-match-last-card-played';

describe('[Move Check]: suit or kind not match and not played ace to nuke row', () => {
  it('should return true when host played card that does not match suit or kind of last card played', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Ace)
      .setCardSuit(SuitModel.Spades)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const lastCardPlayed: CardModel = {
      Kind: KindModel.King,
      Suit: SuitModel.Clubs,
      PlayedBy: PlayerOrNoneModel.None,
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
      .setCardKind(KindModel.Ace)
      .setCardSuit(SuitModel.Spades)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const lastCardPlayed: CardModel = {
      Kind: KindModel.King,
      Suit: SuitModel.Clubs,
      PlayedBy: PlayerOrNoneModel.None,
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
      .setCardKind(KindModel.Ace)
      .setCardSuit(SuitModel.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const lastCardPlayed: CardModel = {
      Kind: KindModel.King,
      Suit: SuitModel.Clubs,
      PlayedBy: PlayerOrNoneModel.None,
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
      .setCardKind(KindModel.Ace)
      .setCardSuit(SuitModel.Clubs)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const lastCardPlayed: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Diamonds,
      PlayedBy: PlayerOrNoneModel.None,
    };

    const gameState = new GameStateBuilder()
      .setLastCardPlayedOnLane(lastCardPlayed, 0)
      .setIsHost(false)
      .build();

    const result = suitOrKindNotMatchLastCardPlayed(gameState, move);

    expect(result).toBe(false);
  });
});
