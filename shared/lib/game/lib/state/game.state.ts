import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  AcceptDrawOffer,
  DenyDrawOffer,
  DrawOffered,
  FinishPlacingMultipleCards,
  SetGameOverData,
  OfferDraw,
  ResetGameData,
  SetPlaceMultipleCards,
  SetPlaceMultipleCardsHand,
  StartPlacingMultipleCards,
  UpdatePlayerGameView,
  SetOpponentPassedMove,
  SetGameCodeIsInvalid,
  PassMove,
  MakeMove,
  RearrangeHand,
  CreatePendingGame,
  JoinGame,
  ResignGame,
  SelectDurationOption,
  SetPendingGameView,
  ResetPendingGameView,
  CheckHostForEmptyTimer,
  CheckGuestForEmptyTimer,
  AnimateGameView,
  SetGameIsActive,
  SendChatMessage,
  SetIsConnectedToServer,
  ConnectToServer,
  DeletePendingGame,
  SetNameIsInvalid,
  SetOpponentIsDisconnected,
  InitGameState,
  MarkLatestReadChatMessage,
} from './game.actions';
import {
  Card,
  PlayerGameView,
  GameOverData,
  PendingGameView,
  PlaceCardAttempt,
  Environment,
  DurationOption,
} from '@shared/models';
import { isPlayersTurn } from '@shared/logic';
import { GameWebsocketService } from '../services/game.websocket.service';

type GameStateModel = {
  playerGameView: PlayerGameView | null;
  playerGameViewToAnimate: PlayerGameView | null;
  isPlacingMultipleCards: boolean;
  initalPlaceMultipleCardAttempt: PlaceCardAttempt | null;
  placeMultipleCardsHand: Card[] | null;
  placeMultipleCards: Card[] | null;
  drawOfferSent: boolean;
  hasPendingDrawOffer: boolean;
  pendingGameView: PendingGameView | null;
  gameOverData: GameOverData;
  opponentPassedMove: boolean;
  gameCodeIsInvalid: boolean;
  nameIsInvalid: boolean;
  waitingForServer: boolean;
  gameIsActive: boolean;
  isConnectedToServer: boolean;
  opponentIsDisconnected: boolean;
  environment: Environment | null;
};

const defaultGameState: GameStateModel = {
  playerGameView: null,
  playerGameViewToAnimate: null,
  isPlacingMultipleCards: false,
  initalPlaceMultipleCardAttempt: null,
  placeMultipleCardsHand: null,
  placeMultipleCards: null,
  drawOfferSent: false,
  hasPendingDrawOffer: false,
  pendingGameView: null,
  gameOverData: {
    isOver: false,
  },
  opponentPassedMove: false,
  gameCodeIsInvalid: false,
  nameIsInvalid: false,
  waitingForServer: false,
  gameIsActive: false,
  isConnectedToServer: false,
  opponentIsDisconnected: false,
  environment: null,
};

@State<GameStateModel>({
  name: 'gameState',
  defaults: defaultGameState,
})
@Injectable()
export class GameState {
  readonly #gameWebsocketService = inject(GameWebsocketService);

  @Selector()
  static playerGameViewToAnimate(state: GameStateModel) {
    return state.playerGameViewToAnimate;
  }

  @Selector()
  static playerGameView(state: GameStateModel) {
    return state.playerGameView;
  }

  @Selector()
  static isPlacingMultipleCards(state: GameStateModel) {
    return state.isPlacingMultipleCards;
  }

  @Selector()
  static placeMultipleCardsHand(state: GameStateModel) {
    return state.placeMultipleCardsHand;
  }

  @Selector()
  static placeMultipleCards(state: GameStateModel) {
    return state.placeMultipleCards;
  }

  @Selector()
  static initialPlaceMultipleCardAttempt(state: GameStateModel) {
    return state.initalPlaceMultipleCardAttempt;
  }

  @Selector()
  static drawOfferSent(state: GameStateModel) {
    return state.drawOfferSent;
  }

  @Selector()
  static hasPendingDrawOffer(state: GameStateModel) {
    return state.hasPendingDrawOffer;
  }

  @Selector()
  static pendingGameView(state: GameStateModel) {
    return state.pendingGameView;
  }

  @Selector()
  static gameOverData(state: GameStateModel) {
    return state.gameOverData;
  }

  @Selector()
  static opponentPassedMove(state: GameStateModel) {
    return state.opponentPassedMove;
  }

  @Selector()
  static gameCodeIsInvalid(state: GameStateModel) {
    return state.gameCodeIsInvalid;
  }

  @Selector()
  static nameIsInvalid(state: GameStateModel) {
    return state.nameIsInvalid;
  }

  @Selector()
  static waitingForServer(state: GameStateModel) {
    return state.waitingForServer;
  }

  @Selector()
  static gameIsActive(state: GameStateModel) {
    return state.gameIsActive;
  }

