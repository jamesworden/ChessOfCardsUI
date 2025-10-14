import { Card, Kind, Suit } from '@shared/models';

export function getCardImageFileName(card: Card) {
  const suit = Suit[card.suit].toLowerCase();
  const kind = Kind[card.kind].toLowerCase();

  return `card_${suit}_${kind}.png`;
}
