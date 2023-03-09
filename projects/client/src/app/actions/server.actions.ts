export class SetIsConnectedToServer {
  static readonly type = '[ServerState] Set Is Connected To Server';
  constructor(public isConnectedToServer: boolean) {}
}

export class ConnectToServer {
  static readonly type = '[ServerState] Connect To Server';
}