  @Selector()
  static isPlayersTurn(state: GameStateModel) {
    return state.playerGameView ? isPlayersTurn(state.playerGameView) : false;
  }

  @Selector()
  static isHost(state: GameStateModel) {
    return state.playerGameView ? state.playerGameView.isHost : false;
  }

  @Selector()
  static chatMessages(state: GameStateModel) {
    return state.playerGameView?.chatMessages ?? [];
  }

  @Selector()
  static isConnectedToServer(state: GameStateModel) {
    return state.isConnectedToServer;
  }

  @Selector()
  static pendingGameCode(state: GameStateModel) {
    return state.pendingGameView?.gameCode;
  }

  @Selector()
  static gameCode(state: GameStateModel) {
    return state.playerGameView?.gameCode;
  }

  @Selector()
  static opponentIsDisconnected(state: GameStateModel) {
    return state.opponentIsDisconnected;
  }

  @Action(UpdatePlayerGameView)
  updateGameState(
    ctx: StateContext<GameStateModel>,
    action: UpdatePlayerGameView
  ) {
    ctx.patchState({
      playerGameView: action.playerGameView,
      drawOfferSent: false,
      hasPendingDrawOffer: false,
      opponentPassedMove: false,
      waitingForServer: false,
    });
  }

  @Action(StartPlacingMultipleCards)
  startPlacingMultipleCards(
    ctx: StateContext<GameStateModel>,
    action: StartPlacingMultipleCards
  ) {
    ctx.patchState({
      isPlacingMultipleCards: true,
      placeMultipleCardsHand: action.remainingCardsInHand,
      initalPlaceMultipleCardAttempt: action.initalPlaceMultipleCardAttempt,
    });
  }

  @Action(FinishPlacingMultipleCards)
  finshingPlacingMultipleCards(
    ctx: StateContext<GameStateModel>,
    { cardPlacementsConfirmed }: FinishPlacingMultipleCards
  ) {
    const { playerGameView, placeMultipleCardsHand } = ctx.getState();

    if (cardPlacementsConfirmed && playerGameView && placeMultipleCardsHand) {
      playerGameView.hand.cards = placeMultipleCardsHand;
    }

    ctx.patchState({
      isPlacingMultipleCards: false,
      placeMultipleCards: null,
      placeMultipleCardsHand: null,
      initalPlaceMultipleCardAttempt: null,
      playerGameView,
    });
  }

  @Action(SetPlaceMultipleCards)
  setPlaceMultipleCards(
    ctx: StateContext<GameStateModel>,
    action: SetPlaceMultipleCards
  ) {
    ctx.patchState({
      placeMultipleCards: action.cards,
    });
  }

  @Action(SetPlaceMultipleCardsHand)
  setPlaceMultipleCardsHand(
    ctx: StateContext<GameStateModel>,
    action: SetPlaceMultipleCardsHand
  ) {
    ctx.patchState({
      placeMultipleCardsHand: action.cards,
    });
  }

  @Action(ResetGameData)
  resetGameData(ctx: StateContext<GameStateModel>) {
    ctx.patchState(defaultGameState);
  }

  @Action(OfferDraw)
  offerDraw(ctx: StateContext<GameStateModel>) {
    this.#gameWebsocketService.offerDraw();

    ctx.patchState({
      drawOfferSent: true,
    });
  }

  @Action(DrawOffered)
  drawOffered(ctx: StateContext<GameStateModel>) {
    ctx.patchState({
      hasPendingDrawOffer: true,
    });
  }

  @Action(DenyDrawOffer)
  denyDrawOffer(ctx: StateContext<GameStateModel>) {
    ctx.patchState({
      hasPendingDrawOffer: false,
    });
  }

  @Action(AcceptDrawOffer)
  acceptDrawOffer(ctx: StateContext<GameStateModel>) {
    this.#gameWebsocketService.acceptDrawOffer();

    ctx.patchState({
      hasPendingDrawOffer: false,
    });
  }

  @Action(SetPendingGameView)
  setPendingGameView(
    ctx: StateContext<GameStateModel>,
    action: SetPendingGameView
  ) {
    ctx.patchState({
      pendingGameView: action.pendingGameView,
      waitingForServer: false,
    });
  }

  @Action(ResetPendingGameView)
  resetPendingGameView(ctx: StateContext<GameStateModel>) {
    ctx.patchState({
      pendingGameView: null,
    });
  }

  @Action(SetGameOverData)
  gameOver(ctx: StateContext<GameStateModel>, action: SetGameOverData) {
    ctx.patchState({
      gameOverData: action.gameOverData,
      waitingForServer: false,
      gameIsActive: false,
      opponentIsDisconnected: false,
    });
  }

  @Action(SetOpponentPassedMove)
  setOpponentPassedMove(
    ctx: StateContext<GameStateModel>,
    action: SetOpponentPassedMove
  ) {
    ctx.patchState({
      opponentPassedMove: action.opponentPassedMove,
    });
  }

