import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { View } from '../views';
import { UpdateView } from '../actions/view.actions';

type ViewStateModel = {
  currentView: View;
};

@State<ViewStateModel>({
  name: 'viewState',
})
@Injectable()
export class ViewState {
  @Selector()
  static currentView(state: ViewStateModel) {
    return state.currentView;
  }

  @Action(UpdateView)
  updateView(ctx: StateContext<ViewStateModel>, action: UpdateView) {
    ctx.patchState({
      currentView: action.view,
    });
  }
}
