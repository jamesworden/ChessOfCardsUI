import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  connectionEstablished$ = new BehaviorSubject<boolean>(false);
  gameCode$ = new Subject<string>();

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
      this.gameCode$.next('Stop');
    });
  }

  public createGame() {
    const test = this.hubConnection.invoke('CreateGame');
    console.log(test);
  }
}
