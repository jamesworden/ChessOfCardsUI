import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  DrawOffered,
  FinishPlacingMultipleCards,
  SetGameOverData,
  SetGameCodeIsInvalid,
  SetPendingGameView,
  AnimateGameView,
  SetGameIsActive,
  SetIsConnectedToServer,
  SetNameIsInvalid,
  SetOpponentIsDisconnected,
  UpdatePlayerGameView,
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
  // Server-to-Client messages
  CreatedPendingGame = 'CreatedPendingGame',
  GameStarted = 'GameStarted',
  GameUpdated = 'GameUpdated',
  GameOver = 'GameOver',
  OpponentDisconnected = 'OpponentDisconnected',
  OpponentReconnected = 'OpponentReconnected',
  PlayerReconnected = 'PlayerReconnected',
  ChatMessageSent = 'ChatMessageSent',
  DrawOffered = 'DrawOffered',
  TurnSkipped = 'TurnSkipped',
  JoinGameCodeInvalid = 'JoinGameCodeInvalid',
  GameNameInvalid = 'GameNameInvalid',
  LatestReadChatMessageMarked = 'LatestReadChatMessageMarked',
  Error = 'Error',
  Connected = 'Connected',

  // Client-to-Server actions
  CreatePendingGame = 'createPendingGame',
  JoinGame = 'joinGame',
  RearrangeHand = 'rearrangeHand',
  MakeMove = 'makeMove',
  PassMove = 'passMove',
  OfferDraw = 'offerDraw',
  AcceptDrawOffer = 'acceptDrawOffer',
  ResignGame = 'resignGame',
  SelectDurationOption = 'selectDurationOption',
  SendChatMessage = 'sendChatMessage',
  DeletePendingGame = 'deletePendingGame',
  MarkLatestReadChatMessage = 'markLatestReadChatMessage',
}

interface WebSocketMessage {
  type: string;
  data?: any;
}

interface ActionRequest {
  action: string;
  data?: any;
}

// TODO: Cleanup: Call disconnect() when the component/service is destroyed to properly close the connection

// TODO: Organize models into files

// TODO: Ensure we have explicit data types from backend to frontend.

@Injectable({
  providedIn: 'root',
})
export class GameWebsocketService {
  private webSocket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimeout: any = null;
  private messageQueue: ActionRequest[] = [];
  private isConnected = false;

  readonly #matSnackBar = inject(MatSnackBar);
  readonly #store = inject(Store);

  public connectToServer(environment: Environment) {
    const wsUrl = environment.serverUrl.replace(/^http/, 'ws');
    this.initConnection(wsUrl);
  }

  private initConnection(wsUrl: string) {
    if (this.webSocket) {
      this.webSocket.close();
    }

    try {
      this.webSocket = new WebSocket(wsUrl);
      this.registerWebSocketEvents();
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.handleReconnect(wsUrl);
    }
  }

  private registerWebSocketEvents() {
    if (!this.webSocket) return;

    this.webSocket.onopen = () => {
      console.log('Connected to WebSocket server.');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.#store.dispatch(new SetIsConnectedToServer(true));

      // Process queued messages
      this.processMessageQueue();
    };

    this.webSocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      this.isConnected = false;
      this.#store.dispatch(new SetIsConnectedToServer(false));

      // Attempt to reconnect if not closed intentionally
      if (!event.wasClean) {
        const wsUrl = this.webSocket?.url;
        if (wsUrl) {
          this.handleReconnect(wsUrl);
        }
      }
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.#store.dispatch(new SetIsConnectedToServer(false));
    };

