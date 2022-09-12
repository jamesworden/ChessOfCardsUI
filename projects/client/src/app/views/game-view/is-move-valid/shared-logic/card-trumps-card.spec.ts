import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';
import { SuitModel } from 'projects/client/src/app/models/suit.model';
import { cardTrumpsCard } from './card-trumps-card';

describe('[Move Check Shared Logic]: card trumps card', () => {
  it('should return true for when a card trumps another card of same suit', () => {
    {
      const attackingCard: CardModel = {
        Kind: KindModel.Ace,
        Suit: SuitModel.Spades,
        PlayedBy: PlayerOrNoneModel.None,
      };

      const defendingCard: CardModel = {
        Kind: KindModel.King,
        Suit: SuitModel.Spades,
        PlayedBy: PlayerOrNoneModel.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(true);
    }

    {
      const attackingCard: CardModel = {
        Kind: KindModel.Nine,
        Suit: SuitModel.Diamonds,
        PlayedBy: PlayerOrNoneModel.None,
      };

      const defendingCard: CardModel = {
        Kind: KindModel.Three,
        Suit: SuitModel.Diamonds,
        PlayedBy: PlayerOrNoneModel.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(true);
    }

    {
      const attackingCard: CardModel = {
        Kind: KindModel.Three,
        Suit: SuitModel.Clubs,
        PlayedBy: PlayerOrNoneModel.None,
      };

      const defendingCard: CardModel = {
        Kind: KindModel.Two,
        Suit: SuitModel.Clubs,
        PlayedBy: PlayerOrNoneModel.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(true);
    }
  });

  it('should return false for when a card does not trump another same suit card', () => {
    {
      const attackingCard: CardModel = {
        Kind: KindModel.Four,
        Suit: SuitModel.Hearts,
        PlayedBy: PlayerOrNoneModel.None,
      };

      const defendingCard: CardModel = {
        Kind: KindModel.Queen,
        Suit: SuitModel.Hearts,
        PlayedBy: PlayerOrNoneModel.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(false);
    }

    {
      const attackingCard: CardModel = {
        Kind: KindModel.Five,
        Suit: SuitModel.Diamonds,
        PlayedBy: PlayerOrNoneModel.None,
      };

      const defendingCard: CardModel = {
        Kind: KindModel.Six,
        Suit: SuitModel.Diamonds,
        PlayedBy: PlayerOrNoneModel.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(false);
    }

    {
      const attackingCard: CardModel = {
        Kind: KindModel.King,
        Suit: SuitModel.Clubs,
        PlayedBy: PlayerOrNoneModel.None,
      };

      const defendingCard: CardModel = {
        Kind: KindModel.Ace,
        Suit: SuitModel.Clubs,
        PlayedBy: PlayerOrNoneModel.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(false);
    }
  });

  it('should return true when cards have equal kind but different suit', () => {
    {
      const attackingCard: CardModel = {
        Kind: KindModel.Four,
        Suit: SuitModel.Hearts,
        PlayedBy: PlayerOrNoneModel.None,
      };

      const defendingCard: CardModel = {
        Kind: KindModel.Four,
        Suit: SuitModel.Clubs,
        PlayedBy: PlayerOrNoneModel.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(true);
    }

    {
      const attackingCard: CardModel = {
        Kind: KindModel.Four,
        Suit: SuitModel.Clubs,
        PlayedBy: PlayerOrNoneModel.None,
      };

      const defendingCard: CardModel = {
        Kind: KindModel.Four,
        Suit: SuitModel.Hearts,
        PlayedBy: PlayerOrNoneModel.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(true);
    }

    {
      const attackingCard: CardModel = {
        Kind: KindModel.King,
        Suit: SuitModel.Diamonds,
        PlayedBy: PlayerOrNoneModel.None,
      };

      const defendingCard: CardModel = {
        Kind: KindModel.King,
        Suit: SuitModel.Clubs,
        PlayedBy: PlayerOrNoneModel.None,
      };

      expect(cardTrumpsCard(attackingCard, defendingCard)).toBe(true);
    }
  });
});
