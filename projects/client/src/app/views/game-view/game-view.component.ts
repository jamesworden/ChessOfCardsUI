import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  OnInit,
  TemplateRef,
  inject,
  ViewChild,
  AfterViewInit,
  DestroyRef,
  HostListener,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { withLatestFrom, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AcceptDrawOffer,
  DenyDrawOffer,
  FinishPlacingMultipleCards,
  MakeMove,
  OfferDraw,
  PassMove,
  RearrangeHand,
  ResetGameData,
  ResetPendingGameView,
  ResignGame,
  SetPlaceMultipleCards,
  SetPlaceMultipleCardsHand,
  StartPlacingMultipleCards,
  UpdatePlayerGameView,
} from '../../actions/game.actions';
import { GameState } from '../../state/game.state';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './components/modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, pairwise, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import {
  Card,
  CardMovement,
  CardPosition,
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
  cardEqualsCard,
  convertPlaceMultipleCardsToMove,
  getReasonIfMoveInvalid,
  isPlayersTurn,
  moveCardToLane,
  removeCardFromArray,
} from '@shared/logic';
import { ResponsiveSizeService } from '@shared/game';
import { AnimatedEntity } from '@shared/animation-overlay';
import { getAnimatedCardEntities } from './logic/get-animated-card-entities';
import { fadeInOutAnimation } from '@shared/animations';
import { getToPlaceMultipleLaneEntities } from './logic/get-to-place-multiple-lane-entities';
import { getFromPlaceMultipleLaneEntities } from './logic/get-from-place-multiple-lane-entities';
import {
  SuitAndKindHasValidMove,
  suitAndKindHasValidMove,
} from './logic/suit-and-kind-has-valid-move';
import { getCardStack } from './logic/get-card-stack';

const DEFAULT_LATEST_MOVE_DETAILS: MoveMadeDetails = {
  wasDragged: false,
  wasPlacingMultipleCards: false,
};

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.scss'],
  animations: [fadeInOutAnimation],
})
export class GameViewComponent implements OnInit, AfterViewInit {
  readonly PlayerOrNone = PlayerOrNone;

  readonly #matDialog = inject(MatDialog);
  readonly #store = inject(Store);
  readonly #matSnackBar = inject(MatSnackBar);
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

  @Select(GameState.gameIsActive)
  gameIsActive$!: Observable<boolean>;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly latestGameViewSnapshot$ = new BehaviorSubject<PlayerGameView | null>(
    null
  );
  readonly selectedCard$ = new BehaviorSubject<Card | null>(null);
  readonly positionClicked$ = new Subject<CardPosition>();
  readonly toPlaceMultipleLaneEntities$ = new Subject<
    AnimatedEntity<CardMovement>[]
  >();
  readonly fromPlaceMultipleLaneEntities$ = new Subject<
    AnimatedEntity<CardMovement>[]
  >();
  readonly selectedPosition$ = new BehaviorSubject<CardPosition | null>(null);

  private readonly cardMovementTemplate$ =
    new BehaviorSubject<TemplateRef<CardMovement> | null>(null);

  private readonly prevAndCurrGameViews$ = this.playerGameViewToAnimate$.pipe(
    startWith(null),
    pairwise()
  );

  private readonly latestMoveMadeDetails$ =
    new BehaviorSubject<MoveMadeDetails | null>(null);

  readonly gameStateEntities$: Observable<AnimatedEntity<CardMovement>[]> =
    this.prevAndCurrGameViews$.pipe(
      withLatestFrom(
        this.cardMovementTemplate$,
        this.#responsiveSizeService.cardSize$,
        this.latestMoveMadeDetails$
      ),
      map(
        ([
          prevAndCurrGameViews,
          cardMovementTemplate,
          cardSize,
          latestMoveMadeDetails,
        ]) =>
          getAnimatedCardEntities(
            prevAndCurrGameViews,
            cardSize,
            cardMovementTemplate,
            latestMoveMadeDetails
          )
      ),
      tap(() => this.latestMoveMadeDetails$.next(null))
    );

  readonly suitAndKindHasValidMove$: Observable<SuitAndKindHasValidMove> =
    this.playerGameView$.pipe(map(suitAndKindHasValidMove));

  readonly cardStack$ = combineLatest([
    this.playerGameView$,
    this.selectedPosition$,
  ]).pipe(
    map(([playerGameView, selectedPosition]) =>
      getCardStack(playerGameView, selectedPosition)
    )
  );

  isPlayersTurn = false;
  isPlacingMultipleCards = false;
  cardSize = 64;

