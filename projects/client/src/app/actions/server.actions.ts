export class SetIsConnectedToServer {
  static readonly type = '[ServerState] Set Is Connected To Server';
  constructor(public isConnectedToServer: boolean) {}
}
