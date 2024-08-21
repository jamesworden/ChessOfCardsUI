import { cardEqualsCard } from '@shared/logic';
import { PlayerGameView } from '@shared/models';

export interface SuitAndKindHasValidMove {
  [suit: string]:
    | {
        [kind: string]: boolean;
      }
    | undefined;
}

export function suitAndKindHasValidMove(
  playerGameView?: PlayerGameView | null
): SuitAndKindHasValidMove {
  if (!playerGameView) {
    return {};
  }

  const suitAndKindHasValidMove: SuitAndKindHasValidMove = {};

  const cardsInHand = playerGameView.hand?.cards ?? [];

  const cardsWithValidMoves = cardsInHand.filter(
    (card) =>
      playerGameView?.candidateMoves?.some((candidateMove) => {
        const candidateCard = candidateMove.move.placeCardAttempts[0].card;
        const isSameCard = cardEqualsCard(candidateCard, card);
        return isSameCard && candidateMove.isValid;
      }) ?? false
  );

  for (const card of cardsWithValidMoves) {
    if (!suitAndKindHasValidMove[card.suit]) {
      suitAndKindHasValidMove[card.suit] = {};
    }
    suitAndKindHasValidMove[card.suit]![card.kind] = true;
  }

  return suitAndKindHasValidMove;
}
