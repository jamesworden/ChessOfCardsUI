import { Card } from 'projects/client/src/app/models/card.model';
import { Kind } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';
import { Suit } from 'projects/client/src/app/models/suit.model';
import { cardTrumpsCard } from './card-trumps-card';

describe('[Move Check Logic]: card trumps card', () => {
  it('should return true for when a card trumps another card of same suit', () => {
    {
      const attackingCard: Card = {
        Kind: Kind.Ace,
        Suit: Suit.Spades,
        PlayedBy: PlayerOrNone.None,
      };

      const defendingCard: Card = {
        Kind: Kind.King,
        Suit: Suit.Spades,
        PlayedBy: PlayerOrNone.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBeTrue();
    }

    {
      const attackingCard: Card = {
        Kind: Kind.Nine,
        Suit: Suit.Diamonds,
        PlayedBy: PlayerOrNone.None,
      };

      const defendingCard: Card = {
        Kind: Kind.Three,
        Suit: Suit.Diamonds,
        PlayedBy: PlayerOrNone.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBeTrue();
    }

    {
      const attackingCard: Card = {
        Kind: Kind.Three,
        Suit: Suit.Clubs,
        PlayedBy: PlayerOrNone.None,
      };

      const defendingCard: Card = {
        Kind: Kind.Two,
        Suit: Suit.Clubs,
        PlayedBy: PlayerOrNone.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBeTrue();
    }
  });

  it('should return false for when a card does not trump another same suit card', () => {
    {
      const attackingCard: Card = {
        Kind: Kind.Four,
        Suit: Suit.Hearts,
        PlayedBy: PlayerOrNone.None,
      };

      const defendingCard: Card = {
        Kind: Kind.Queen,
        Suit: Suit.Hearts,
        PlayedBy: PlayerOrNone.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(false);
    }

    {
      const attackingCard: Card = {
        Kind: Kind.Five,
        Suit: Suit.Diamonds,
        PlayedBy: PlayerOrNone.None,
      };

      const defendingCard: Card = {
        Kind: Kind.Six,
        Suit: Suit.Diamonds,
        PlayedBy: PlayerOrNone.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(false);
    }

    {
      const attackingCard: Card = {
        Kind: Kind.King,
        Suit: Suit.Clubs,
        PlayedBy: PlayerOrNone.None,
      };

      const defendingCard: Card = {
        Kind: Kind.Ace,
        Suit: Suit.Clubs,
        PlayedBy: PlayerOrNone.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(false);
    }
  });

  it('should return true when cards have equal kind but different suit', () => {
    {
      const attackingCard: Card = {
        Kind: Kind.Four,
        Suit: Suit.Hearts,
        PlayedBy: PlayerOrNone.None,
      };

      const defendingCard: Card = {
        Kind: Kind.Four,
        Suit: Suit.Clubs,
        PlayedBy: PlayerOrNone.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBeTrue();
    }

    {
      const attackingCard: Card = {
        Kind: Kind.Four,
        Suit: Suit.Clubs,
        PlayedBy: PlayerOrNone.None,
      };

      const defendingCard: Card = {
        Kind: Kind.Four,
        Suit: Suit.Hearts,
        PlayedBy: PlayerOrNone.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBeTrue();
    }

    {
      const attackingCard: Card = {
        Kind: Kind.King,
        Suit: Suit.Diamonds,
        PlayedBy: PlayerOrNone.None,
      };

      const defendingCard: Card = {
        Kind: Kind.King,
        Suit: Suit.Clubs,
        PlayedBy: PlayerOrNone.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBeTrue();
    }
  });
});
