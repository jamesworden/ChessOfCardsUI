import { Card } from 'projects/client/src/app/models/card.model';
import { PlaceCardAttempt } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';

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
