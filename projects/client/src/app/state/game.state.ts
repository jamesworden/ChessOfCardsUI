import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  AcceptDrawOffer,
  DenyDrawOffer,
  DrawOffered,
  FinishPlacingMultipleCards,
  SetGameOverData,
  OfferDraw,
  ResetGameCode,
  ResetGameData,
  SetGameCode,
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
} from '../actions/game.actions';
import { Card } from '../models/card.model';
import { GameOverData } from '../models/game-over-data.model';
import { PlaceCardAttempt } from '../models/place-card-attempt.model';
import { PlayerGameView } from '../models/player-game-view.model';
import { WebsocketService } from '../services/websocket.service';

type GameStateModel = {
  playerGameView: PlayerGameView | null;
  isPlacingMultipleCards: boolean;
  initalPlaceMultipleCardAttempt: PlaceCardAttempt | null;
  placeMultipleCardsHand: Card[] | null;
  placeMultipleCards: Card[] | null;
  drawOfferSent: boolean;
  hasPendingDrawOffer: boolean;
  gameCode: string | null;
  gameOverData: GameOverData;
  opponentPassedMove: boolean;
  gameCodeIsInvalid: boolean;
};

const initialGameState: GameStateModel = {
  playerGameView: null,
  isPlacingMultipleCards: false,
  initalPlaceMultipleCardAttempt: null,
  placeMultipleCardsHand: null,
  placeMultipleCards: null,
  drawOfferSent: false,
  hasPendingDrawOffer: false,
  gameCode: null,
  gameOverData: {
    isOver: false,
  },
  opponentPassedMove: false,
  gameCodeIsInvalid: false,
};

@State<GameStateModel>({
  name: 'gameState',
  defaults: initialGameState,
})
@Injectable()
export class GameState {
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
  static gameCode(state: GameStateModel) {
    return state.gameCode;
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

  constructor(private websocketService: WebsocketService) {}

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
  stopPlacingMultipleCards(ctx: StateContext<GameStateModel>) {
    ctx.patchState({
      isPlacingMultipleCards: false,
      placeMultipleCards: null,
      placeMultipleCardsHand: null,
      initalPlaceMultipleCardAttempt: null,
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
      gameCode: null,
      drawOfferSent: false,
      hasPendingDrawOffer: false,
      gameOverData: {
        isOver: false,
        message: undefined,
      },
    });
  }

  @Action(OfferDraw)
  offerDraw(ctx: StateContext<GameStateModel>) {
    this.websocketService.offerDraw();

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
    this.websocketService.acceptDrawOffer();

    ctx.patchState({
      hasPendingDrawOffer: false,
    });
  }

  @Action(SetGameCode)
  setGameCode(ctx: StateContext<GameStateModel>, action: SetGameCode) {
    ctx.patchState({
      gameCode: action.gameCode,
    });
  }

  @Action(ResetGameCode)
  resetGameCode(ctx: StateContext<GameStateModel>) {
    ctx.patchState({
      gameCode: null,
    });
  }

  @Action(SetGameOverData)
  gameOver(ctx: StateContext<GameStateModel>, action: SetGameOverData) {
    ctx.patchState({
      gameOverData: action.gameOverData,
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
  passMove() {
    this.websocketService.passMove();
  }

  @Action(MakeMove)
  makeMove(_: StateContext<GameStateModel>, action: MakeMove) {
    this.websocketService.makeMove(action.move);
  }

  @Action(RearrangeHand)
  rearrangeHand(_: StateContext<GameStateModel>, action: RearrangeHand) {
    this.websocketService.rearrangeHand(action.cards);
  }

  @Action(CreateGame)
  createGame() {
    this.websocketService.createGame();
  }

  @Action(JoinGame)
  joinGame(_: StateContext<GameStateModel>, action: JoinGame) {
    this.websocketService.joinGame(action.gameCode);
  }

  @Action(ResignGame)
  resignGame() {
    this.websocketService.resignGame();
  }

  @Action(SelectDurationOption)
  selectDurationOption(
    _: StateContext<GameStateModel>,
    action: SelectDurationOption
  ) {
    this.websocketService.selectDurationOption(action.durationOption);
  }
}
