import { Card } from '../models/card.model';
import { DurationOption } from '../models/duration-option.model';
import { GameOverData } from '../models/game-over-data.model';
import { Move } from '../models/move.model';
import { PlaceCardAttempt } from '../models/place-card-attempt.model';
import { PlayerGameView } from '../models/player-game-view.model';

export class UpdatePlayerGameView {
  static readonly type = '[GameState] Update Game State';
  constructor(public playerGameView: PlayerGameView) {}
}

export class StartPlacingMultipleCards {
  static readonly type = '[GameState] Start Placing Multiple Cards';
  constructor(
    public placeCardAttempt: PlaceCardAttempt,
    public remainingCardsInHand: Card[]
  ) {}
}

export class FinishPlacingMultipleCards {
  static readonly type = '[GameState] Finish Placing Multiple Cards';
  constructor() {}
}

export class SetPlaceMultipleCards {
  static readonly type = '[GameState] Set Place Multiple Cards';
  constructor(public cards: Card[]) {}
}

export class SetPlaceMultipleCardsHand {
  static readonly type = '[GameState] Set Place Multiple Cards Hand';
  constructor(public cards: Card[]) {}
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

export class SetGameOverData {
  static readonly type = '[GameState] Game Over';
  constructor(public gameOverData: GameOverData) {}
}

export class SetOpponentPassedMove {
  static readonly type = '[GameState] Set Opponent Passed Move';
  constructor(public opponentPassedMove: boolean) {}
}

export class SetGameCodeIsInvalid {
  static readonly type = '[GameState] Set Game Code Is Invalid';
  constructor(public gameCodeIsInvalid: boolean) {}
}

export class PassMove {
  static readonly type = '[GameState] Pass Move';
}

export class MakeMove {
  static readonly type = '[GameState] Make Move';
  constructor(public move: Move) {}
}

export class RearrangeHand {
  static readonly type = '[GameState] Rearrange Hand';
  constructor(public cards: Card[]) {}
}

export class CreateGame {
  static readonly type = '[GameState] Create Game';
}

export class JoinGame {
  static readonly type = '[GameState] Join Game';
  constructor(public gameCode: string) {}
}

export class ResignGame {
  static readonly type = '[GameState] Resign Game';
}

export class SelectDurationOption {
  static readonly type = '[GameState] Select Duration Option';
  constructor(public durationOption: DurationOption) {}
}
