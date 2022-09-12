import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { triedToCaptureGreaterCard } from './tried-to-capture-greater-card';

describe('[Move Check]: tried to capture greater card', () => {
  it('should return true when host tried to capture greater guest card', () => {
    const hostPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Seven)
      .setCardSuit(SuitModel.Clubs)
      .setCardPlayedBy(PlayerOrNoneModel.None)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const hostMove = new MoveBuilder()
      .addPlaceCardAttempt(hostPlaceCardAttempt)
      .build();

    const greaterGuestCard: CardModel = {
      Kind: KindModel.Ace,
      Suit: SuitModel.Clubs,
      PlayedBy: PlayerOrNoneModel.Guest,
    };

    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .addCardToLaneOnRow(greaterGuestCard, 0, 0)
      .build();

    expect(triedToCaptureGreaterCard(gameState, hostMove)).toBe(true);
  });

  it('should return false when guest tried to capture lesser host card', () => {
    const guestPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Jack)
      .setCardSuit(SuitModel.Diamonds)
      .setCardPlayedBy(PlayerOrNoneModel.None)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const guestMove = new MoveBuilder()
      .addPlaceCardAttempt(guestPlaceCardAttempt)
      .build();

    const lesserHostCard: CardModel = {
      Kind: KindModel.Three,
      Suit: SuitModel.Diamonds,
      PlayedBy: PlayerOrNoneModel.Host,
    };

    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .addCardToLaneOnRow(lesserHostCard, 0, 0)
      .build();

    expect(triedToCaptureGreaterCard(gameState, guestMove)).toBe(false);
  });
});
