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
  UpdateGameState,
} from '../actions/game.actions';
import { CardModel } from '../models/card.model';
import { GameOverData } from '../models/game-over-data.model';
import { PlaceCardAttemptModel } from '../models/place-card-attempt.model';
import { PlayerGameStateModel } from '../models/player-game-state-model';
import { SignalrService } from '../services/SignalRService';

type GameStateModel = {
  gameData: PlayerGameStateModel | null;
  isPlacingMultipleCards: boolean;
  initalPlaceMultipleCardAttempt: PlaceCardAttemptModel | null;
  placeMultipleCardsHand: CardModel[] | null;
  placeMultipleCards: CardModel[] | null;
  drawOfferSent: boolean;
  hasPendingDrawOffer: boolean;
  gameCode: string | null;
  gameOverData: GameOverData;
};

const initialGameState: GameStateModel = {
  gameData: null,
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
};

@State<GameStateModel>({
  name: 'gameState',
  defaults: initialGameState,
})
@Injectable()
export class GameState {
  @Selector()
  static gameData(state: GameStateModel) {
    return state.gameData;
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

  constructor(private signalrService: SignalrService) {}

  @Action(UpdateGameState)
  updateGameState(ctx: StateContext<GameStateModel>, action: UpdateGameState) {
    ctx.patchState({
      gameData: action.playerGameState,
      drawOfferSent: false,
      hasPendingDrawOffer: false,
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
      gameData: undefined,
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
    this.signalrService.offerDraw();

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
    this.signalrService.denyDrawOffer();

    ctx.patchState({
      hasPendingDrawOffer: false,
    });
  }

  @Action(AcceptDrawOffer)
  acceptDrawOffer(ctx: StateContext<GameStateModel>) {
    this.signalrService.acceptDrawOffer();

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
}
