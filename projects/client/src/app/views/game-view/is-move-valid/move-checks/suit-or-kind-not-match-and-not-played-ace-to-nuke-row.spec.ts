import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { suitOrKindNotMatchAndNotPlayedAceToNukeRow } from './suit-or-kind-not-match-and-not-played-ace-to-nuke-row';

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

    const result = suitOrKindNotMatchAndNotPlayedAceToNukeRow(gameState, move);

    expect(result).toBe(true);
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

    const result = suitOrKindNotMatchAndNotPlayedAceToNukeRow(gameState, move);

    expect(result).toBe(true);
  });

  it('should return false when host played ace, guest ace is top card on other row, and last card played does not match', () => {
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
      Kind: KindModel.Three,
      Suit: SuitModel.Diamonds,
      PlayedBy: PlayerOrNoneModel.None,
    };

    const guestAce: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Hearts,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .setLastCardPlayedOnLane(lastCardPlayed, 0)
      .addCardToLaneOnRow(guestAce, 0, 6)
      .setIsHost(true)
      .build();

    const result = suitOrKindNotMatchAndNotPlayedAceToNukeRow(gameState, move);

    expect(result).toBe(false);
  });

  it('should return false when guest played ace, host ace is top card on other row, and last card played does not match', () => {
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Ace)
      .setCardSuit(SuitModel.Spades)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(6)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
      .build();

    const lastCardPlayed: CardModel = {
      Kind: KindModel.Three,
      Suit: SuitModel.Diamonds,
      PlayedBy: PlayerOrNoneModel.None,
    };

    const guestAce: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Hearts,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .setLastCardPlayedOnLane(lastCardPlayed, 0)
      .addCardToLaneOnRow(guestAce, 0, 0)
      .setIsHost(false)
      .build();

    const result = suitOrKindNotMatchAndNotPlayedAceToNukeRow(gameState, move);

    expect(result).toBe(false);
  });

  it('should return true when host played ace, guest ace is bottom card on other row, and last card played does not match', () => {
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
      Kind: KindModel.Three,
      Suit: SuitModel.Diamonds,
      PlayedBy: PlayerOrNoneModel.None,
    };

    const guestAce: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Hearts,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const cardCoveringGuestAce: CardModel = {
      Kind: KindModel.King,
      Suit: SuitModel.Hearts,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .setLastCardPlayedOnLane(lastCardPlayed, 0)
      .addCardToLaneOnRow(guestAce, 0, 6)
      .addCardToLaneOnRow(cardCoveringGuestAce, 0, 6)
      .setIsHost(true)
      .build();

    const result = suitOrKindNotMatchAndNotPlayedAceToNukeRow(gameState, move);

    expect(result).toBe(true);
  });
});
