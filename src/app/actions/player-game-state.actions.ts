import { PlayerGameState } from '../models/player-game-state';

export class UpdateGameState {
  static readonly type = '[PlayerGameState] Update Game State';
  constructor(public playerGameState: PlayerGameState) {}
}
