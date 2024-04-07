import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  OnInit,
  TemplateRef,
  inject,
  ViewChild,
  AfterViewInit,
  DestroyRef,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, withLatestFrom } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AcceptDrawOffer,
  DenyDrawOffer,
  FinishPlacingMultipleCards,
  MakeMove,
  PassMove,
  RearrangeHand,
  ResetGameData,
  ResetPendingGameView,
  SetPlaceMultipleCards,
  SetPlaceMultipleCardsHand,
  StartPlacingMultipleCards,
  UpdatePlayerGameView,
} from 'projects/client/src/app/actions/game.actions';
import { GameState } from '../../state/game.state';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './components/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, pairwise, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { cardRotationAnimation } from '../../animations/card-rotation.animation';
import { fadeInOutAnimation } from '../../animations/fade-in-out.animation';
import {
  Card,
  CardMovement,
  GameOverData,
  Lane,
  Move,
  PlaceCardAttempt,
  PlayerGameView,
  PlayerOrNone,
} from '@shared/models';
import { MoveMadeDetails } from './models/move-made-details.model';
import {
  addCardToArray,
  canPlaceMultipleCards,
  convertPlaceMultipleCardsToMove,
  getPossibleInitialPlaceCardAttempts,
  getReasonIfMoveInvalid,
  isPlayersTurn,
  moveCardToLane,
  removeCardFromArray,
} from '@shared/logic';
import { ResponsiveSizeService } from '@shared/game';
import { AnimatedEntity } from '@shared/animation-overlay';
import { getAnimatedCardEntities } from './logic/get-animated-card-entities';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss'],
  animations: [cardRotationAnimation, fadeInOutAnimation],
})
export class GameViewComponent implements OnInit, AfterViewInit {
  readonly PlayerOrNone = PlayerOrNone;

