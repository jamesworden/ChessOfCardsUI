import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
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
  CreateGame,
  JoinGame,
  ResignGame,
  SelectDurationOption,
  SetPendingGameView,
  ResetPendingGameView,
  CheckHostForEmptyTimer,
  CheckGuestForEmptyTimer,
  AnimateGameView,
  SetGameIsActive,
} from '../actions/game.actions';
import { Card } from '../models/card.model';
import { GameOverData } from '../models/game-over-data.model';
import { PendingGameView } from '../models/pending-game-view.model';
import { PlaceCardAttempt } from '../models/place-card-attempt.model';
import { PlayerGameView } from '../models/player-game-view.model';
import { WebsocketService } from '../services/websocket.service';

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
};

const initialGameState: GameStateModel = {
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
};

@State<GameStateModel>({
  name: 'gameState',
  defaults: initialGameState,
})
@Injectable()
export class GameState {
  readonly #websocketService = inject(WebsocketService);

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
      placeMultipleCards: [action.placeCardAttempt.Card],
      placeMultipleCardsHand: action.remainingCardsInHand,
      initalPlaceMultipleCardAttempt: action.placeCardAttempt,
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
    ctx.patchState({
      playerGameView: undefined,
      pendingGameView: null,
      drawOfferSent: false,
      hasPendingDrawOffer: false,
      gameOverData: {
        isOver: false,
        message: undefined,
      },
      gameIsActive: false,
    });
  }

  @Action(OfferDraw)
  offerDraw(ctx: StateContext<GameStateModel>) {
    this.#websocketService.offerDraw();

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
    this.#websocketService.acceptDrawOffer();

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
    this.#websocketService.passMove();

    ctx.patchState({
      waitingForServer: true,
    });
  }

  @Action(MakeMove)
  makeMove(ctx: StateContext<GameStateModel>, action: MakeMove) {
    this.#websocketService.makeMove(action.move);

    ctx.patchState({
      waitingForServer: true,
    });
  }

  @Action(RearrangeHand)
  rearrangeHand(_: StateContext<GameStateModel>, action: RearrangeHand) {
    this.#websocketService.rearrangeHand(action.cards);
  }

  @Action(CreateGame)
  createGame() {
    this.#websocketService.createGame();
  }

  @Action(JoinGame)
  joinGame(_: StateContext<GameStateModel>, action: JoinGame) {
    this.#websocketService.joinGame(action.gameCode);
  }

  @Action(ResignGame)
  resignGame() {
    this.#websocketService.resignGame();
  }

  @Action(SelectDurationOption)
  selectDurationOption(
    ctx: StateContext<GameStateModel>,
    action: SelectDurationOption
  ) {
    this.#websocketService.selectDurationOption(action.durationOption);

    ctx.patchState({
      waitingForServer: true,
    });
  }

  @Action(CheckHostForEmptyTimer)
  checkHostForEmptyTimer() {
    this.#websocketService.checkHostForEmptyTimer();
  }

  @Action(CheckGuestForEmptyTimer)
  checkGuestForEmptyTimer() {
    this.#websocketService.checkGuestForEmptyTimer();
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
}
