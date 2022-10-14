import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  FinishPlacingMultipleCards,
  GameOver,
  StartPlacingMultipleCards,
  UpdateGameState,
} from '../actions/game.actions';
import { CardModel } from '../models/card.model';
import { PlaceCardAttemptModel } from '../models/place-card-attempt.model';
import { PlayerGameStateModel } from '../models/player-game-state-model';

type GameStateModel = {
  gameData: PlayerGameStateModel;
  gameOverMessage: string;
  isPlacingMultipleCards: boolean;
  initalPlaceMultipleCardAttempt: PlaceCardAttemptModel | null;
  placeMultipleCardsHand: CardModel[] | null;
  placeMultipleCards: CardModel[] | null;
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
  static gameOverMessage(state: GameStateModel) {
    return state.gameOverMessage;
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

  @Action(UpdateGameState)
  updateGameState(ctx: StateContext<GameStateModel>, action: UpdateGameState) {
    ctx.patchState({
      gameData: action.playerGameState,
    });
  }

  @Action(GameOver)
  gameOver(ctx: StateContext<GameStateModel>, action: GameOver) {
    ctx.patchState({
      gameOverMessage: action.message,
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
      placeMultipleCardsHand: action.cardsInPlayerHand,
      initalPlaceMultipleCardAttempt: action.placeCardAttempt,
    });
  }

  @Action(FinishPlacingMultipleCards)
  stopPlacingMultipleCards(
    ctx: StateContext<GameStateModel>,
    _: FinishPlacingMultipleCards
  ) {
    // TODO: If a move exists, validate it and signal r service it move again
    // TODO: mave move with signal r service

    ctx.patchState({
      isPlacingMultipleCards: false,
      placeMultipleCards: null,
      placeMultipleCardsHand: null,
      initalPlaceMultipleCardAttempt: null,
    });
  }
}
