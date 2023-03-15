import { Kind } from 'projects/client/src/app/models/kind.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';

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
