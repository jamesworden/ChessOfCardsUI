import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  AcceptDrawOffer,
  DenyDrawOffer,
  DrawOffered,
  FinishPlacingMultipleCards,
  OfferDraw,
  ResetGameData,
  SetPlaceMultipleCards,
  SetPlaceMultipleCardsHand,
  StartPlacingMultipleCards,
  UpdateGameState,
} from '../actions/game.actions';
import { CardModel } from '../models/card.model';
import { PlaceCardAttemptModel } from '../models/place-card-attempt.model';
import { PlayerGameStateModel } from '../models/player-game-state-model';
import { SignalrService } from '../services/SignalRService';

type GameStateModel = {
  gameData: PlayerGameStateModel;
  isPlacingMultipleCards: boolean;
  initalPlaceMultipleCardAttempt: PlaceCardAttemptModel | null;
  placeMultipleCardsHand: CardModel[] | null;
  placeMultipleCards: CardModel[] | null;
  drawOfferSent: boolean;
  drawOfferRecieved: boolean;
};

@State<GameStateModel>({
  name: 'gameState',
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
  static drawOfferRecieved(state: GameStateModel) {
    return state.drawOfferRecieved;
  }

  constructor(private signalrService: SignalrService) {}

  @Action(UpdateGameState)
  updateGameState(ctx: StateContext<GameStateModel>, action: UpdateGameState) {
    ctx.patchState({
      gameData: action.playerGameState,
      drawOfferSent: false,
      drawOfferRecieved: false,
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
      drawOfferRecieved: true,
    });
  }

  @Action(DenyDrawOffer)
  denyDrawOffer(ctx: StateContext<GameStateModel>) {
    this.signalrService.denyDrawOffer();

    ctx.patchState({
      drawOfferRecieved: false,
    });
  }

  @Action(AcceptDrawOffer)
  acceptDrawOffer(ctx: StateContext<GameStateModel>) {
    this.signalrService.acceptDrawOffer();

    ctx.patchState({
      drawOfferRecieved: false,
    });
  }
}
