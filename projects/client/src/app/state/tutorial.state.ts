import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Tutorial } from '../views/tutorial-view';
import { EndTutorial, StartTutorial } from '../actions/tutorial.actions';

type TutorialStateModel = {
  currentTutorial: Tutorial | null;
};

@State<TutorialStateModel>({
  name: 'tutorialState',
  defaults: {
    currentTutorial: null,
  },
})
@Injectable()
export class TutorialState {
  @Selector()
  static currentTutorial(state: TutorialStateModel) {
    return state.currentTutorial;
  }

  @Action(StartTutorial)
  startTutorial(ctx: StateContext<TutorialStateModel>, action: StartTutorial) {
    ctx.patchState({
      currentTutorial: action.tutorial,
    });
  }

  @Action(EndTutorial)
  endTutorial(ctx: StateContext<TutorialStateModel>) {
    ctx.patchState({
      currentTutorial: null,
    });
  }
}
