import { CardModel } from '../models/card.model';
import { MoveModel } from '../models/move.model';
import { PlaceCardAttemptModel } from '../models/place-card-attempt.model';
import { PlayerGameStateModel } from '../models/player-game-state-model';

export class UpdateGameState {
  static readonly type = '[GameState] Update Game State';
  constructor(public playerGameState: PlayerGameStateModel) {}
}

export class StartPlacingMultipleCards {
  static readonly type = '[GameState] Start Placing Multiple Cards';
  constructor(
    public placeCardAttempt: PlaceCardAttemptModel,
    public remainingCardsInHand: CardModel[]
  ) {}
}

export class FinishPlacingMultipleCards {
  static readonly type = '[GameState] Finish Placing Multiple Cards';
  constructor(public move?: MoveModel) {}
}

export class SetPlaceMultipleCards {
  static readonly type = '[GameState] Set Place Multiple Cards';
  constructor(public cards: CardModel[]) {}
}

export class SetPlaceMultipleCardsHand {
  static readonly type = '[GameState] Set Place Multiple Cards Hand';
  constructor(public cards: CardModel[]) {}
}
