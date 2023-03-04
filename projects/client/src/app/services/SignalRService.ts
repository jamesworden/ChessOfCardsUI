import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  DrawOffered,
  FinishPlacingMultipleCards,
  SetGameOverData,
  ResetGameCode,
  SetGameCode,
  UpdateGameState,
  SetOpponentPassedMove,
} from '../actions/game.actions';
import { CardModel } from '../models/card.model';
import { MoveModel } from '../models/move.model';
import { PlayerGameStateModel } from '../models/player-game-state-model';
import { environment } from '../../environments/environment';
import { UpdateView } from '../actions/view.actions';
import { View } from '../views';
import { SetIsConnectedToServer } from '../actions/server.actions';

const { serverUrl } = environment;

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: HubConnection;

  public gameCodeIsInvalid$ = new Subject<boolean>();

  constructor(private store: Store) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${serverUrl}/game`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.startConnection();
    this.registerConnectionEvents();
    this.registerServerEvents();
  }

  public startConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection.start().then(
      () => {
        console.log('Connected to server.');
        this.store.dispatch(new SetIsConnectedToServer(true));
      },
      () => {
        console.error('Unable to connect to server.');
        this.store.dispatch(new SetIsConnectedToServer(false));
      }
    );
  }

  private registerConnectionEvents() {
    this.hubConnection.onreconnecting(() => {
      this.store.dispatch(new SetIsConnectedToServer(false));
    });

    this.hubConnection.onreconnected(() => {
      this.store.dispatch(new SetIsConnectedToServer(true));
    });
  }

  private registerServerEvents(): void {
    this.hubConnection.on('CreatedPendingGame', (gameCode: string) => {
      this.store.dispatch(new SetGameCode(gameCode));
    });

    this.hubConnection.on('OpponentDisconnected', () => {
      this.store.dispatch(new ResetGameCode());
    });

    this.hubConnection.on('InvalidGameCode', () => {
      this.gameCodeIsInvalid$.next(true);
    });

    this.hubConnection.on('GameStarted', (stringifiedGameState) => {
      this.parseAndUpdateGameState(stringifiedGameState);
      this.store.dispatch(new UpdateView(View.Game));
    });

    this.hubConnection.on('GameOver', (message?: string) => {
      this.store.dispatch(
        new SetGameOverData({
          isOver: true,
          message,
        })
      );
    });

    this.hubConnection.on('GameUpdated', (stringifiedGameState) => {
      this.store.dispatch(new FinishPlacingMultipleCards());
      this.parseAndUpdateGameState(stringifiedGameState);
    });

    this.hubConnection.on('PassedMove', (stringifiedGameState) => {
      const gameState = this.parseAndUpdateGameState(stringifiedGameState);

      const hostAndHostTurn = gameState.IsHostPlayersTurn && gameState.IsHost;
      const guestAndGuestTurn =
        !gameState.IsHostPlayersTurn && !gameState.IsHost;
      const isPlayersTurn = hostAndHostTurn || guestAndGuestTurn;

      if (isPlayersTurn) {
        this.store.dispatch(new SetOpponentPassedMove(true));
      }
    });

    this.hubConnection.on('DrawOffered', () => {
      this.store.dispatch(new DrawOffered());
    });
  }

  private parseAndUpdateGameState(stringifiedGameState: string) {
    const playerGameState: PlayerGameStateModel =
      JSON.parse(stringifiedGameState);
    console.log(playerGameState);
    this.store.dispatch(new UpdateGameState(playerGameState));

    return playerGameState;
  }

  public createGame() {
    this.hubConnection.invoke('CreateGame');
  }

  public joinGame(gameCode: string) {
    this.hubConnection.invoke('JoinGame', gameCode);
  }

  public rearrangeHand(cards: CardModel[]) {
    const stringifiedCards = JSON.stringify(cards);
    this.hubConnection.invoke('RearrangeHand', stringifiedCards);
  }

  public makeMove(move: MoveModel) {
    const stringifiedMove = JSON.stringify(move);
    this.hubConnection.invoke('MakeMove', stringifiedMove);
  }

  public passMove() {
    this.hubConnection.invoke('PassMove');
  }

  public offerDraw() {
    this.hubConnection.invoke('OfferDraw');
  }

  public denyDrawOffer() {
    console.log('Deny Draw Offer');
    // this.hubConnection.invoke('DenyDrawOffer');
  }

  public acceptDrawOffer() {
    console.log('Accept Draw Offer');
    // this.hubConnection.invoke('DenyDrawOffer');
  }
}
