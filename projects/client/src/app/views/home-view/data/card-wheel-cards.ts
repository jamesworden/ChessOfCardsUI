import { Card } from '../../../models/card.model';
import { Kind } from '../../../models/kind.model';
import { PlayerOrNone } from '../../../models/player-or-none.model';
import { Suit } from '../../../models/suit.model';

// Function to shuffle an array
const shuffleArray = (array: any[]): any[] => {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export const RIGHT_CARD_WHEEL_CARDS: Card[] = shuffleArray([
  {
    Kind: Kind.Ace,
    Suit: Suit.Spades,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Two,
    Suit: Suit.Hearts,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Three,
    Suit: Suit.Diamonds,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Four,
    Suit: Suit.Clubs,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Five,
    Suit: Suit.Spades,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Six,
    Suit: Suit.Hearts,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Seven,
    Suit: Suit.Diamonds,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Eight,
    Suit: Suit.Clubs,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Nine,
    Suit: Suit.Spades,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Ten,
    Suit: Suit.Hearts,
    PlayedBy: PlayerOrNone.None,
  },
]);

export const LEFT_CARD_WHEEL_CARDS: Card[] = shuffleArray([
  {
    Kind: Kind.Jack,
    Suit: Suit.Diamonds,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Queen,
    Suit: Suit.Clubs,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.King,
    Suit: Suit.Spades,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Ace,
    Suit: Suit.Hearts,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Two,
    Suit: Suit.Diamonds,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Three,
    Suit: Suit.Clubs,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Four,
    Suit: Suit.Spades,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Five,
    Suit: Suit.Hearts,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Six,
    Suit: Suit.Diamonds,
    PlayedBy: PlayerOrNone.None,
  },
  {
    Kind: Kind.Seven,
    Suit: Suit.Clubs,
    PlayedBy: PlayerOrNone.None,
  },
]);
