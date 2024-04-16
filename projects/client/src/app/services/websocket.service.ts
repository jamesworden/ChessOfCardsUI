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
  SetGameIsActive,
} from '../actions/game.actions';
import { environment } from '../../environments/environment';
import { SetIsConnectedToServer } from '../actions/server.actions';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Card,
  DurationOption,
  Move,
  PendingGameView,
  PlayerGameView,
} from '@shared/models';
import { isPlayersTurn } from '@shared/logic';

const { serverUrl } = environment;

enum MessageType {
  CreatedPendingGame = 'CreatedPendingGame',
  PendingGameUpdated = 'PendingGameUpdated',
  OpponentDisconnected = 'OpponentDisconnected',
  InvalidGameCode = 'InvalidGameCode',
  GameStarted = 'GameStarted',
  GameOver = 'GameOver',
  GameUpdated = 'GameUpdated',
  PassedMove = 'PassedMove',
  DrawOffered = 'DrawOffered',
  CreateGame = 'CreateGame',
  JoinGame = 'JoinGame',
  RearrangeHand = 'RearrangeHand',
  MakeMove = 'MakeMove',
  PassMove = 'PassMove',
  OfferDraw = 'OfferDraw',
  AcceptDrawOffer = 'AcceptDrawOffer',
  ResignGame = 'ResignGame',
  SelectDurationOption = 'SelectDurationOption',
  CheckHostForEmptyTimer = 'CheckHostForEmptyTimer',
  CheckGuestForEmptyTimer = 'CheckGuestForEmptyTimer',
  TurnSkippedNoMoves = 'TurnSkippedNoMoves',
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private hubConnection: HubConnection;

  readonly #snackBar = inject(MatSnackBar);
  readonly #store = inject(Store);
  readonly #router = inject(Router);

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
      MessageType.CreatedPendingGame,
      (stringifiedPendingGameView: string) => {
        const pendingGameView: PendingGameView = JSON.parse(
          stringifiedPendingGameView
        );
        this.#store.dispatch(new SetPendingGameView(pendingGameView));
      }
    );

    this.hubConnection.on(
      MessageType.PendingGameUpdated,
      (stringifiedPendingGameView: string) => {
        const pendingGameView: PendingGameView = JSON.parse(
          stringifiedPendingGameView
        );
        this.#store.dispatch(new SetPendingGameView(pendingGameView));
      }
    );

    this.hubConnection.on(MessageType.OpponentDisconnected, () => {
      this.#store.dispatch(new ResetPendingGameView());
    });

    this.hubConnection.on(MessageType.InvalidGameCode, () => {
      this.#store.dispatch(new SetGameCodeIsInvalid(true));
    });

    this.hubConnection.on(MessageType.GameStarted, (stringifiedGameState) => {
      this.#store.dispatch(new SetGameIsActive(true));
      const playerGameView = this.parseAndUpdateGameView(stringifiedGameState);
      this.#router.navigate(['game']);

      const secondaryText = isPlayersTurn(playerGameView)
        ? "It's your turn!"
        : "It's your opponent's turn!";

      this.#snackBar.open('Game started.', secondaryText, {
        duration: 5000,
        verticalPosition: 'top',
      });
    });

    this.hubConnection.on(MessageType.GameOver, (message?: string) => {
      this.#store.dispatch(
        new SetGameOverData({
          isOver: true,
          message,
        })
      );
    });

    this.hubConnection.on(MessageType.GameUpdated, (stringifiedGameState) => {
      this.#store.dispatch(new FinishPlacingMultipleCards(false));
      this.parseAndUpdateGameView(stringifiedGameState);
    });

    this.hubConnection.on(MessageType.PassedMove, (stringifiedGameState) => {
      const gameState = this.parseAndUpdateGameView(stringifiedGameState);
      const isPlayersTurn = this.isPlayersTurn(gameState);

      if (isPlayersTurn) {
        this.#store.dispatch(new SetOpponentPassedMove(true));
      }
    });

    this.hubConnection.on(MessageType.DrawOffered, () => {
      this.#store.dispatch(new DrawOffered());
    });

    this.hubConnection.on(MessageType.TurnSkippedNoMoves, () => {
      this.#snackBar.open('You have no available moves!', 'Turn skipped.', {
        duration: 5000,
        verticalPosition: 'top',
      });
    });
  }

  public createGame() {
    this.hubConnection.invoke(MessageType.CreateGame);
  }

  public joinGame(gameCode: string) {
    this.hubConnection.invoke(MessageType.JoinGame, gameCode);
  }

  public rearrangeHand(cards: Card[]) {
    const stringifiedCards = JSON.stringify(cards);
    this.hubConnection.invoke(MessageType.RearrangeHand, stringifiedCards);
  }

  public makeMove(move: Move, rearrangedCardsInHand?: Card[]) {
    const stringifiedMove = JSON.stringify(move);
    const stringifiedRearrangedCardsInHand = rearrangedCardsInHand
      ? JSON.stringify(rearrangedCardsInHand)
      : null;
    this.hubConnection.invoke(
      MessageType.MakeMove,
      stringifiedMove,
      stringifiedRearrangedCardsInHand
    );
  }

  public passMove() {
    this.hubConnection.invoke(MessageType.PassMove);
  }

  public offerDraw() {
    this.hubConnection.invoke(MessageType.OfferDraw);
  }

  public acceptDrawOffer() {
    this.hubConnection.invoke(MessageType.AcceptDrawOffer);
  }

  public resignGame() {
    this.hubConnection.invoke(MessageType.ResignGame);
  }

  public selectDurationOption(durationOption: DurationOption) {
    this.hubConnection.invoke(MessageType.SelectDurationOption, durationOption);
  }

  public checkHostForEmptyTimer() {
    this.hubConnection.invoke(MessageType.CheckHostForEmptyTimer);
  }

  public checkGuestForEmptyTimer() {
    this.hubConnection.invoke(MessageType.CheckGuestForEmptyTimer);
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
}
