import { CardModel } from '../models/card.model';
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
  constructor() {}
}

export class SetPlaceMultipleCards {
  static readonly type = '[GameState] Set Place Multiple Cards';
  constructor(public cards: CardModel[]) {}
}

export class SetPlaceMultipleCardsHand {
  static readonly type = '[GameState] Set Place Multiple Cards Hand';
  constructor(public cards: CardModel[]) {}
}

export class ResetGameData {
  static readonly type = '[GameState] Reset Game Data';
}

export class OfferDraw {
  static readonly type = '[GameState] Offer Draw';
}

export class DrawOffered {
  static readonly type = '[GameState] Draw Offered';
}

export class DenyDrawOffer {
  static readonly type = '[GameState] Deny Draw Offer';
}

export class AcceptDrawOffer {
  static readonly type = '[GameState] Accept Draw Offer';
}

export class SetGameCode {
  static readonly type = '[GameState] Set Game Code';
  constructor(public gameCode: string) {}
}

export class ResetGameCode {
  static readonly type = '[GameState] Reset Game Code';
}

export class GameOver {
  static readonly type = '[GameState] Game Over';
  constructor(public message?: string) {}
}
