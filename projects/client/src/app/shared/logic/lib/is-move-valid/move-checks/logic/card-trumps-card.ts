import { Card, Kind } from '@client/models';

export function cardTrumpsCard(attackingCard: Card, defendingCard: Card) {
  const hasSameSuit = attackingCard.Suit === defendingCard.Suit;
  const hasSameKind = attackingCard.Kind === defendingCard.Kind;

  if (!hasSameSuit) {
    return hasSameKind;
  }

  return getKindValue(attackingCard.Kind) > getKindValue(defendingCard.Kind);
}

function getKindValue(kind: Kind) {
  const kinds = Object.keys(Kind);

  for (let i = 0; i < kinds.length; i++) {
    if (kind === kinds[i]) {
      return i;
    }
  }

  return -1;
}
