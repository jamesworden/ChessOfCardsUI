import { Card, PlaceCardAttempt, PlayerGameView } from '@shared/models';

export function getPreviouslyCapturedCards(
  initialMultiplePlaceCardAttempt: PlaceCardAttempt | null,
  playerGameView: PlayerGameView | null
) {
  if (!initialMultiplePlaceCardAttempt || !playerGameView) {
    return [];
  }

  const { targetLaneIndex: TargetLaneIndex, targetRowIndex: TargetRowIndex } =
    initialMultiplePlaceCardAttempt;
  const lane = playerGameView.lanes[TargetLaneIndex];
  const cards: Card[] = [];

  if (playerGameView.isHost) {
    for (let i = 0; i < TargetRowIndex; i++) {
      const row = lane.rows[i];
      const topCard = row[row.length - 1];
      cards.push(topCard);
    }
  } else {
    for (let i = 6; i > TargetRowIndex; i--) {
      const row = lane.rows[i];
      const topCard = row[row.length - 1];
      cards.push(topCard);
    }
  }

  return cards;
}
