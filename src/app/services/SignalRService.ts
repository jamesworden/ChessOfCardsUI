import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { emptyGameState } from '../constants/empty-game-state';
import { PlayerGameState } from '../models/player-game-state';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  connectionEstablished$ = new BehaviorSubject<boolean>(false);
  gameCode$ = new BehaviorSubject<string>('');
  invalidGameCode$ = new Subject<boolean>();
  gameStarted$ = new Subject<null>();
  gameOverMessage$ = new BehaviorSubject<string>('');
  playerGameState$ = new BehaviorSubject<PlayerGameState>(emptyGameState);

  private hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7192/' + 'game')
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.startConnection();
    this.registerOnServerEvents();
  }

  private startConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection.start().then(
      () => {
        console.log('Hub connection started!');
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
      const playerGameState: PlayerGameState = JSON.parse(stringifiedGameState);
      this.playerGameState$.next(playerGameState);
    });

    this.hubConnection.on('GameOver', (message) => {
      this.gameOverMessage$.next(message);
    });
  }

  public createGame() {
    this.hubConnection.invoke('CreateGame');
  }

  public joinGame(gameCode: string) {
    this.gameCode$.next(gameCode);
    this.hubConnection.invoke('JoinGame', gameCode);
  }
}
