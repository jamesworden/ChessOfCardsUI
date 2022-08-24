import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UpdateGameState } from '../actions/player-game-state.actions';
import { PlayerGameStateModel } from '../models/player-game-state-model';

@State<PlayerGameStateModel>({
  name: 'playerGameState',
})
@Injectable()
export class PlayerGameState {
  @Action(UpdateGameState)
  updateGameState(
    ctx: StateContext<PlayerGameStateModel>,
    action: UpdateGameState
  ) {
    ctx.setState((state) => {
      state = action.playerGameState;
      return state;
    });
  }

  @Selector()
  static state(state: PlayerGameStateModel) {
    return state;
  }
}
