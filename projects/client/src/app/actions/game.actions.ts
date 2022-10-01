import { MoveModel } from '../models/move.model';
import { PlaceCardAttemptModel } from '../models/place-card-attempt.model';
import { PlayerGameStateModel } from '../models/player-game-state-model';

export class UpdateGameState {
  static readonly type = '[GameState] Update Game State';
  constructor(public playerGameState: PlayerGameStateModel) {}
}

export class GameOver {
  static readonly type = '[GameState] Game Over';
  constructor(public message: string) {}
}

export class StartPlacingMultipleCards {
  static readonly type = '[GameState] Start Placing Multiple Cards';
  constructor(public placeCardAttempt: PlaceCardAttemptModel) {}
}

export class FinishPlacingMultipleCards {
  static readonly type = '[GameState] Finish Placing Multiple Cards';
  constructor(public move?: MoveModel) {}
}
