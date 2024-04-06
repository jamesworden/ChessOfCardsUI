import { Kind, PlayerGameView, PlayerOrNone } from '@client/models';

export function opponentCapturedAnyRowWithAce(gameState: PlayerGameView) {
  const { Lanes } = gameState;

  for (const lane of Lanes) {
    for (const row of lane.Rows) {
      if (row.length <= 0) {
        continue;
      }

      const topCard = row[row.length - 1];
      const topCardIsAce = topCard.Kind == Kind.Ace;
      const topCardPlayedByOpponent = gameState.IsHost
        ? topCard.PlayedBy == PlayerOrNone.Guest
        : topCard.PlayedBy == PlayerOrNone.Host;

      if (topCardIsAce && topCardPlayedByOpponent) {
        return true;
      }
    }
  }

  return false;
}