  ngOnInit() {
    this.navigateHomeIfGameInactive();

    this.gameOverData$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((gameOverData) => this.showGameOverModal(gameOverData));
    this.playerGameView$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((playerGameView) => {
        if (playerGameView) {
          this.isPlayersTurn = isPlayersTurn(playerGameView);
          this.latestGameViewSnapshot$.next(playerGameView);
        }
      });
    this.opponentPassedMove$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(
        (opponentPassedMove) =>
          opponentPassedMove && this.showOpponentPassedMoveToast()
      );
    this.isPlacingMultipleCards$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(
        (isPlacingMultipleCards) =>
          (this.isPlacingMultipleCards = isPlacingMultipleCards)
      );
    this.positionClicked$
      .pipe(
        withLatestFrom(this.selectedCard$, this.selectedPosition$),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(([position, selectedCard, selectedPosition]) => {
        if (selectedCard) {
          this.attemptToPlaceCard({
            Card: selectedCard,
            TargetLaneIndex: position.LaneIndex,
            TargetRowIndex: position.RowIndex,
          });
          this.selectedPosition$.next(null);
          return;
        }

        if (
          selectedPosition &&
          selectedPosition.LaneIndex === position.LaneIndex &&
          selectedPosition.RowIndex === position.RowIndex
        ) {
          this.selectedPosition$.next(null);
          return;
        }

        this.selectedPosition$.next(position);
        console.log(position);
        this.selectedCard$.next(null);
      });
    this.cardSize$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((cardSize) => (this.cardSize = cardSize));
    this.gameIsActive$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((gameIsActive) => {
        if (!gameIsActive) {
          this.cancelPlaceMultipleCards();
        }
      });
    this.selectedCard$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(
        (selectedCard) => selectedCard && this.selectedPosition$.next(null)
      );
  }

  ngAfterViewInit() {
    this.cardMovementTemplate$.next(this.cardMovementTemplate);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey() {
    if (this.isPlacingMultipleCards) {
      this.cancelPlaceMultipleCards();
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const clickedOnCard = (event.target as HTMLElement).closest('.card');
    if (!clickedOnCard) {
      this.selectedCard$.next(null);
    }
  }

  renderAnimatedGameView() {
    const playerGameViewToAnimate = this.#store.selectSnapshot(
      GameState.playerGameViewToAnimate
    );
    if (playerGameViewToAnimate) {
      this.#store.dispatch(new UpdatePlayerGameView(playerGameViewToAnimate));
    }
  }

  removeCardsFromPlaceMultipleHand(
    animatedEntities: AnimatedEntity<unknown>[]
  ) {
    let latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    const cardMovementEntities =
      animatedEntities as AnimatedEntity<CardMovement>[];
    const hand =
      this.#store.selectSnapshot(GameState.placeMultipleCardsHand) ?? [];

    for (const card of hand) {
      if (
        cardMovementEntities.some(
          (entity) =>
            entity.context.Card &&
            cardEqualsCard(card, entity.context.Card) &&
            ((latestGameViewSnapshot?.IsHost &&
              entity.context.From.HostHandCardIndex !== null) ||
              (!latestGameViewSnapshot?.IsHost &&
                entity.context.From.GuestHandCardIndex !== null))
        )
      ) {
        removeCardFromArray(card, hand);
      }
    }

    this.#store.dispatch(new SetPlaceMultipleCardsHand(hand));
  }

  removeCardsFromBoardAndOpponentHand(
    animatedEntities: AnimatedEntity<unknown>[]
  ) {
    let latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    let cardEntities = animatedEntities as AnimatedEntity<CardMovement>[];
    const numLanes = latestGameViewSnapshot.Lanes.length;

    for (const cardEntity of cardEntities) {
      for (let laneIndex = 0; laneIndex < numLanes; laneIndex++) {
        latestGameViewSnapshot = this.removeCardFromRelevantPositions(
          laneIndex,
          cardEntity,
          latestGameViewSnapshot
        );
      }
      latestGameViewSnapshot = this.removeCardFromOpponentHand(
        cardEntity,
        latestGameViewSnapshot
      );
    }

    this.latestGameViewSnapshot$.next({ ...latestGameViewSnapshot });
  }

  attemptToPlaceCard(placeCardAttempt: PlaceCardAttempt) {
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

    const invalidMoveMessage = this.isPlayersTurn
      ? getReasonIfMoveInvalid(move, latestGameViewSnapshot.CandidateMoves)
      : "It's not your turn!";

    if (invalidMoveMessage) {
      this.#matSnackBar.open(invalidMoveMessage, undefined, {
        duration: 5000,
        verticalPosition: 'top',
      });

      return;
    }

    canPlaceMultipleCards(
      placeCardAttempt,
      latestGameViewSnapshot.CandidateMoves
    )
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

    if (this.isPlacingMultipleCards && oneListToAnother) {
      const card = event.item.data as Card;
      this.dragCardBackToHand(card, event.currentIndex);
      return;
    }

    this.isPlacingMultipleCards
      ? this.rearrangePlaceMultipleHand(event.previousIndex, event.currentIndex)
      : this.rearrangeHand(event.previousIndex, event.currentIndex);
  }

