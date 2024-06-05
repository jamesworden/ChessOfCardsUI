import { Injectable, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
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
  UpdatePlayerGameView,
  SetIsConnectedToServer,
  SetNameIsInvalid,
} from '../state/game.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Card,
  DurationOption,
  Environment,
  Move,
  PendingGameOptions,
  PendingGameView,
  PlayerGameView,
} from '@shared/models';
import { isPlayersTurn } from '@shared/logic';
import { JoinPendingGameOptions } from 'shared/lib/models/lib/join-pending-game-options.model';

enum MessageType {
  CreatedPendingGame = 'CreatedPendingGame',
  PendingGameUpdated = 'PendingGameUpdated',
  InvalidGameCode = 'InvalidGameCode',
  GameStarted = 'GameStarted',
  GameOver = 'GameOver',
  GameUpdated = 'GameUpdated',
  PassedMove = 'PassedMove',
  DrawOffered = 'DrawOffered',
  CreatePendingGame = 'CreatePendingGame',
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
  SendChatMessage = 'SendChatMessage',
  NewChatMessage = 'NewChatMessage',
  DeletePendingGame = 'DeletePendingGame',
  InvalidName = 'InvalidName',
  OpponentReconnected = 'OpponentReconnected',
  OpponentDisconnected = 'OpponentDisconnected',
  Reconnected = 'Reconnected',
}

@Injectable({
  providedIn: 'root',
})
export class GameWebsocketService {
  private hubConnection: HubConnection;

  readonly #matSnackBar = inject(MatSnackBar);
  readonly #store = inject(Store);

  public connectToServer(environment: Environment) {
    this.initConnection(environment);
    this.connectAndRegisterEvents();
    this.registerServerEvents();
  }

  private initConnection(environment: Environment) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.serverUrl}/game`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  private connectAndRegisterEvents() {
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

      const message = isPlayersTurn(playerGameView)
        ? "It's your turn."
        : "It's your opponent's turn.";

      this.#matSnackBar.open(message, 'Hide', {
        duration: 3000,
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
      if (isPlayersTurn(gameState)) {
        this.#store.dispatch(new SetOpponentPassedMove(true));
      }
    });

    this.hubConnection.on(MessageType.DrawOffered, () => {
      this.#store.dispatch(new DrawOffered());
    });

    this.hubConnection.on(MessageType.TurnSkippedNoMoves, () => {
      this.#matSnackBar.open(
        'You have no available moves. Turn skipped.',
        'Hide',
        {
          duration: 3000,
          verticalPosition: 'top',
        }
      );
    });

    this.hubConnection.on(
      MessageType.NewChatMessage,
      (stringifiedPlayerGameView) => {
        const playerGameView = JSON.parse(
          stringifiedPlayerGameView
        ) as PlayerGameView;
        this.#store.dispatch(new UpdatePlayerGameView(playerGameView));
      }
    );

    this.hubConnection.on(MessageType.InvalidName, () => {
      this.#store.dispatch(new SetNameIsInvalid(true));
    });

    this.hubConnection.on(MessageType.OpponentDisconnected, () => {
      // TODO: Update new state property and reflect in UI somehow
      this.#matSnackBar.open('Opponent Disconnected', 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
    });

    this.hubConnection.on(MessageType.OpponentReconnected, () => {
      // TODO: Update new state property and reflect in UI somehow
      this.#matSnackBar.open('Opponent Reconnected', 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
    });

    this.hubConnection.on(MessageType.Reconnected, (stringifiedGameState) => {
      this.#store.dispatch(new SetGameIsActive(true));
      const playerGameView = this.parseAndUpdateGameView(stringifiedGameState);

      const message = isPlayersTurn(playerGameView)
        ? "Reconnected. It's your turn."
        : "Reconnected. It's your opponent's turn.";

      this.#matSnackBar.open(message, 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
    });
  }

  public createPendingGame(pendingGameOptions?: PendingGameOptions) {
    const stringifiedOptions = pendingGameOptions
      ? JSON.stringify(pendingGameOptions)
      : undefined;
    this.hubConnection.invoke(
      MessageType.CreatePendingGame,
      stringifiedOptions
    );
  }

  public joinGame(
    gameCode: string,
    joinPendingGameOptions?: JoinPendingGameOptions
  ) {
    const stringifiedOptions = joinPendingGameOptions
      ? JSON.stringify(joinPendingGameOptions)
      : undefined;
    this.hubConnection.invoke(
      MessageType.JoinGame,
      gameCode,
      stringifiedOptions
    );
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

  public sendChatMessage(message: string) {
    this.hubConnection.invoke(MessageType.SendChatMessage, message);
  }

  public deletePendingGame() {
    this.hubConnection.invoke(MessageType.DeletePendingGame);
  }

  private parseAndUpdateGameView(stringifiedGameState: string) {
    let playerGameView: PlayerGameView = JSON.parse(stringifiedGameState);
    console.log(playerGameView);
    this.#store.dispatch(new AnimateGameView(playerGameView));

    return playerGameView;
  }
}
