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
  FinishPlacingMultipleCards,
  UpdateGameState,
} from '../actions/game.actions';
import { CardModel } from '../models/card.model';
import { MoveModel } from '../models/move.model';
import { PlayerGameStateModel } from '../models/player-game-state-model';
import { environment } from '../../environments/environment';
import { UpdateView } from '../actions/view.actions';
import { View } from '../views';

const { serverUrl } = environment;

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection: HubConnection;

  public isConnectedToServer$ = new BehaviorSubject<boolean>(false);
  public gameCode$ = new BehaviorSubject<string>('');
  public gameCodeIsInvalid$ = new Subject<boolean>();
  public opponentPassedMove$ = new Subject();
  public gameOverMessage$ = new Subject<string | null>();

  constructor(private store: Store) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${serverUrl}/game`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.startConnection();
    this.registerOnServerEvents();
  }

  public startConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection.start().then(
      () => {
        console.log('Hub connection started.');
        this.isConnectedToServer$.next(true);
      },
      (error) => console.error(error)
    );
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('CreatedPendingGame', (gameCode: string) => {
      this.gameCode$.next(gameCode);
    });

    this.hubConnection.on('OpponentDisconnected', () => {
      this.gameCode$.next('');
    });

    this.hubConnection.on('InvalidGameCode', () => {
      this.gameCodeIsInvalid$.next(true);
    });

    this.hubConnection.on('GameStarted', (stringifiedGameState) => {
      this.parseAndUpdateGameState(stringifiedGameState);
      this.store.dispatch(new UpdateView(View.Game));
    });

    this.hubConnection.on('GameOver', (message) => {
      this.gameOverMessage$.next(message);
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
        this.opponentPassedMove$.next();
      }
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
}
