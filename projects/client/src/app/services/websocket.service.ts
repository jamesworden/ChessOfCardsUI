import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { Store } from '@ngxs/store';
import {
  DrawOffered,
  FinishPlacingMultipleCards,
  SetGameOverData,
  SetOpponentPassedMove,
  SetGameCodeIsInvalid,
  SetPendingGameView,
  ResetPendingGameView,
  AnimateGameView,
} from '../actions/game.actions';
import { Card } from '../models/card.model';
import { Move } from '../models/move.model';
import { PlayerGameView } from '../models/player-game-view.model';
import { environment } from '../../environments/environment';
import { UpdateView } from '../actions/view.actions';
import { View } from '../views';
import { SetIsConnectedToServer } from '../actions/server.actions';
import { DurationOption } from '../models/duration-option.model';
import { PendingGameView } from '../models/pending-game-view.model';

const { serverUrl } = environment;

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private hubConnection: HubConnection;

  readonly #store = inject(Store);

  constructor() {
    this.initConnection();
    this.connectToServer();
    this.registerConnectionEvents();
    this.registerServerEvents();
  }

  private initConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${serverUrl}/game`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  public connectToServer() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection.start().then(
      () => {
        console.log('Connected to server.');
        this.#store.dispatch(new SetIsConnectedToServer(true));
      },
      () => {
        console.error('Unable to connect to server.');
        this.#store.dispatch(new SetIsConnectedToServer(false));
      }
    );
  }

  private registerConnectionEvents() {
    this.hubConnection.onreconnecting(() => {
      this.#store.dispatch(new SetIsConnectedToServer(false));
    });

    this.hubConnection.onreconnected(() => {
      this.#store.dispatch(new SetIsConnectedToServer(true));
    });
  }

  private registerServerEvents(): void {
    this.hubConnection.on(
      'CreatedPendingGame',
      (stringifiedPendingGameView: string) => {
        const pendingGameView: PendingGameView = JSON.parse(
          stringifiedPendingGameView
        );
        this.#store.dispatch(new SetPendingGameView(pendingGameView));
      }
    );

    this.hubConnection.on(
      'PendingGameUpdated',
      (stringifiedPendingGameView: string) => {
        const pendingGameView: PendingGameView = JSON.parse(
          stringifiedPendingGameView
        );
        this.#store.dispatch(new SetPendingGameView(pendingGameView));
      }
    );

    this.hubConnection.on('OpponentDisconnected', () => {
      this.#store.dispatch(new ResetPendingGameView());
    });

    this.hubConnection.on('InvalidGameCode', () => {
      this.#store.dispatch(new SetGameCodeIsInvalid(true));
    });

    this.hubConnection.on('GameStarted', (stringifiedGameState) => {
      this.parseAndUpdateGameView(stringifiedGameState);
      this.#store.dispatch(new UpdateView(View.Game));
    });

    this.hubConnection.on('GameOver', (message?: string) => {
      this.#store.dispatch(
        new SetGameOverData({
          isOver: true,
          message,
        })
      );
    });

    this.hubConnection.on('GameUpdated', (stringifiedGameState) => {
      this.#store.dispatch(new FinishPlacingMultipleCards());
      this.parseAndUpdateGameView(stringifiedGameState);
    });

    this.hubConnection.on('PassedMove', (stringifiedGameState) => {
      const gameState = this.parseAndUpdateGameView(stringifiedGameState);
      const isPlayersTurn = this.isPlayersTurn(gameState);

      if (isPlayersTurn) {
        this.#store.dispatch(new SetOpponentPassedMove(true));
      }
    });

    this.hubConnection.on('DrawOffered', () => {
      this.#store.dispatch(new DrawOffered());
    });
  }

  private isPlayersTurn(gameState: PlayerGameView) {
    const hostAndHostTurn = gameState.IsHostPlayersTurn && gameState.IsHost;
    const guestAndGuestTurn = !gameState.IsHostPlayersTurn && !gameState.IsHost;
    return hostAndHostTurn || guestAndGuestTurn;
  }

  private parseAndUpdateGameView(stringifiedGameState: string) {
    let playerGameView: PlayerGameView = JSON.parse(stringifiedGameState);
    console.log(playerGameView);
    this.#store.dispatch(new AnimateGameView(playerGameView));

    return playerGameView;
  }

  public createGame() {
    this.hubConnection.invoke('CreateGame');
  }

  public joinGame(gameCode: string) {
    this.hubConnection.invoke('JoinGame', gameCode);
  }

  public rearrangeHand(cards: Card[]) {
    const stringifiedCards = JSON.stringify(cards);
    this.hubConnection.invoke('RearrangeHand', stringifiedCards);
  }

  public makeMove(move: Move) {
    const stringifiedMove = JSON.stringify(move);
    this.hubConnection.invoke('MakeMove', stringifiedMove);
  }

  public passMove() {
    this.hubConnection.invoke('PassMove');
  }

  public offerDraw() {
    this.hubConnection.invoke('OfferDraw');
  }

  public acceptDrawOffer() {
    this.hubConnection.invoke('AcceptDrawOffer');
  }

  public resignGame() {
    this.hubConnection.invoke('ResignGame');
  }

  public selectDurationOption(durationOption: DurationOption) {
    this.hubConnection.invoke('SelectDurationOption', durationOption);
  }

  public checkHostForEmptyTimer() {
    this.hubConnection.invoke('CheckHostForEmptyTimer');
  }

  public checkGuestForEmptyTimer() {
    this.hubConnection.invoke('CheckGuestForEmptyTimer');
  }
}
