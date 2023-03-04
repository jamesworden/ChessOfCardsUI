import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SetIsConnectedToServer } from '../actions/server.actions';

type ServerStateModel = {
  isConnectedToServer: boolean;
};

const initialServerState: ServerStateModel = {
  isConnectedToServer: false,
};

@State<ServerStateModel>({
  name: 'serverState',
  defaults: initialServerState,
})
@Injectable()
export class ServerState {
  @Selector()
  static isConnectedToServer(state: ServerStateModel) {
    return state.isConnectedToServer;
  }

  constructor(private store: Store) {}

  @Action(SetIsConnectedToServer)
  setIsConnectedToServer(
    ctx: StateContext<ServerStateModel>,
    action: SetIsConnectedToServer
  ) {
    ctx.patchState({
      isConnectedToServer: action.isConnectedToServer,
    });
  }
}
