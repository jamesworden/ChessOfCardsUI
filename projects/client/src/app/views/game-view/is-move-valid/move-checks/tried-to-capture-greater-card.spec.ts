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
    const placeCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(KindModel.Seven)
      .setCardSuit(SuitModel.Clubs)
      .setCardPlayedBy(PlayerOrNoneModel.None)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const move = new MoveBuilder()
      .addPlaceCardAttempt(placeCardAttempt)
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

    expect(triedToCaptureGreaterCard(gameState, move)).toBe(true);
  });
});
