import { Card } from '@shared/models';

export function getCardImageFileName(card: Card) {
  const { suit: Suit, kind: Kind } = card;

  const suit = Suit.toLowerCase();
  const kind = Kind.toLowerCase();

  return `card_${suit}_${kind}.png`;
}
