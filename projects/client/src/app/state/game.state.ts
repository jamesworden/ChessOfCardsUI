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
  placingMultipleCards: boolean;
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
      updatedState.placingMultipleCards = false;
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
    _: StartPlacingMultipleCards
  ) {
    ctx.setState((state) => {
      const updatedState: GameStateModel = { ...state };

      updatedState.placingMultipleCards = true;
      return updatedState;
    });

    ctx.patchState({
      placingMultipleCards: true,
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
        updatedState.placingMultipleCards = false;
      }

      return updatedState;
    });

    ctx.patchState({
      placingMultipleCards: false,
    });
  }

  @Selector()
  static placingMultipleCards(state: GameStateModel) {
    return state.placingMultipleCards;
  }
}
