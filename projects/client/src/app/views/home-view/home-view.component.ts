import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { ResponsiveSizeService } from '@shared/game';
import { WebsocketService } from '../../services/websocket.service';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServerState } from '../../state/server.state';
import { Select, Store } from '@ngxs/store';
import { ConnectToServer } from '../../actions/server.actions';
import {
  CreateGame,
  JoinGame,
  SetGameCodeIsInvalid,
} from '../../actions/game.actions';
import { GameState } from '../../state/game.state';
import { map, withLatestFrom } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { toggleDarkMode } from '../../logic/toggle-dark-mode';
import { fadeInOutAnimation } from '@shared/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
  animations: [fadeInOutAnimation],
})
export class HomeViewComponent implements OnInit {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #websocketService = inject(WebsocketService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #store = inject(Store);
  readonly #router = inject(Router);
  readonly #clipboard = inject(Clipboard);
  readonly #matSnackBar = inject(MatSnackBar);

  @Select(ServerState.isConnectedToServer)
  isConnectedToServer$: Observable<boolean>;

  @Select(GameState.gameCodeIsInvalid)
  gameCodeIsInvalid$!: Observable<boolean>;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  readonly gameCode$ = this.#store
    .select(GameState.pendingGameView)
    .pipe(map((pendingGameView) => pendingGameView?.GameCode));

  gameCodeInput = '';
  isConnectedToServer = false;

  ngOnInit() {
    this.#websocketService.connectToServer();

    this.isConnectedToServer$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        withLatestFrom(this.gameCode$)
      )
      .subscribe(([isConnectedToServer, gameCode]) => {
        this.isConnectedToServer = isConnectedToServer;

        if (isConnectedToServer && !gameCode) {
          this.#store.dispatch(new CreateGame());
        }
      });
  }

  scrollToPlayNow() {
    const playNowSection = document.getElementById('play-now-section');
    playNowSection?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  reconnectToServer() {
    this.#store.dispatch(new ConnectToServer());
  }

  checkToJoinGame() {
    if (this.gameCodeInput.length !== 4) {
      this.#store.dispatch(new SetGameCodeIsInvalid(false));
      return;
    }

    const upperCaseGameCode = this.gameCodeInput.toUpperCase();
    const actualGameCode = this.#store.selectSnapshot(
      GameState.pendingGameView
    )?.GameCode;
    if (!actualGameCode || upperCaseGameCode === actualGameCode) {
      this.#store.dispatch(new SetGameCodeIsInvalid(true));
      return;
    }

    this.#store.dispatch(new JoinGame(upperCaseGameCode));
  }

  navigateToHome() {
    this.#router.navigate(['']);
  }

  copyToClipboard(text: string) {
    this.#clipboard.copy(text);
    this.#matSnackBar.open('Copied to clipboard.', text, {
      duration: 5000,
      verticalPosition: 'bottom',
    });
  }

  toggleDarkMode() {
    toggleDarkMode();
  }
}
