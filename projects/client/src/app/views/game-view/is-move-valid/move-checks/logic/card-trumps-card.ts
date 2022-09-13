import { CardModel } from 'projects/client/src/app/models/card.model';
import { KindModel } from 'projects/client/src/app/models/kind.model';

export function cardTrumpsCard(
  attackingCard: CardModel,
  defendingCard: CardModel
) {
  const hasSameSuit = attackingCard.Suit === defendingCard.Suit;
  const hasSameKind = attackingCard.Kind === defendingCard.Kind;

  if (!hasSameSuit) {
    return hasSameKind;
  }

  return getKindValue(attackingCard.Kind) > getKindValue(defendingCard.Kind);
}

function getKindValue(kind: KindModel) {
  const kinds = Object.keys(KindModel);

  for (let i = 0; i < kinds.length; i++) {
    if (kind === kinds[i]) {
      return i;
    }
  }

  return -1;
}
