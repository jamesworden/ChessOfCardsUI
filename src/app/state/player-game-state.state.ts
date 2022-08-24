import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UpdateGameState } from '../actions/player-game-state.actions';
import { PlayerGameStateModel } from '../models/player-game-state-model';

const defaultPlayerGameState: PlayerGameStateModel = {
  Hand: {
    Cards: [],
  },
  Lanes: [],
  NumCardsInOpponentsDeck: 21,
  NumCardsInOpponentsHand: 5,
  NumCardsInPlayersDeck: 21,
};

@State<PlayerGameStateModel>({
  name: 'playerGameState',
  defaults: defaultPlayerGameState,
})
@Injectable()
export class PlayerGameState {
  @Action(UpdateGameState)
  updateGameState(ctx: StateContext<PlayerGameStateModel>) {
    const state = ctx.getState();
    ctx.setState(state);
  }

  @Selector()
  static state(state: PlayerGameStateModel) {
    return state;
  }
}
