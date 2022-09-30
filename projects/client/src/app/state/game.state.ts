import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GameOver, UpdateGameState } from '../actions/game.actions';
import { PlayerGameStateModel } from '../models/player-game-state-model';

type GameStateModel = {
  gameData: PlayerGameStateModel;
  gameOverMessage: string;
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
}
