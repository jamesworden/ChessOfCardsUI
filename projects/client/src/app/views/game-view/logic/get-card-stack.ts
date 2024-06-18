import { CardPosition, PlayerGameView } from '@shared/models';

export function getCardStack(
  playerGameView: PlayerGameView | null,
  cardPosition: CardPosition | null
) {
  if (!cardPosition) {
    return [];
  }

  return (
    playerGameView?.lanes[cardPosition.LaneIndex].Rows[cardPosition.RowIndex] ??
    []
  );
}
