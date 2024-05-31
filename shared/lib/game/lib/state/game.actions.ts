import {
  PlayerGameView,
  PlaceCardAttempt,
  Card,
  GameOverData,
  Move,
  DurationOption,
  PendingGameView,
  PendingGameOptions,
  Environment,
} from '@shared/models';

export class SetIsConnectedToServer {
  static readonly type = '[GameState] Set Is Connected To Server';
  constructor(public isConnectedToServer: boolean) {}
}

export class ConnectToServer {
  static readonly type = '[GameState] Connect To Server';
  constructor(public environment: Environment) {}
}

export class AnimateGameView {
  static readonly type = '[GameState] Animate Game View';
  constructor(public playerGameView: PlayerGameView) {}
}

export class UpdatePlayerGameView {
  static readonly type = '[GameState] Update Game State';
  constructor(public playerGameView: PlayerGameView) {}
}

export class StartPlacingMultipleCards {
  static readonly type = '[GameState] Start Placing Multiple Cards';
  constructor(
    public remainingCardsInHand: Card[],
    public initalPlaceMultipleCardAttempt: PlaceCardAttempt
  ) {}
}

export class FinishPlacingMultipleCards {
  static readonly type = '[GameState] Finish Placing Multiple Cards';
  constructor(public cardPlacementsConfirmed: boolean) {}
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
  constructor(
    public move: Move,
    public rearrangedCardsInHand?: Card[]
  ) {}
}

export class RearrangeHand {
  static readonly type = '[GameState] Rearrange Hand';
  constructor(public cards: Card[]) {}
}

export class CreatePendingGame {
  static readonly type = '[GameState] Create Pending Game';
  constructor(public pendingGameOptions?: PendingGameOptions) {}
}

export class DeletePendingGame {
  static readonly type = '[GameState] Delete Pending Game';
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

export class SetPendingGameView {
  static readonly type = '[GameState] Set Pending Game View';
  constructor(public pendingGameView: PendingGameView) {}
}

export class ResetPendingGameView {
  static readonly type = '[GameState] Reset Pending Game View';
}

export class CheckHostForEmptyTimer {
  static readonly type = '[GameState] Check Host For Empty Timer';
}

export class CheckGuestForEmptyTimer {
  static readonly type = '[GameState] Check Guest For Empty Timer';
}

export class SetGameIsActive {
  static readonly type = '[GameState] Game Is Active';
  constructor(public gameIsActive: boolean) {}
}

export class SendChatMessage {
  static readonly type = '[GameState] Send Chat Message';
  constructor(public message: string) {}
}
