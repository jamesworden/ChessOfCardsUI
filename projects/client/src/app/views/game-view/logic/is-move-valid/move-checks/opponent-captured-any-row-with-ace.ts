import { KindModel } from 'projects/client/src/app/models/kind.model';
import { PlayerGameStateModel } from 'projects/client/src/app/models/player-game-state-model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function opponentCapturedAnyRowWithAce(gameState: PlayerGameStateModel) {
  const { Lanes } = gameState;

  for (const lane of Lanes) {
    for (const row of lane.Rows) {
      if (row.length <= 0) {
        continue;
      }

      const topCard = row[row.length - 1];
      const topCardIsAce = topCard.Kind == KindModel.Ace;
      const topCardPlayedByOpponent = gameState.IsHost
        ? topCard.PlayedBy == PlayerOrNoneModel.Guest
        : topCard.PlayedBy == PlayerOrNoneModel.Host;

      if (topCardIsAce && topCardPlayedByOpponent) {
        return true;
      }
    }
  }

  return false;
}
