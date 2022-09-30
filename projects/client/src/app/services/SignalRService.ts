import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { GameOver, UpdateGameState } from '../actions/game.actions';
import { CardModel } from '../models/card.model';
import { MoveModel } from '../models/move.model';
import { PlayerGameStateModel } from '../models/player-game-state-model';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  connectionEstablished$ = new BehaviorSubject<boolean>(false);
  gameCode$ = new BehaviorSubject<string>('');
  invalidGameCode$ = new Subject<boolean>();
  gameStarted$ = new Subject<null>();

  private hubConnection: HubConnection;

  constructor(private store: Store) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7192/' + 'game')
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
        this.connectionEstablished$.next(true);
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
      this.invalidGameCode$.next(true);
    });

    this.hubConnection.on('GameStarted', (stringifiedGameState) => {
      this.gameStarted$.next();
      this.parseAndUpdateGameState(stringifiedGameState);
    });

    this.hubConnection.on('GameOver', (message) => {
      this.store.dispatch(new GameOver(message));
    });

    this.hubConnection.on('GameUpdated', (stringifiedGameState) => {
      this.parseAndUpdateGameState(stringifiedGameState);
    });
  }

  private parseAndUpdateGameState(stringifiedGameState: string) {
    const playerGameState: PlayerGameStateModel =
      JSON.parse(stringifiedGameState);
    console.log(playerGameState);
    this.store.dispatch(new UpdateGameState(playerGameState));
  }

  public createGame() {
    this.hubConnection.invoke('CreateGame');
  }

  public joinGame(gameCode: string) {
    this.gameCode$.next(gameCode);
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
}