  readonly #matDialog = inject(MatDialog);
  readonly #store = inject(Store);
  readonly #snackBar = inject(MatSnackBar);
  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);

  @ViewChild('cardMovementTemplate', { read: TemplateRef })
  cardMovementTemplate: TemplateRef<any>;

  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView | null>;

  @Select(GameState.isPlacingMultipleCards)
  isPlacingMultipleCards$!: Observable<boolean>;

  @Select(GameState.placeMultipleCardsHand)
  placeMultipleCardsHand$!: Observable<Card[] | null>;

  @Select(GameState.placeMultipleCards)
  placeMultipleCards$!: Observable<Card[] | null>;

  @Select(GameState.initialPlaceMultipleCardAttempt)
  initialPlaceMultipleCardAttempt$!: Observable<PlaceCardAttempt | null>;

  @Select(GameState.gameOverData)
  gameOverData$!: Observable<GameOverData>;

  @Select(GameState.opponentPassedMove)
  opponentPassedMove$!: Observable<boolean>;

  @Select(GameState.hasPendingDrawOffer)
  hasPendingDrawOffer$!: Observable<boolean>;

  @Select(GameState.waitingForServer)
  waitingForServer$!: Observable<boolean>;

  @Select(GameState.playerGameViewToAnimate)
  playerGameViewToAnimate$!: Observable<PlayerGameView>;

  private readonly cardMovementTemplate$ =
    new BehaviorSubject<TemplateRef<CardMovement> | null>(null);

  private readonly prevAndCurrGameViews$ = this.playerGameViewToAnimate$.pipe(
    startWith(null),
    pairwise()
  );

  // TODO: Use different control mechanism when click to move has been implemented.
  private readonly latestMoveMadeDetails$ =
    new BehaviorSubject<MoveMadeDetails | null>({
      wasDragged: true,
    });

  readonly animatedCardEntities$: Observable<AnimatedEntity<CardMovement>[]> =
    combineLatest([
      this.prevAndCurrGameViews$,
      this.cardMovementTemplate$,
    ]).pipe(
      distinctUntilChanged(),
      withLatestFrom(
        this.#responsiveSizeService.cardSize$,
        this.latestMoveMadeDetails$
      ),
      map(
        ([
          [prevAndCurrGameViews, cardMovementTemplate],
          cardSize,
          latestMoveMadeDetails,
        ]) =>
          getAnimatedCardEntities(
            prevAndCurrGameViews,
            cardSize,
            cardMovementTemplate,
            latestMoveMadeDetails
          )
      )
    );

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly latestGameViewSnapshot$ = new BehaviorSubject<PlayerGameView | null>(
    null
  );

  isPlayersTurn = false;
  isPlacingMultipleCards = false;
  possibleInitialPlaceCardAttempts: PlaceCardAttempt[] = [];

  ngOnInit() {
    if (!this.#store.selectSnapshot(GameState.gameIsActive)) {
      this.#router.navigate(['']);
    }
    this.gameOverData$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((gameOverData) => {
        if (!gameOverData.isOver) {
          return;
        }

        const modalRef = this.#matDialog.open(ModalComponent, {
          width: '250px',
          data: { message: gameOverData.message },
        });

        const subscription = modalRef.afterClosed().subscribe(() => {
          this.#store.dispatch(new ResetGameData());
          this.#store.dispatch(new ResetPendingGameView());
          this.#router.navigate(['']);
          subscription.unsubscribe();
        });
      });
    this.playerGameView$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((playerGameView) => {
        if (playerGameView) {
          this.latestGameViewSnapshot$.next(playerGameView);
          this.isPlayersTurn = isPlayersTurn(playerGameView);
          this.possibleInitialPlaceCardAttempts =
            getPossibleInitialPlaceCardAttempts(playerGameView);
        }
      });
    this.opponentPassedMove$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((opponentPassedMove) => {
        if (opponentPassedMove) {
          this.#snackBar.open('Opponent passed their move.', 'Your turn!', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      });
    this.isPlacingMultipleCards$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((isPlacingMultipleCards) => {
        this.isPlacingMultipleCards = isPlacingMultipleCards;
      });
  }

  ngAfterViewInit() {
    this.cardMovementTemplate$.next(this.cardMovementTemplate);
  }

  renderAnimatedGameView() {
    const view = this.#store.selectSnapshot(GameState.playerGameViewToAnimate);

    if (view) {
      this.#store.dispatch(new UpdatePlayerGameView(view));
    }
  }

  checkToRemoveCardFromBoard(animatedEntities: AnimatedEntity<unknown>[]) {
    let latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();

    if (!latestGameViewSnapshot) {
      return;
    }

    // Remove cards from board when they move from a card position to somewhere else.
    let cardEntities = animatedEntities as AnimatedEntity<CardMovement>[];
    for (const cardEntity of cardEntities) {
      for (
        let laneIndex = 0;
        laneIndex < latestGameViewSnapshot.Lanes.length;
        laneIndex++
      ) {
        const lane = latestGameViewSnapshot.Lanes[laneIndex];

        for (let rowIndex = 0; rowIndex < lane.Rows.length; rowIndex++) {
          const { CardPosition } = cardEntity.context.From;
          const sameLane = CardPosition?.LaneIndex === laneIndex;
          const sameRow = CardPosition?.RowIndex === rowIndex;

          if (sameLane && sameRow) {
            lane.Rows[rowIndex] = [];
          }
        }
      }

      // Remove cards from opponents hand when they are to be animated to the opponents hand
      const opponentHandCardIndex = this.latestGameViewSnapshot$.getValue()
        ?.IsHost
        ? cardEntity.context.From?.GuestHandCardIndex
        : cardEntity.context.From?.HostHandCardIndex;
      if (
        opponentHandCardIndex !== null &&
        opponentHandCardIndex !== undefined
      ) {
        latestGameViewSnapshot.NumCardsInOpponentsHand--;
      }
    }

    this.latestGameViewSnapshot$.next({ ...latestGameViewSnapshot });
  }

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    if (this.isPlacingMultipleCards) {
      return;
    }

    const move: Move = {
      PlaceCardAttempts: [placeCardAttempt],
    };

    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    const invalidMoveMessage = getReasonIfMoveInvalid(
      latestGameViewSnapshot,
      move
    );

    if (invalidMoveMessage) {
      this.#snackBar.open(invalidMoveMessage, undefined, {
        duration: 1500,
        verticalPosition: 'top',
      });

      return;
    }

    canPlaceMultipleCards(placeCardAttempt, latestGameViewSnapshot)
      ? this.initiatePlaceMultipleCards(placeCardAttempt)
      : this.makeValidatedMove(move, latestGameViewSnapshot.Lanes);
  }

  onPlayerHandCardDrop(event: CdkDragDrop<string>) {
    const oneListToAnother = event.previousContainer !== event.container;
    const cardPositionChanged =
      event.previousIndex !== event.currentIndex || oneListToAnother;

    if (!cardPositionChanged) {
      return;
    }

    const card = event.item.data as Card;

    if (this.isPlacingMultipleCards && oneListToAnother) {
      this.dragCardBackToHand(card, event.currentIndex);
      return;
    }

    this.isPlacingMultipleCards
      ? this.rearrangePlaceMultipleHand(event.previousIndex, event.currentIndex)
      : this.rearrangeHand(event.previousIndex, event.currentIndex);
  }

  onCancelButtonClicked() {
    const placeMultipleCards = this.#store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (placeMultipleCards == null) {
      return;
    }

    const placeMultipleCardsHand = this.#store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (placeMultipleCardsHand === null) {
      return;
    }

    const combinedCards = placeMultipleCardsHand.concat(
      placeMultipleCards.reverse()
    );

    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    latestGameViewSnapshot.Hand.Cards = combinedCards;
    this.latestGameViewSnapshot$.next({ ...latestGameViewSnapshot });
    this.#store.dispatch(new UpdatePlayerGameView(latestGameViewSnapshot));
    this.#store.dispatch(new RearrangeHand(combinedCards));
    this.#store.dispatch(new FinishPlacingMultipleCards(false));
  }

  onConfirmButtonClicked() {
    const placeMultipleCards = this.#store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (placeMultipleCards === null) {
      return;
    }

    const initialPlaceMultipleCardAttempt = this.#store.selectSnapshot(
      GameState.initialPlaceMultipleCardAttempt
    );

    if (initialPlaceMultipleCardAttempt === null) {
      return;
    }

    /**
     * Place multiple cards are stored from top to bottom in state. Reverse the array
     * without mutating the original one.
     */
    const reversedPlaceMultipleCards = [...placeMultipleCards].reverse();
    const playerGameView = this.#store.selectSnapshot(GameState.playerGameView);

    if (!playerGameView) {
      return;
    }

    const move = convertPlaceMultipleCardsToMove(
      reversedPlaceMultipleCards,
      initialPlaceMultipleCardAttempt,
      playerGameView.IsHost
    );

    const invalidMoveMessage = getReasonIfMoveInvalid(playerGameView, move);

    if (invalidMoveMessage) {
      this.#snackBar.open(invalidMoveMessage, 'Out of order!', {
        duration: 1500,
        verticalPosition: 'top',
      });

      return;
    }

    // Until server responds with update, directly modify the game state snapshot
    // so the placement appears seamless.
    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (latestGameViewSnapshot) {
      for (const placeCardAttempt of move.PlaceCardAttempts) {
        for (
          let laneIndex = 0;
          laneIndex < latestGameViewSnapshot.Lanes.length;
          laneIndex++
        ) {
          if (placeCardAttempt.TargetLaneIndex === laneIndex) {
            const lane = latestGameViewSnapshot.Lanes[laneIndex];
            for (let rowIndex = 0; rowIndex < lane.Rows.length; rowIndex++) {
              // If the card isn't on the player's side, we'll instead wait for the animation to render that
              const isOnPlayersSide =
                (latestGameViewSnapshot.IsHost &&
                  placeCardAttempt.TargetRowIndex < 3) ||
                (!latestGameViewSnapshot.IsHost &&
                  placeCardAttempt.TargetRowIndex > 3);

              if (
                isOnPlayersSide &&
                rowIndex === placeCardAttempt.TargetRowIndex
              ) {
                const row = lane.Rows[rowIndex];
                row.push(placeCardAttempt.Card);
              }
            }
          }
        }
      }

      this.latestGameViewSnapshot$.next({ ...latestGameViewSnapshot });
    }

    this.#store.dispatch(new MakeMove(move));
    this.#store.dispatch(new FinishPlacingMultipleCards(true));
  }

  acceptDraw() {
    this.#store.dispatch(new AcceptDrawOffer());
  }

  denyDraw() {
    this.#store.dispatch(new DenyDrawOffer());
  }

  private rearrangeHand(previousIndex: number, targetIndex: number) {
    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    moveItemInArray(
      latestGameViewSnapshot.Hand.Cards,
      previousIndex,
      targetIndex
    );

    this.latestGameViewSnapshot$.next(latestGameViewSnapshot);
    this.#store.dispatch(new UpdatePlayerGameView(latestGameViewSnapshot));
    this.#store.dispatch(new RearrangeHand(latestGameViewSnapshot.Hand.Cards));
  }

  private rearrangePlaceMultipleHand(
    previousIndex: number,
    targetIndex: number
  ) {
    const placeMultipleCardsHand = this.#store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (placeMultipleCardsHand === null) {
      return;
    }

    moveItemInArray(placeMultipleCardsHand, previousIndex, targetIndex);

    this.#store.dispatch(new SetPlaceMultipleCardsHand(placeMultipleCardsHand));
  }

  private dragCardBackToHand(card: Card, indexInHand: number) {
    const placeMultipleCards = this.#store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (placeMultipleCards === null) {
      return;
    }

    removeCardFromArray(card, placeMultipleCards);
    this.#store.dispatch(new SetPlaceMultipleCards(placeMultipleCards));

    const placeMultipleCardsHand = this.#store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (placeMultipleCardsHand === null) {
      return;
    }

    addCardToArray(card, placeMultipleCardsHand, indexInHand);
    this.#store.dispatch(new SetPlaceMultipleCardsHand(placeMultipleCardsHand));

    const cardsAfterSwitch = this.#store.selectSnapshot(
      GameState.placeMultipleCards
    );

    if (cardsAfterSwitch === null) {
      return;
    }

    const isLastPlaceMultipleCard = cardsAfterSwitch.length < 1;

    if (!isLastPlaceMultipleCard) {
      return;
    }

    const handAfterSwitch = this.#store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (handAfterSwitch === null) {
      return;
    }

    this.#store.dispatch(new FinishPlacingMultipleCards(false));

    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    latestGameViewSnapshot.Hand.Cards = handAfterSwitch;
    this.latestGameViewSnapshot$.next(latestGameViewSnapshot);
    this.#store.dispatch(new UpdatePlayerGameView(latestGameViewSnapshot));
    new RearrangeHand(handAfterSwitch);
  }

  private initiatePlaceMultipleCards(placeCardAttempt: PlaceCardAttempt) {
    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    const cardsFromHand = [...latestGameViewSnapshot.Hand.Cards];
    removeCardFromArray(placeCardAttempt.Card, cardsFromHand);
    this.latestGameViewSnapshot$.next(latestGameViewSnapshot);

    this.#store.dispatch(
      new StartPlacingMultipleCards(placeCardAttempt, cardsFromHand)
    );
  }

  private makeValidatedMove(move: Move, lanes: Lane[]) {
    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    for (const placeCardAttempt of move.PlaceCardAttempts) {
      moveCardToLane(placeCardAttempt, lanes);
      removeCardFromArray(
        placeCardAttempt.Card,
        latestGameViewSnapshot.Hand.Cards
      );
    }

    this.latestGameViewSnapshot$.next({ ...latestGameViewSnapshot });
    this.#store.dispatch(new UpdatePlayerGameView(latestGameViewSnapshot));
    this.#store.dispatch(new MakeMove(move));
  }

  passMove() {
    this.#store.dispatch(new PassMove());
  }
}
