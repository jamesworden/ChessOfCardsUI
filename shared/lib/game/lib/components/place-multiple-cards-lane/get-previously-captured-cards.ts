import { Card, PlaceCardAttempt, PlayerGameView } from '@shared/models';

export function getPreviouslyCapturedCards(
  initialMultiplePlaceCardAttempt: PlaceCardAttempt | null,
  playerGameView: PlayerGameView | null
) {
  if (!initialMultiplePlaceCardAttempt || !playerGameView) {
    return [];
  }

  const { TargetLaneIndex, TargetRowIndex } = initialMultiplePlaceCardAttempt;
  const lane = playerGameView.Lanes[TargetLaneIndex];
  const cards: Card[] = [];

  if (playerGameView.IsHost) {
    for (let i = 0; i < TargetRowIndex; i++) {
      const row = lane.Rows[i];
      const topCard = row[row.length - 1];
      cards.push(topCard);
    }
  } else {
    for (let i = 6; i > TargetRowIndex; i--) {
      const row = lane.Rows[i];
      const topCard = row[row.length - 1];
      cards.push(topCard);
    }
  }

  return cards;
}
