import { CardModel } from 'projects/client/src/app/models/card.model';

export function cardsHaveMatchingSuit(card1: CardModel, card2: CardModel) {
  const suitMatches = card1.Suit === card2.Suit;
  return suitMatches;
}
