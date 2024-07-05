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
  AnimateGameView,
  SetGameIsActive,
  UpdatePlayerGameView,
  SetIsConnectedToServer,
  SetNameIsInvalid,
  SetOpponentIsDisconnected,
} from '../state/game.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Card,
  DurationOption,
  Environment,
  GameOverReason,
  Move,
  PendingGameOptions,
  PendingGameView,
  PlayerGameView,
} from '@shared/models';
import { getGameOverMessage, isPlayersTurn } from '@shared/logic';
import { JoinGameOptions } from 'shared/lib/models/lib/join-game-options.model';

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
  TurnSkipped = 'TurnSkipped',
  SendChatMessage = 'SendChatMessage',
  NewChatMessage = 'NewChatMessage',
  DeletePendingGame = 'DeletePendingGame',
  InvalidName = 'InvalidName',
  OpponentReconnected = 'OpponentReconnected',
  OpponentDisconnected = 'OpponentDisconnected',
  PlayerReconnected = 'PlayerReconnected',
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
      (pendingGameView: PendingGameView) => {
        this.#store.dispatch(new SetPendingGameView(pendingGameView));
      }
    );

    // this.hubConnection.on(
    //   MessageType.PendingGameUpdated,
    //   (stringifiedPendingGameView: string) => {
    //     const pendingGameView: PendingGameView = JSON.parse(
    //       stringifiedPendingGameView
    //     );
    //     this.#store.dispatch(new SetPendingGameView(pendingGameView));
    //   }
    // );

    this.hubConnection.on(MessageType.InvalidGameCode, () => {
      this.#store.dispatch(new SetGameCodeIsInvalid(true));
    });

    this.hubConnection.on(
      MessageType.GameStarted,
      (playerGameView: PlayerGameView) => {
        this.#store.dispatch(new SetGameIsActive(true));
        this.#store.dispatch(new AnimateGameView(playerGameView));

        const message = isPlayersTurn(playerGameView)
          ? "It's your turn."
          : "It's your opponent's turn.";

        this.#matSnackBar.open(message, 'Hide', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    );

    this.hubConnection.on(
      MessageType.GameOver,
      (playerGameView: PlayerGameView, gameOverReason: GameOverReason) => {
        this.#store.dispatch(new AnimateGameView(playerGameView));
        this.#store.dispatch(
          new SetGameOverData({
            isOver: true,
            message: getGameOverMessage(
              gameOverReason,
              playerGameView.isHost,
              playerGameView.wonBy
            ),
          })
        );
      }
    );

    this.hubConnection.on(
      MessageType.GameUpdated,
      (playerGameView: PlayerGameView) => {
        this.#store.dispatch(new FinishPlacingMultipleCards(false));
        this.#store.dispatch(new AnimateGameView(playerGameView));
      }
    );

    this.hubConnection.on(
      MessageType.PassedMove,
      (playerGameView: PlayerGameView) => {
        this.#store.dispatch(new AnimateGameView(playerGameView));
        if (isPlayersTurn(playerGameView)) {
          this.#store.dispatch(new SetOpponentPassedMove(true));
        }
      }
    );

    // this.hubConnection.on(MessageType.DrawOffered, () => {
    //   this.#store.dispatch(new DrawOffered());
    // });

    this.hubConnection.on(MessageType.TurnSkipped, () => {
      this.#matSnackBar.open(
        'You have no available moves. Turn skipped.',
        'Hide',
        {
          duration: 3000,
          verticalPosition: 'top',
        }
      );
    });

    // this.hubConnection.on(
    //   MessageType.NewChatMessage,
    //   (stringifiedPlayerGameView) => {
    //     const playerGameView = JSON.parse(
    //       stringifiedPlayerGameView
    //     ) as PlayerGameView;
    //     this.#store.dispatch(new UpdatePlayerGameView(playerGameView));
    //   }
    // );

    this.hubConnection.on(MessageType.InvalidName, () => {
      this.#store.dispatch(new SetNameIsInvalid(true));
    });

    this.hubConnection.on(MessageType.OpponentDisconnected, () => {
      this.#store.dispatch(new SetOpponentIsDisconnected(true));
    });

    this.hubConnection.on(MessageType.OpponentReconnected, () => {
      this.#store.dispatch(new SetOpponentIsDisconnected(false));
    });

    this.hubConnection.on(
      MessageType.PlayerReconnected,
      (playerGameView: PlayerGameView) => {
        this.#store.dispatch(new SetGameIsActive(true));
        this.#store.dispatch(new AnimateGameView(playerGameView));

        const message = isPlayersTurn(playerGameView)
          ? "Reconnected. It's your turn."
          : "Reconnected. It's your opponent's turn.";

        this.#matSnackBar.open(message, 'Hide', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    );
  }

  public createPendingGame(pendingGameOptions: PendingGameOptions) {
    this.hubConnection.invoke(
      MessageType.CreatePendingGame,
      pendingGameOptions
    );
  }

  public joinGame(joinGameOptions: JoinGameOptions) {
    this.hubConnection.invoke(MessageType.JoinGame, joinGameOptions);
  }

  public rearrangeHand(cards: Card[]) {
    this.hubConnection.invoke(MessageType.RearrangeHand, {
      cards,
    });
  }

  public makeMove(move: Move, rearrangedCardsInHand?: Card[]) {
    this.hubConnection.invoke(MessageType.MakeMove, {
      move,
      rearrangedCardsInHand,
    });
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
}
