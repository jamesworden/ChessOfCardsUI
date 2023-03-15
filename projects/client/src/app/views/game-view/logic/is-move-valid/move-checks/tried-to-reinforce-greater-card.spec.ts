import { Card } from 'projects/client/src/app/models/card.model';
import { Kind } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';
import { Suit } from 'projects/client/src/app/models/suit.model';
import { GameStateBuilder } from '../testing/game-state-builder';
import { MoveBuilder } from '../testing/move-builder';
import { PlaceCardAttemptBuilder } from '../testing/place-card-attempt-builder';
import { triedToReinforceGreaterCard } from './tried-to-reinforce-greater-card';

describe('[Move Check]: tried to reinforce greater card', () => {
  it('should return true when host tried to reinforce greater card', () => {
    const hostPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Queen)
      .setCardSuit(Suit.Hearts)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const hostMove = new MoveBuilder()
      .addPlaceCardAttempt(hostPlaceCardAttempt)
      .build();

    const greaterHostCard: Card = {
      Kind: Kind.King,
      Suit: Suit.Hearts,
      PlayedBy: PlayerOrNone.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(greaterHostCard, 0, 0)
      .setIsHost(true)
      .build();

    expect(triedToReinforceGreaterCard(gameState, hostMove)).toBeTrue();
  });

  it('should return true when guest tried to reinforce greater card', () => {
    const guestPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Three)
      .setCardSuit(Suit.Spades)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const guestMove = new MoveBuilder()
      .addPlaceCardAttempt(guestPlaceCardAttempt)
      .build();

    const greaterGuestCard: Card = {
      Kind: Kind.Four,
      Suit: Suit.Spades,
      PlayedBy: PlayerOrNone.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(greaterGuestCard, 0, 0)
      .setIsHost(false)
      .build();

    expect(triedToReinforceGreaterCard(gameState, guestMove)).toBeTrue();
  });

  it('should return false when host tried to reinforce lesser card', () => {
    const hostPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Queen)
      .setCardSuit(Suit.Hearts)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const hostMove = new MoveBuilder()
      .addPlaceCardAttempt(hostPlaceCardAttempt)
      .build();

    const lesserHostCard: Card = {
      Kind: Kind.Seven,
      Suit: Suit.Hearts,
      PlayedBy: PlayerOrNone.Host,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(lesserHostCard, 0, 0)
      .setIsHost(true)
      .build();

    expect(triedToReinforceGreaterCard(gameState, hostMove)).toBe(false);
  });

  it('should return false when guest tried to reinforce lesser card', () => {
    const guestPlaceCardAttempt = new PlaceCardAttemptBuilder()
      .setCardKind(Kind.Three)
      .setCardSuit(Suit.Spades)
      .setTargetLaneIndex(0)
      .setTargetRowIndex(0)
      .build();

    const guestMove = new MoveBuilder()
      .addPlaceCardAttempt(guestPlaceCardAttempt)
      .build();

    const lesserGuestCard: Card = {
      Kind: Kind.Two,
      Suit: Suit.Spades,
      PlayedBy: PlayerOrNone.Guest,
    };

    const gameState = new GameStateBuilder()
      .addCardToLaneOnRow(lesserGuestCard, 0, 0)
      .setIsHost(false)
      .build();

    expect(triedToReinforceGreaterCard(gameState, guestMove)).toBe(false);
  });
});