  @Action(SetGameCodeIsInvalid)
  setGameCodeIsInvalid(
    ctx: StateContext<GameStateModel>,
    action: SetGameCodeIsInvalid
  ) {
    ctx.patchState({
      gameCodeIsInvalid: action.gameCodeIsInvalid,
    });
  }

  @Action(SetNameIsInvalid)
  setNameIsInvalid(
    ctx: StateContext<GameStateModel>,
    action: SetNameIsInvalid
  ) {
    ctx.patchState({
      nameIsInvalid: action.nameIsInvalid,
    });
  }

  @Action(PassMove)
  passMove(ctx: StateContext<GameStateModel>) {
    this.#gameWebsocketService.passMove();

    ctx.patchState({
      waitingForServer: true,
    });
  }

  @Action(MakeMove)
  makeMove(ctx: StateContext<GameStateModel>, action: MakeMove) {
    this.#gameWebsocketService.makeMove(
      action.move,
      action.rearrangedCardsInHand
    );

    ctx.patchState({
      waitingForServer: true,
    });
  }

  @Action(RearrangeHand)
  rearrangeHand(_: StateContext<GameStateModel>, action: RearrangeHand) {
    this.#gameWebsocketService.rearrangeHand(action.cards);
  }

  @Action(CreatePendingGame)
  createPendingGame(
    _: StateContext<GameStateModel>,
    action: CreatePendingGame
  ) {
    this.#gameWebsocketService.createPendingGame(
      action.pendingGameOptions ?? {
        durationOption: DurationOption.FiveMinutes,
      }
    );
  }

  @Action(JoinGame)
  joinGame(_: StateContext<GameStateModel>, action: JoinGame) {
    this.#gameWebsocketService.joinGame(action.joinGameOptions);
  }

  @Action(ResignGame)
  resignGame() {
    this.#gameWebsocketService.resignGame();
  }

  @Action(SelectDurationOption)
  selectDurationOption(
    ctx: StateContext<GameStateModel>,
    action: SelectDurationOption
  ) {
    this.#gameWebsocketService.selectDurationOption(action.durationOption);

    ctx.patchState({
      waitingForServer: true,
    });
  }

  @Action(CheckHostForEmptyTimer)
  checkHostForEmptyTimer() {
    this.#gameWebsocketService.checkHostForEmptyTimer();
  }

  @Action(CheckGuestForEmptyTimer)
  checkGuestForEmptyTimer() {
    this.#gameWebsocketService.checkGuestForEmptyTimer();
  }

  @Action(AnimateGameView)
  animateGameView(ctx: StateContext<GameStateModel>, action: AnimateGameView) {
    console.log('[Game]: Starting animations...', action.playerGameView);

    ctx.patchState({
      playerGameViewToAnimate: action.playerGameView,
    });
  }

  @Action(SetGameIsActive)
  setGameIsActive(
    ctx: StateContext<GameStateModel>,
    { gameIsActive }: SetGameIsActive
  ) {
    ctx.patchState({
      gameIsActive,
    });
  }

  @Action(SendChatMessage)
  sendChatMessage(
    _: StateContext<GameStateModel>,
    { message }: SendChatMessage
  ) {
    this.#gameWebsocketService.sendChatMessage(message);
  }

  @Action(SetIsConnectedToServer)
  setIsConnectedToServer(
    ctx: StateContext<GameStateModel>,
    action: SetIsConnectedToServer
  ) {
    ctx.patchState({
      isConnectedToServer: action.isConnectedToServer,
    });
  }

  @Action(ConnectToServer)
  connectToServer(ctx: StateContext<GameStateModel>) {
    const { environment } = ctx.getState();

    if (environment) {
      this.#gameWebsocketService.connectToServer(environment);
    } else {
      console.error(
        '[GameState]: Tried to connect to the server without initializing!'
      );
    }
  }

  @Action(DeletePendingGame)
  deletePendingGame(ctx: StateContext<GameStateModel>) {
    this.#gameWebsocketService.deletePendingGame();

    ctx.patchState({
      pendingGameView: null,
    });
  }

  @Action(SetOpponentIsDisconnected)
  setOpponentIsDisconnected(
    ctx: StateContext<GameStateModel>,
    { opponentIsDisconnected }: SetOpponentIsDisconnected
  ) {
    ctx.patchState({
      opponentIsDisconnected,
    });
  }

  @Action(InitGameState)
  initGameState(
    ctx: StateContext<GameStateModel>,
    { environment }: InitGameState
  ) {
    ctx.patchState({
      environment,
    });
  }

  @Action(MarkLatestReadChatMessage)
  markLatestReadChatMessage(
    _: StateContext<GameStateModel>,
    { latestIndex }: MarkLatestReadChatMessage
  ) {
    this.#gameWebsocketService.markLatestReadChatMessage(latestIndex);
  }
}
