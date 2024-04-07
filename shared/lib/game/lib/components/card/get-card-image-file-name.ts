import { Card } from '@shared/models';

export function getCardImageFileName(card: Card) {
  const { Suit, Kind } = card;

  const suit = Suit.toLowerCase();
  const kind = Kind.toLowerCase();

  return `card_${suit}_${kind}.png`;
}
