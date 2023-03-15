import { Card } from 'projects/client/src/app/models/card.model';
import { Kind } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';
import { Suit } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { triedToCaptureGreaterCard } from './tried-to-capture-greater-card';

describe('[Move Check]: tried to capture greater card', () => {
  it('should return true when host tried to capture greater guest card', () => {
    const hostPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Seven)
      .setCardSuit(Suit.Clubs)
      .setCardPlayedBy(PlayerOrNone.None)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const hostMove = new MoveBuilder()
      .addPlaceCardAttempt(hostPlaceCardAttempt)
      .build();

    const greaterGuestCard: Card = {
      Kind: Kind.Ace,
      Suit: Suit.Clubs,
      PlayedBy: PlayerOrNone.Guest,
    };

    const gameState = new GameStateBuilder()
      .setIsHost(true)
      .addCardToLaneOnRow(greaterGuestCard, 0, 0)
      .build();

    expect(triedToCaptureGreaterCard(gameState, hostMove)).toBeTrue();
  });

  it('should return false when guest tried to capture lesser host card', () => {
    const guestPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Jack)
      .setCardSuit(Suit.Diamonds)
      .setCardPlayedBy(PlayerOrNone.None)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const guestMove = new MoveBuilder()
      .addPlaceCardAttempt(guestPlaceCardAttempt)
      .build();

    const lesserHostCard: Card = {
      Kind: Kind.Three,
      Suit: Suit.Diamonds,
      PlayedBy: PlayerOrNone.Host,
    };

    const gameState = new GameStateBuilder()
      .setIsHost(false)
      .addCardToLaneOnRow(lesserHostCard, 0, 0)
      .build();

    expect(triedToCaptureGreaterCard(gameState, guestMove)).toBe(false);
  });
});
