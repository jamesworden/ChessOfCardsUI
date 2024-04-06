import { Card } from '@shared/models';

export function getCardImageFileName(card: Card) {
  const { Suit, Kind } = card;

  const suit = Suit.toLowerCase();
  const kind = Kind.toLowerCase();

  return `card_${suit}_${kind}.png`;
}

/**
 * @returns null if both jokers played already.
 */
export function getJokerImageFileName(
  laneIndex: number,
  redJokerLaneIndex?: number,
  blackJokerLaneIndex?: number
) {
  switch (laneIndex) {
    case redJokerLaneIndex: {
      return 'card_joker_red.png';
    }
    case blackJokerLaneIndex: {
      return 'card_joker_black.png';
    }
    default: {
      return null;
    }
  }
}