  cancelPlaceMultipleCards() {
    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    const placeMultipleCards = this.#store.selectSnapshot(
      GameState.placeMultipleCards
    );
    if (placeMultipleCards === null) {
      return;
    }

    const placeMultipleCardsHand = this.#store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );
    if (placeMultipleCardsHand === null) {
      return;
    }

    const initialPlaceMultipleCardAttempt = this.#store.selectSnapshot(
      GameState.initialPlaceMultipleCardAttempt
    );
    if (!initialPlaceMultipleCardAttempt) {
      return;
    }

    latestGameViewSnapshot.Hand.Cards = placeMultipleCardsHand;
    this.latestGameViewSnapshot$.next({ ...latestGameViewSnapshot });
    this.#store.dispatch(new FinishPlacingMultipleCards(false));

    const isHost = latestGameViewSnapshot.IsHost;
    const cardsToAddBackToHand = placeMultipleCards.reverse();
    const placeCardAttempts: PlaceCardAttempt[] = cardsToAddBackToHand.map(
      (card, relativeRowIndex) => {
        const initialRowIndex = initialPlaceMultipleCardAttempt.TargetRowIndex;
        const TargetRowIndex = isHost
          ? initialRowIndex + relativeRowIndex
          : initialRowIndex - relativeRowIndex;

        return {
          Card: card,
          TargetLaneIndex: initialPlaceMultipleCardAttempt.TargetLaneIndex,
          TargetRowIndex,
        };
      }
    );

    this.fromPlaceMultipleLaneEntities$.next(
      getFromPlaceMultipleLaneEntities(
        placeCardAttempts,
        isHost,
        this.cardMovementTemplate,
        this.cardSize,
        placeMultipleCardsHand
      )
    );
  }

  addCardsToHandFromPlaceMultipleLane(
    animatedEntites: AnimatedEntity<unknown>[]
  ) {
    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    const cardEntities = animatedEntites as AnimatedEntity<CardMovement>[];
    const cardsToAdd = cardEntities
      .map((entity) => entity.context.Card as Card)
      .filter((card) => card);
    const combinedCards = latestGameViewSnapshot.Hand.Cards.concat(cardsToAdd);
    latestGameViewSnapshot.Hand.Cards = combinedCards;

    this.#store.dispatch(new UpdatePlayerGameView(latestGameViewSnapshot));
    this.#store.dispatch(new RearrangeHand(combinedCards));
  }

  confirmPlaceMultipleCards() {
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

    let latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    const reversedPlaceMultipleCards = [...placeMultipleCards].reverse();
    const move = convertPlaceMultipleCardsToMove(
      reversedPlaceMultipleCards,
      initialPlaceMultipleCardAttempt,
      latestGameViewSnapshot.IsHost
    );

    const invalidMoveMessage = getReasonIfMoveInvalid(
      move,
      latestGameViewSnapshot.CandidateMoves
    );
    if (invalidMoveMessage) {
      this.#matSnackBar.open(invalidMoveMessage, 'Out of order!', {
        duration: 5000,
        verticalPosition: 'top',
      });

      return;
    }

    if (latestGameViewSnapshot) {
      // Until server responds, patch the game snapshot so move is seamless.
      // Only patch the player side moves so the animations can load the other ones.
      latestGameViewSnapshot = this.patchPlayerSideGameViewWithMoves(
        latestGameViewSnapshot,
        move
      );
      this.latestGameViewSnapshot$.next({ ...latestGameViewSnapshot });
    }

    this.updateLatestMoveDetails({
      wasPlacingMultipleCards: true,
    });

    const placeMultipleCardsHand =
      this.#store.selectSnapshot(GameState.placeMultipleCardsHand) ?? undefined;
    this.#store.dispatch(new MakeMove(move, placeMultipleCardsHand));
    this.#store.dispatch(new FinishPlacingMultipleCards(true));
  }

  patchPlayerSideGameViewWithMoves(gameView: PlayerGameView, move: Move) {
    for (const placeCardAttempt of move.PlaceCardAttempts) {
      for (let laneIndex = 0; laneIndex < gameView.Lanes.length; laneIndex++) {
        if (placeCardAttempt.TargetLaneIndex === laneIndex) {
          const lane = gameView.Lanes[laneIndex];
          for (let rowIndex = 0; rowIndex < lane.Rows.length; rowIndex++) {
            const isOnPlayersSide =
              (gameView.IsHost && placeCardAttempt.TargetRowIndex < 3) ||
              (!gameView.IsHost && placeCardAttempt.TargetRowIndex > 3);
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
    return gameView;
  }

  acceptDraw() {
    this.#store.dispatch(new AcceptDrawOffer());
  }

  denyDraw() {
    this.#store.dispatch(new DenyDrawOffer());
  }

  placedMultipleCards(cards: Card[]) {
    this.#store.dispatch(new SetPlaceMultipleCards(cards));
  }

  placedMultipleCardsHand(cards: Card[]) {
    this.#store.dispatch(new SetPlaceMultipleCardsHand(cards));
  }

  addCardToPlaceMultipleCardsLane(animatedEntities: AnimatedEntity<unknown>[]) {
    const cardMovementEntities =
      animatedEntities as AnimatedEntity<CardMovement>[];

    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    const cardsToAdd = cardMovementEntities
      .map((entity) => entity.context.Card as Card)
      .filter((card) => card);

    const cardsFromHand = this.#store.selectSnapshot(
      GameState.isPlacingMultipleCards
    )
      ? this.#store.selectSnapshot(GameState.placeMultipleCardsHand) ?? []
      : [...latestGameViewSnapshot.Hand.Cards];

    cardsToAdd.forEach((card) => removeCardFromArray(card, cardsFromHand));
    this.latestGameViewSnapshot$.next(latestGameViewSnapshot);

    const initialCards =
      this.#store.selectSnapshot(GameState.placeMultipleCards) ?? [];
    const updatedPlaceMultipleCards = cardsToAdd.concat(initialCards);

    this.#store.dispatch(new SetPlaceMultipleCards(updatedPlaceMultipleCards));
  }

  passMove() {
    this.cancelPlaceMultipleCards();
    this.#store.dispatch(new PassMove());

    this.#matSnackBar.open('Move passed.', undefined, {
      duration: 5000,
      verticalPosition: 'top',
    });
  }

  offerDraw() {
    this.#store.dispatch(new OfferDraw());

    this.#matSnackBar.open('Offered draw.', undefined, {
      duration: 5000,
      verticalPosition: 'top',
    });
  }

  resign() {
    this.cancelPlaceMultipleCards();
    this.#store.dispatch(new ResignGame());
  }

  onCardDragStarted(card: Card) {
    this.selectedCard$.next(card);
    this.updateLatestMoveDetails({
      wasDragged: true,
    });
  }

  onCardDragEnded() {
    this.selectedCard$.next(null);
  }

  onCardClicked(card: Card) {
    const selectedCard = this.selectedCard$.getValue();
    const matchingKind = card.Kind === selectedCard?.Kind;
    const matchingSuit = card.Suit === selectedCard?.Suit;

    this.updateLatestMoveDetails({
      wasDragged: false,
    });
    matchingKind && matchingSuit
      ? this.selectedCard$.next(null)
      : this.selectedCard$.next(card);
  }

  onPositionClicked(position: CardPosition) {
    this.positionClicked$.next(position);
  }

  moveSelectedCardToPlaceMultipleList() {
    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    const selectedCard = this.selectedCard$.getValue();
    if (!selectedCard) {
      return;
    }

    const initialPlaceCardAttempt = this.#store.selectSnapshot(
      GameState.initialPlaceMultipleCardAttempt
    );
    if (initialPlaceCardAttempt === null) {
      return;
    }

    const placeMultipleCards = this.#store.selectSnapshot(
      GameState.placeMultipleCards
    );
    if (placeMultipleCards === null) {
      return;
    }

    let TargetRowIndex = latestGameViewSnapshot.IsHost
      ? initialPlaceCardAttempt.TargetRowIndex + placeMultipleCards.length
      : initialPlaceCardAttempt.TargetRowIndex - placeMultipleCards.length;

    const placeCardAttempt: PlaceCardAttempt = {
      Card: selectedCard,
      TargetLaneIndex: initialPlaceCardAttempt.TargetLaneIndex,
      TargetRowIndex,
    };

    const cardsFromHand =
      this.#store.selectSnapshot(GameState.placeMultipleCardsHand) ?? [];

    const entities = getToPlaceMultipleLaneEntities(
      [placeCardAttempt],
      cardsFromHand,
      latestGameViewSnapshot.IsHost,
      this.cardMovementTemplate,
      this.cardSize
    );

    this.toPlaceMultipleLaneEntities$.next(entities);
    this.selectedCard$.next(null);
  }

  private updateLatestMoveDetails(updatedDetails: Partial<MoveMadeDetails>) {
    const existingDetails =
      this.latestMoveMadeDetails$.getValue() ?? DEFAULT_LATEST_MOVE_DETAILS;
    this.latestMoveMadeDetails$.next({
      ...existingDetails,
      ...updatedDetails,
    });
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

    const initialPlaceMultipleCardsHand = [
      ...latestGameViewSnapshot.Hand.Cards,
    ];

    const cardWasDragged = this.latestMoveMadeDetails$.getValue()?.wasDragged;
    if (cardWasDragged) {
      removeCardFromArray(placeCardAttempt.Card, initialPlaceMultipleCardsHand);
    }

    this.#store.dispatch(
      new StartPlacingMultipleCards(
        initialPlaceMultipleCardsHand,
        placeCardAttempt
      )
    );

    if (!cardWasDragged) {
      this.toPlaceMultipleLaneEntities$.next(
        getToPlaceMultipleLaneEntities(
          [placeCardAttempt],
          initialPlaceMultipleCardsHand,
          latestGameViewSnapshot.IsHost,
          this.cardMovementTemplate,
          this.cardSize
        )
      );
      return;
    }

    this.#store.dispatch(new SetPlaceMultipleCards([placeCardAttempt.Card]));
  }

  private makeValidatedMove(move: Move, lanes: Lane[]) {
    const latestGameViewSnapshot = this.latestGameViewSnapshot$.getValue();
    if (!latestGameViewSnapshot) {
      return;
    }

    for (const placeCardAttempt of move.PlaceCardAttempts) {
      if (this.latestMoveMadeDetails$.getValue()?.wasDragged) {
        moveCardToLane(placeCardAttempt, lanes);
      }

      removeCardFromArray(
        placeCardAttempt.Card,
        latestGameViewSnapshot.Hand.Cards
      );
    }

    this.latestGameViewSnapshot$.next({ ...latestGameViewSnapshot });
    this.#store.dispatch(new UpdatePlayerGameView(latestGameViewSnapshot));
    this.#store.dispatch(new MakeMove(move));
  }

  private navigateHomeIfGameInactive() {
    const gameIsActive = this.#store.selectSnapshot(GameState.gameIsActive);
    if (!gameIsActive) {
      this.#router.navigate(['']);
    }
  }

  private showOpponentPassedMoveToast() {
    this.#matSnackBar.open('Opponent passed their move.', 'Your turn!', {
      duration: 5000,
      verticalPosition: 'top',
    });
  }

  private showGameOverModal(gameOverData: GameOverData) {
    if (!gameOverData.isOver) {
      return;
    }

    const modalRef = this.#matDialog.open(ModalComponent, {
      width: '250px',
      maxHeight: '100dvh',
      data: { message: gameOverData.message },
    });

    const subscription = modalRef.afterClosed().subscribe(() => {
      this.#store.dispatch(new ResetGameData());
      this.#store.dispatch(new ResetPendingGameView());
      this.#router.navigate(['']);
      subscription.unsubscribe();
    });
  }

  private removeCardFromRelevantPositions(
    laneIndex: number,
    cardEntity: AnimatedEntity<CardMovement>,
    gameView: PlayerGameView
  ) {
    const lane = gameView.Lanes[laneIndex];

    for (let rowIndex = 0; rowIndex < lane.Rows.length; rowIndex++) {
      const { CardPosition } = cardEntity.context.From;
      const sameLane = CardPosition?.LaneIndex === laneIndex;
      const sameRow = CardPosition?.RowIndex === rowIndex;

      if (sameLane && sameRow) {
        lane.Rows[rowIndex] = [];
      }
    }
    return gameView;
  }

  private removeCardFromOpponentHand(
    cardEntity: AnimatedEntity<CardMovement>,
    gameView: PlayerGameView
  ) {
    const opponentHandCardIndex = this.latestGameViewSnapshot$.getValue()
      ?.IsHost
      ? cardEntity.context.From?.GuestHandCardIndex
      : cardEntity.context.From?.HostHandCardIndex;
    if (opponentHandCardIndex !== null && opponentHandCardIndex !== undefined) {
      gameView.NumCardsInOpponentsHand--;
    }
    return gameView;
  }
}
