import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ToggleNavbar } from '../actions/navbar.actions';

type NavbarStateModel = {
  isOpen: boolean;
};

@State<NavbarStateModel>({
  name: 'navbarState',
  defaults: {
    isOpen: false,
  },
})
@Injectable()
export class NavbarState {
  @Selector()
  static isOpen(state: NavbarStateModel) {
    return state.isOpen;
  }

  @Action(ToggleNavbar)
  updateView(ctx: StateContext<NavbarStateModel>) {
    ctx.patchState({
      isOpen: !ctx.getState().isOpen,
    });
  }
}
