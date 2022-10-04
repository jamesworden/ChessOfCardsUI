import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  FinishPlacingMultipleCards,
  GameOver,
  StartPlacingMultipleCards,
  UpdateGameState,
} from '../actions/game.actions';
import { PlayerGameStateModel } from '../models/player-game-state-model';

type GameStateModel = {
  gameData: PlayerGameStateModel;
  gameOverMessage: string;
  placingMultipleCardsLaneIndex: null | number;
};

@State<GameStateModel>({
  name: 'gameState',
})
@Injectable()
export class GameState {
  @Action(UpdateGameState)
  updateGameState(ctx: StateContext<GameStateModel>, action: UpdateGameState) {
    ctx.setState((state) => {
      const updatedState: GameStateModel = { ...state };

      updatedState.gameData = action.playerGameState;
      updatedState.placingMultipleCardsLaneIndex = null;
      return updatedState;
    });

    ctx.patchState({
      gameData: action.playerGameState,
    });
  }

  @Selector()
  static gameData(state: GameStateModel) {
    return state.gameData;
  }

  @Action(GameOver)
  gameOver(ctx: StateContext<GameStateModel>, action: GameOver) {
    ctx.setState((state) => {
      const updatedState: GameStateModel = { ...state };

      updatedState.gameOverMessage = action.message;
      return updatedState;
    });

    ctx.patchState({
      gameOverMessage: action.message,
    });
  }

  @Selector()
  static gameOverMessage(state: GameStateModel) {
    return state.gameOverMessage;
  }

  @Action(StartPlacingMultipleCards)
  startPlacingMultipleCards(
    ctx: StateContext<GameStateModel>,
    action: StartPlacingMultipleCards
  ) {
    ctx.setState((state) => {
      const updatedState: GameStateModel = { ...state };

      updatedState.placingMultipleCardsLaneIndex =
        action.placeCardAttempt.TargetLaneIndex;
      return updatedState;
    });

    ctx.patchState({
      placingMultipleCardsLaneIndex: action.placeCardAttempt.TargetLaneIndex,
    });
  }

  @Action(FinishPlacingMultipleCards)
  stopPlacingMultipleCards(
    ctx: StateContext<GameStateModel>,
    action: FinishPlacingMultipleCards
  ) {
    ctx.setState((state) => {
      const updatedState: GameStateModel = { ...state };
      const { move } = action;

      if (move) {
        // Validate move is valid again
        // Signal R Service - make move
      } else {
        updatedState.placingMultipleCardsLaneIndex = null;
      }

      return updatedState;
    });

    ctx.patchState({
      placingMultipleCardsLaneIndex: null,
    });
  }

  @Selector()
  static placingMultipleCardsLaneIndex(state: GameStateModel) {
    return state.placingMultipleCardsLaneIndex;
  }
}
