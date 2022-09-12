import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { triedToReinforceGreaterCard } from './tried-to-reinforce-greater-card';

describe('[Move Check]: tried to reinforce greater card', () => {
  it('should return true when host tried to reinforce greater card', () => {
    const hostPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Queen)
      .setCardSuit(SuitModel.Hearts)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const hostMove = new MoveBuilder()
      .addPlaceCardAttempt(hostPlaceCardAttempt)
      .build();

    const greaterHostCard: CardModel = {
      Kind: KindModel.King,
      Suit: SuitModel.Hearts,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(greaterHostCard, 0, 0)
      .setIsHost(true)
      .build();

    expect(triedToReinforceGreaterCard(gameState, hostMove)).toBe(true);
  });

  it('should return true when guest tried to reinforce greater card', () => {
    const guestPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Three)
      .setCardSuit(SuitModel.Spades)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const hostMove = new MoveBuilder()
      .addPlaceCardAttempt(guestPlaceCardAttempt)
      .build();

    const greaterGuestCard: CardModel = {
      Kind: KindModel.Four,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(greaterGuestCard, 0, 0)
      .setIsHost(false)
      .build();

    expect(triedToReinforceGreaterCard(gameState, hostMove)).toBe(true);
  });

  it('should return false when host tried to reinforce lesser card', () => {
    const hostPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Queen)
      .setCardSuit(SuitModel.Hearts)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const hostMove = new MoveBuilder()
      .addPlaceCardAttempt(hostPlaceCardAttempt)
      .build();

    const lesserHostCard: CardModel = {
      Kind: KindModel.Seven,
      Suit: SuitModel.Hearts,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(lesserHostCard, 0, 0)
      .setIsHost(true)
      .build();

    expect(triedToReinforceGreaterCard(gameState, hostMove)).toBe(false);
  });

  it('should return false when guest tried to reinforce lesser card', () => {
    const guestPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Three)
      .setCardSuit(SuitModel.Spades)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const hostMove = new MoveBuilder()
      .addPlaceCardAttempt(guestPlaceCardAttempt)
      .build();

    const lesserGuestCard: CardModel = {
      Kind: KindModel.Two,
      Suit: SuitModel.Spades,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(lesserGuestCard, 0, 0)
      .setIsHost(false)
      .build();

    expect(triedToReinforceGreaterCard(gameState, hostMove)).toBe(false);
  });
});
