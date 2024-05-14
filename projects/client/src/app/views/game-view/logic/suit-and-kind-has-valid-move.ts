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

  const cardsInHand = playerGameView.Hand?.Cards ?? [];

  const cardsWithValidMoves = cardsInHand.filter(
    (card) =>
      playerGameView?.CandidateMoves?.some((candidateMove) => {
        const candidateCard = candidateMove.Move.PlaceCardAttempts[0].Card;
        const isSameCard = cardEqualsCard(candidateCard, card);
        return isSameCard && candidateMove.IsValid;
      }) ?? false
  );

  for (const card of cardsWithValidMoves) {
    if (!suitAndKindHasValidMove[card.Suit]) {
      suitAndKindHasValidMove[card.Suit] = {};
    }
    suitAndKindHasValidMove[card.Suit]![card.Kind] = true;
  }

  return suitAndKindHasValidMove;
}