    this.webSocket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleServerMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  private handleReconnect(wsUrl: string) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached.');
      this.#matSnackBar.open(
        'Unable to connect to server. Please refresh the page.',
        'Dismiss',
        { duration: 0, verticalPosition: 'top' }
      );
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(
      `Attempting to reconnect in ${delay}ms... (attempt ${this.reconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.initConnection(wsUrl);
    }, delay);
  }

  private handleServerMessage(message: WebSocketMessage) {
    const { type, data } = message;

    switch (type) {
      case MessageType.Connected:
        console.log('Connection acknowledged by server');
        break;

      case MessageType.CreatedPendingGame:
        this.#store.dispatch(new SetPendingGameView(data as PendingGameView));
        break;

      case MessageType.JoinGameCodeInvalid:
        this.#store.dispatch(new SetGameCodeIsInvalid(true));
        break;

      case MessageType.GameNameInvalid:
        this.#store.dispatch(new SetNameIsInvalid(true));
        break;

      case MessageType.GameStarted:
        const gameView = data as PlayerGameView;
        this.#store.dispatch(new SetGameIsActive(true));
        this.#store.dispatch(new AnimateGameView(gameView));

        const message = isPlayersTurn(gameView)
          ? "It's your turn."
          : "It's your opponent's turn.";

        this.#matSnackBar.open(message, 'Hide', {
          duration: 3000,
          verticalPosition: 'top',
        });
        break;

      case MessageType.GameOver:
        const playerView = data?.gameView as PlayerGameView;
        const gameOverReason = data?.reason as GameOverReason;
        this.#store.dispatch(new AnimateGameView(playerView));
        this.#store.dispatch(
          new SetGameOverData({
            isOver: true,
            message: getGameOverMessage(
              gameOverReason,
              playerView.isHost,
              playerView.wonBy
            ),
          })
        );
        break;

      case MessageType.GameUpdated:
        this.#store.dispatch(new FinishPlacingMultipleCards(false));
        this.#store.dispatch(new AnimateGameView(data as PlayerGameView));
        break;

      case MessageType.OpponentDisconnected:
        this.#store.dispatch(new SetOpponentIsDisconnected(true));
        break;

      case MessageType.OpponentReconnected:
        this.#store.dispatch(new SetOpponentIsDisconnected(false));
        break;

      case MessageType.PlayerReconnected:
        const reconnectedView = data?.gameView as PlayerGameView;
        this.#store.dispatch(new SetGameIsActive(true));
        this.#store.dispatch(new AnimateGameView(reconnectedView));

        const reconnectMessage = isPlayersTurn(reconnectedView)
          ? "Reconnected. It's your turn."
          : "Reconnected. It's your opponent's turn.";

        this.#matSnackBar.open(reconnectMessage, 'Hide', {
          duration: 3000,
          verticalPosition: 'top',
        });
        break;

      case MessageType.DrawOffered:
        this.#store.dispatch(new DrawOffered());
        break;

      case MessageType.TurnSkipped:
        this.#matSnackBar.open(
          'You have no available moves. Turn skipped.',
          'Hide',
          {
            duration: 3000,
            verticalPosition: 'top',
          }
        );
        break;

      case MessageType.ChatMessageSent:
        this.#store.dispatch(
          new UpdatePlayerGameView(data?.gameView as PlayerGameView)
        );
        break;

      case MessageType.LatestReadChatMessageMarked:
        this.#store.dispatch(
          new UpdatePlayerGameView(data?.gameView as PlayerGameView)
        );
        break;

      case MessageType.Error:
        console.error('Server error:', data);
        this.#matSnackBar.open(data?.error || 'An error occurred', 'Dismiss', {
          duration: 5000,
          verticalPosition: 'top',
        });
        break;

      default:
        console.warn('Unknown message type:', type, data);
    }
  }

  private sendAction(action: string, data?: any) {
    const actionRequest: ActionRequest = {
      action,
      ...(data && { data }),
    };

    if (
      !this.isConnected ||
      !this.webSocket ||
      this.webSocket.readyState !== WebSocket.OPEN
    ) {
      console.warn('WebSocket not connected. Queueing message:', actionRequest);
      this.messageQueue.push(actionRequest);
      return;
    }

    try {
      this.webSocket.send(JSON.stringify(actionRequest));
    } catch (error) {
      console.error('Failed to send message:', error);
      this.messageQueue.push(actionRequest);
    }
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendAction(message.action, message.data);
      }
    }
  }

  public createPendingGame(pendingGameOptions: PendingGameOptions) {
    this.sendAction(MessageType.CreatePendingGame, {
      hostName: 'Test Host Name', // joinGameOptions.playerName
      durationOption: pendingGameOptions.durationOption,
    });
  }

  public joinGame(joinGameOptions: JoinGameOptions) {
    this.sendAction(MessageType.JoinGame, {
      gameCode: joinGameOptions.gameCode,
      guestName: 'Test Guest Name', // joinGameOptions.playerName
    });
  }

  public rearrangeHand(cards: Card[]) {
    this.sendAction(MessageType.RearrangeHand, {
      cards,
    });
  }

  public makeMove(move: Move, rearrangedCardsInHand?: Card[]) {
    this.sendAction(MessageType.MakeMove, {
      move,
      rearrangedCardsInHand,
    });
  }

  public passMove() {
    this.sendAction(MessageType.PassMove);
  }

  public offerDraw() {
    this.sendAction(MessageType.OfferDraw);
  }

  public acceptDrawOffer() {
    this.sendAction(MessageType.AcceptDrawOffer);
  }

  public resignGame() {
    this.sendAction(MessageType.ResignGame);
  }

  public selectDurationOption(durationOption: DurationOption) {
    this.sendAction(MessageType.SelectDurationOption, { durationOption });
  }

  public sendChatMessage(rawMessage: string) {
    this.sendAction(MessageType.SendChatMessage, {
      rawMessage,
    });
  }

  public deletePendingGame() {
    this.sendAction(MessageType.DeletePendingGame);
  }

  public markLatestReadChatMessage(latestIndex: number) {
    this.sendAction(MessageType.MarkLatestReadChatMessage, {
      latestIndex,
    });
  }

  public disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = null;
    }

    this.isConnected = false;
    this.messageQueue = [];
  }
}
