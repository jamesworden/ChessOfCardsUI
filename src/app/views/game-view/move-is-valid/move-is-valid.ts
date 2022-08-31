import { MoveModel } from 'src/app/models/move.model';
import { PlayerGameStateModel } from 'src/app/models/player-game-state-model';
import { isPlayersTurn } from './is-players-turn';

export function moveIsValid(move: MoveModel, gameState: PlayerGameStateModel) {
  if (!isPlayersTurn(move, gameState)) {
    return false;
  }

  // TODO: Return false for all other invalid moves

  return true;
}
