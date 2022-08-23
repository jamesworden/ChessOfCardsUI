import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UpdateGameState } from '../actions/player-game-state.actions';
import { PlayerGameState } from '../models/player-game-state';

const defaultPlayerGameState = {
  Hand: {
    Cards: [],
  },
  Lanes: [],
  NumCardsInOpponentsDeck: 21,
  NumCardsInOpponentsHand: 5,
  NumCardsInPlayersDeck: 21,
};

@State<PlayerGameState>({
  name: 'playerGameState',
  defaults: defaultPlayerGameState,
})
@Injectable()
export class PlayerGameStateState {
  @Action(UpdateGameState)
  feedAnimals(ctx: StateContext<PlayerGameState>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
    });
  }

  @Selector()
  static state(state: PlayerGameState) {
    return state;
  }
}
