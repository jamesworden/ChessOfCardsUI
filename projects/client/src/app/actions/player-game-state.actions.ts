import { PlayerGameStateModel } from '../models/player-game-state-model';

export class UpdateGameState {
  static readonly type = '[PlayerGameState] Update Game State';
  constructor(public playerGameState: PlayerGameStateModel) {}
}
