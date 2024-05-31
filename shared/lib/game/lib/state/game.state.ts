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
} from './game.actions';
import {
  Card,
  PlayerGameView,
  GameOverData,
  PendingGameView,
  PlaceCardAttempt,
} from '@shared/models';
import { isPlayersTurn } from '@shared/logic';
import { GameService } from '../services/game.service';

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
  waitingForServer: boolean;
  gameIsActive: boolean;
  muted: boolean;
  isConnectedToServer: boolean;
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
  waitingForServer: false,
  gameIsActive: false,
  muted: false,
  isConnectedToServer: false,
};

@State<GameStateModel>({
  name: 'gameState',
  defaults: defaultGameState,
})
@Injectable()
export class GameState {
  readonly #gameService = inject(GameService);

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
    return state.playerGameView ? state.playerGameView.IsHost : false;
  }

  @Selector()
  static chatMessages(state: GameStateModel) {
    return state.playerGameView?.ChatMessages ?? [];
  }

  @Selector()
  static isConnectedToServer(state: GameStateModel) {
    return state.isConnectedToServer;
  }

  @Selector()
  static pendingGameCode(state: GameStateModel) {
    return state.pendingGameView?.GameCode;
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
      playerGameView.Hand.Cards = placeMultipleCardsHand;
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
    this.#gameService.offerDraw();

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
    this.#gameService.acceptDrawOffer();

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

  @Action(PassMove)
  passMove(ctx: StateContext<GameStateModel>) {
    this.#gameService.passMove();

    ctx.patchState({
      waitingForServer: true,
    });
  }

  @Action(MakeMove)
  makeMove(ctx: StateContext<GameStateModel>, action: MakeMove) {
    this.#gameService.makeMove(action.move, action.rearrangedCardsInHand);

    ctx.patchState({
      waitingForServer: true,
    });
  }

  @Action(RearrangeHand)
  rearrangeHand(_: StateContext<GameStateModel>, action: RearrangeHand) {
    this.#gameService.rearrangeHand(action.cards);
  }

  @Action(CreatePendingGame)
  createGame(_: StateContext<GameStateModel>, action: CreatePendingGame) {
    this.#gameService.createGame(action.pendingGameOptions);
  }

  @Action(JoinGame)
  joinGame(_: StateContext<GameStateModel>, action: JoinGame) {
    this.#gameService.joinGame(action.gameCode);
  }

  @Action(ResignGame)
  resignGame() {
    this.#gameService.resignGame();
  }

  @Action(SelectDurationOption)
  selectDurationOption(
    ctx: StateContext<GameStateModel>,
    action: SelectDurationOption
  ) {
    this.#gameService.selectDurationOption(action.durationOption);

    ctx.patchState({
      waitingForServer: true,
    });
  }

  @Action(CheckHostForEmptyTimer)
  checkHostForEmptyTimer() {
    this.#gameService.checkHostForEmptyTimer();
  }

  @Action(CheckGuestForEmptyTimer)
  checkGuestForEmptyTimer() {
    this.#gameService.checkGuestForEmptyTimer();
  }

  @Action(AnimateGameView)
  animateGameView(ctx: StateContext<GameStateModel>, action: AnimateGameView) {
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
    this.#gameService.sendChatMessage(message);
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
  connectToServer(_: StateContext<GameStateModel>, action: ConnectToServer) {
    this.#gameService.connectToServer(action.environment);
  }
}
