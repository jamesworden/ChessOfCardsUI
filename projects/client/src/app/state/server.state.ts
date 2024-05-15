import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  ConnectToServer,
  SetIsConnectedToServer,
} from '../actions/server.actions';
import { WebsocketService } from '../services/websocket.service';

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

  constructor(private websocketService: WebsocketService) {}

  @Action(SetIsConnectedToServer)
  setIsConnectedToServer(
    ctx: StateContext<ServerStateModel>,
    action: SetIsConnectedToServer
  ) {
    ctx.patchState({
      isConnectedToServer: action.isConnectedToServer,
    });
  }

  @Action(ConnectToServer)
  connectToServer() {
    this.websocketService.connectToServer();
  }
}
