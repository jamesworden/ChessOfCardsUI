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
import { BehaviorSubject, Observable, Subject, of, timer } from 'rxjs';
import {
  withLatestFrom,
  tap,
  distinctUntilChanged,
} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AcceptDrawOffer,
  DenyDrawOffer,
  FinishPlacingMultipleCards,
  MakeMove,
  OfferDraw,
  PassMove,
  RearrangeHand,
  ResetPendingGameView,
  ResignGame,
  SendChatMessage,
  SetPlaceMultipleCards,
  SetPlaceMultipleCardsHand,
  StartPlacingMultipleCards,
  UpdatePlayerGameView,
  GameState,
  JoinGame,
  GameClockService,
  MarkLatestReadChatMessage,
} from '@shared/game';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, pairwise, startWith, filter, takeUntil } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import {
  Card,
  CardMovement,
  CardPosition,
  ChatMessage,
  DURATION_OPTIONS_TO_MINUTES,
  DurationOption,
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
  getMoveNotations,
  getReasonIfMoveInvalid,
  isPlayersTurn,
  moveCardToLane,
  removeCardFromArray,
} from '@shared/logic';
import { ResponsiveSizeService } from '@shared/game';
import { AnimatedEntity } from '@shared/animation-overlay';
import { getAnimatedCardEntities } from './logic/get-animated-card-entities';
import { fadeInOutAnimation } from '@shared/animations';
import { gettoPmcLaneEntities } from './logic/get-to-place-multiple-lane-entities';
import { getfromPmcLaneEntities } from './logic/get-from-place-multiple-lane-entities';
import {
  SuitAndKindHasValidMove,
  suitAndKindHasValidMove,
} from './logic/suit-and-kind-has-valid-move';
import { getCardStack } from './logic/get-card-stack';
import { BREAKPOINTS, Z_INDEXES } from '@shared/constants';
import { GameViewTab } from './models/game-view-tab';
import { StatisticsPanelView } from '@shared/statistics-panel';
import { AudioCacheService } from '@shared/audio-cache';
import { DEFAULT_GAME_VIEW } from './constants';
import { ButtonModalComponent } from '@shared/ui-inputs';
import { Router } from '@angular/router';
import { addMinutes, isAfter } from 'date-fns';
import { getOpponentUsername, getPlayerUsername } from './logic/get-username';

interface InProgressGameData {
  gameCode: string;
  durationOption: DurationOption;
  gameStartedTimestampUTC: string;
}

const SLIDE_CARD_AUDIO_FILE_PATH = 'assets/sounds/slide_card.mp3';

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
  readonly StatisticsPanelView = StatisticsPanelView;
  readonly defaultGameView = DEFAULT_GAME_VIEW;

  readonly #matDialog = inject(MatDialog);
  readonly #store = inject(Store);
  readonly #matSnackBar = inject(MatSnackBar);
  readonly #responsiveSizeService = inject(ResponsiveSizeService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #audioCacheService = inject(AudioCacheService);
  readonly #router = inject(Router);
  readonly #gameClockService = inject(GameClockService);

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

  @Select(GameState.chatMessages)
  chatMessages$!: Observable<ChatMessage[]>;

  @Select(GameState.isConnectedToServer)
  isConnectedToServer$: Observable<boolean>;

  @Select(GameState.gameCodeIsInvalid)
  gameCodeIsInvalid$!: Observable<boolean>;

  @Select(GameState.opponentIsDisconnected)
  opponentIsDisconnected$!: Observable<boolean>;

  @Select(GameState.pendingGameCode)
  pendingGameCode$!: Observable<string>;

  @Select(GameState.gameCode)
  gameCode$!: Observable<string>;

  readonly clocks$ = this.#gameClockService.remainingTimeClocks$;
  readonly isMuted$ = this.#audioCacheService.isMuted$;
  readonly cardSize$ = this.#responsiveSizeService.cardSize$;
  readonly opponentDisconnectClock$ =
    this.#gameClockService.opponentDisconnectClock$;

  readonly cachedGameView$ = new BehaviorSubject<PlayerGameView | null>(null);
  readonly selectedCard$ = new BehaviorSubject<Card | null>(null);
  readonly positionClicked$ = new Subject<CardPosition>();
  readonly toPmcLaneEntities$ = new Subject<AnimatedEntity<CardMovement>[]>();
  readonly fromPmcLaneEntities$ = new Subject<AnimatedEntity<CardMovement>[]>();
  readonly selectedPosition$ = new BehaviorSubject<CardPosition | null>(null);
  readonly selectedNotationIndex$ = new BehaviorSubject<number | null>(null);
  readonly pastGameView$ = new BehaviorSubject<PlayerGameView | null>(null);
  readonly notationIdxToPastGameViews$ = new BehaviorSubject<{
    [notationIdx: number]: PlayerGameView;
  }>({});
  readonly selectedTab$ = new BehaviorSubject<GameViewTab>(GameViewTab.NewGame);
  readonly selectedPanelView$ = new BehaviorSubject<StatisticsPanelView | null>(
    StatisticsPanelView.Moves
  );
  private readonly cardMovementTemplate$ =
    new BehaviorSubject<TemplateRef<CardMovement> | null>(null);

  private readonly prevAndCurrGameViews$ = this.playerGameViewToAnimate$.pipe(
    startWith(null),
    pairwise()
  );

  readonly moveNotations$ = combineLatest([
    this.playerGameView$,
    this.selectedNotationIndex$.pipe(distinctUntilChanged()),
  ]).pipe(
    filter(([playerGameView]) => (playerGameView?.movesMade?.length ?? 0) > 0),
    map(([playerGameView, selectedNotationIndex]) =>
      getMoveNotations(
        playerGameView?.movesMade ?? [],
        playerGameView?.isHost ?? false,
        selectedNotationIndex ?? 0
      )
    )
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
    this.pastGameView$,
  ]).pipe(
    map(([playerGameView, selectedPosition, pastGameView]) =>
      getCardStack(pastGameView ?? playerGameView, selectedPosition)
    )
  );

  readonly redJokerLaneIndex$ = combineLatest([
    this.pastGameView$,
    this.cachedGameView$,
  ]).pipe(
    map(([pastGameView, cachedGameView]) => {
      const gameView = pastGameView ?? cachedGameView;
      return gameView?.redJokerLaneIndex;
    })
  );

  readonly blackJokerLaneIndex$ = combineLatest([
    this.pastGameView$,
    this.cachedGameView$,
  ]).pipe(
    map(([pastGameView, cachedGameView]) => {
      const gameView = pastGameView ?? cachedGameView;
      return gameView?.blackJokerLaneIndex;
    })
  );

  readonly opponentUsername$ = this.playerGameView$.pipe(
    map(getOpponentUsername)
  );

  readonly playerUsername$ = this.playerGameView$.pipe(map(getPlayerUsername));

  readonly Z_INDEXES = Z_INDEXES;
  readonly GameViewTab = GameViewTab;

  isPlayersTurn = false;
  cardSize = 64;
  movesPanelHeight: number | undefined = undefined;
  numUnreadChatMessages = 0;

  ngOnInit() {
    this.checkToJoinInProgressGame();
    this.updateUiLayout();

    this.gameOverData$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((gameOverData) => this.showGameOverModal(gameOverData));
    this.playerGameView$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((playerGameView) => {
        if (playerGameView) {
          this.isPlayersTurn = isPlayersTurn(playerGameView);
          this.cachedGameView$.next(playerGameView);
        }
      });
    this.opponentPassedMove$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(
        (opponentPassedMove) =>
          opponentPassedMove && this.showOpponentPassedMoveToast()
      );
    this.positionClicked$
      .pipe(
        withLatestFrom(this.selectedCard$, this.selectedPosition$),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(([position, selectedCard, selectedPosition]) => {
        if (selectedCard) {
          this.attemptToPlaceCard({
            card: selectedCard,
            targetLaneIndex: position.laneIndex,
            targetRowIndex: position.rowIndex,
          });
          this.selectedPosition$.next(null);
          return;
        }

        if (
          selectedPosition &&
          selectedPosition.laneIndex === position.laneIndex &&
          selectedPosition.rowIndex === position.rowIndex
        ) {
          this.selectedPosition$.next(null);
          return;
        }

        this.selectedPosition$.next(position);
        if (this.selectedCard$.getValue()) {
          this.selectedCard$.next(null);
        }
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
    this.moveNotations$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        withLatestFrom(this.playerGameView$)
      )
      .subscribe(([moveNotations, playerGameView]) => {
        if (moveNotations.length === 0 || !playerGameView) {
          return;
        }

        const latestMoveNotationIndex = moveNotations.length - 1;
        this.selectedNotationIndex$.next(latestMoveNotationIndex);

        const map = this.notationIdxToPastGameViews$.getValue();
        // Without cloning deep, past game views will get overwritten in this map.
        map[latestMoveNotationIndex] = JSON.parse(
          JSON.stringify(playerGameView)
        ) as PlayerGameView;
        this.notationIdxToPastGameViews$.next(map);
      });
    this.selectedNotationIndex$
      .pipe(distinctUntilChanged())
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        withLatestFrom(this.notationIdxToPastGameViews$)
      )
      .subscribe(([selectedNotationIndex, notationIdxToPastGameViews]) => {
        const moveNotationIndexes = Object.keys(notationIdxToPastGameViews).map(
          (key) => parseInt(key)
        );
        if (moveNotationIndexes.length === 0) {
          return;
        }

        const lastMoveNotationIndex = Math.max(...moveNotationIndexes);
        const isLastMoveNotation =
          lastMoveNotationIndex === selectedNotationIndex;
        if (selectedNotationIndex !== null) {
          this.pastGameView$.next(
            isLastMoveNotation
              ? null
              : notationIdxToPastGameViews[selectedNotationIndex]
          );
        }

        if (this.#store.selectSnapshot(GameState.isPlacingMultipleCards)) {
          this.cancelPlaceMultipleCards();
        }
      });
    this.selectedCard$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(
        (selectedCard) => selectedCard && this.selectLastMoveNotation()
      );
    this.playerGameViewToAnimate$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.pastGameView$.next(null));
    combineLatest([
      this.playerGameView$,
      this.selectedTab$,
      this.selectedPanelView$,
    ])
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(([playerGameView, selectedTab, selectedPanelView]) => {
        if (!playerGameView) {
          this.numUnreadChatMessages = 0;
          return;
        }
        const isViewingChat =
          selectedPanelView === StatisticsPanelView.Chat ||
          (!selectedPanelView && selectedTab === GameViewTab.Chat);

        if (!isViewingChat) {
          this.numUnreadChatMessages = playerGameView.numUnreadMessages;
          return;
        }

        if (playerGameView.numUnreadMessages > 0) {
          this.#store.dispatch(
            new MarkLatestReadChatMessage(
              playerGameView.chatMessages.length - 1
            )
          );
        }

        this.numUnreadChatMessages = 0;
      });
    this.gameIsActive$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((gameIsActive) => {
        if (!gameIsActive) {
          return;
        }

        if (this.selectedTab$.getValue() === GameViewTab.NewGame) {
          this.selectedTab$.next(GameViewTab.BoardWithStatsPanel);
        }

        if (
          this.selectedPanelView$.getValue() === StatisticsPanelView.NewGame
        ) {
          this.selectedPanelView$.next(StatisticsPanelView.Moves);
        }
      });
    combineLatest([this.gameCode$, this.pendingGameCode$])
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(([gameCode, pendingGameCode]) =>
        this.#router.navigate(['game', gameCode ?? pendingGameCode ?? ''])
      );
    this.playerGameView$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((playerGameView) => {
        if (!playerGameView || playerGameView.hasEnded) {
          return;
        }
        this.storeLocalGameData(playerGameView);
      });
    this.gameIsActive$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((isActive) => {
        if (!isActive) {
          this.destroyLocalGameData();
        }
      });
  }

  ngAfterViewInit() {
    this.cardMovementTemplate$.next(this.cardMovementTemplate);
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey() {
    if (this.#store.selectSnapshot(GameState.isPlacingMultipleCards)) {
      this.cancelPlaceMultipleCards();
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    const clickedOnCard = (event.target as HTMLElement).closest('.card');
    if (!clickedOnCard && this.selectedCard$.getValue()) {
      this.selectedCard$.next(null);
    }
  }

  @HostListener('window:resize', ['$event'])
  updateUiLayout() {
    if (window.innerWidth >= BREAKPOINTS.LG) {
      if (this.selectedTab$.getValue() !== GameViewTab.BoardWithStatsPanel) {
        this.selectedTab$.next(GameViewTab.BoardWithStatsPanel);
      }

      this.selectedPanelView$.next(StatisticsPanelView.NewGame);
      return;
    }

    if (window.innerWidth >= BREAKPOINTS.SM) {
      this.selectedPanelView$.next(null);
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
    let cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
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
            entity.context.card &&
            cardEqualsCard(card, entity.context.card) &&
            ((cachedGameView?.isHost &&
              entity.context.from.hostHandCardIndex !== null) ||
              (!cachedGameView?.isHost &&
                entity.context.from.guestHandCardIndex !== null))
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
    let cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
      return;
    }

    let cardEntities = animatedEntities as AnimatedEntity<CardMovement>[];
    const numLanes = cachedGameView.lanes.length;

    for (const cardEntity of cardEntities) {
      for (let laneIndex = 0; laneIndex < numLanes; laneIndex++) {
        cachedGameView = this.removeCardFromRelevantPositions(
          laneIndex,
          cardEntity,
          cachedGameView
        );
      }
      cachedGameView = this.removeCardFromOpponentHand(
        cardEntity,
        cachedGameView
      );
    }

    this.cachedGameView$.next({ ...cachedGameView });
  }

  attemptToPlaceCard(placeCardAttempt: PlaceCardAttempt) {
    if (this.#store.selectSnapshot(GameState.isPlacingMultipleCards)) {
      return;
    }

    const move: Move = {
      placeCardAttempts: [placeCardAttempt],
    };

    const cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
      return;
    }

    if (!this.#store.selectSnapshot(GameState.gameIsActive)) {
      this.#matSnackBar.open('This game is not in progress!', 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    const invalidMoveMessage = this.isPlayersTurn
      ? getReasonIfMoveInvalid(move, cachedGameView.candidateMoves)
      : "It's not your turn!";

    if (invalidMoveMessage) {
      this.#matSnackBar.open(invalidMoveMessage, 'Hide', {
        duration: 3000,
        verticalPosition: 'top',
      });
      return;
    }

    if (this.latestMoveMadeDetails$.getValue()?.wasDragged) {
      this.#audioCacheService.play(SLIDE_CARD_AUDIO_FILE_PATH);
    }

    canPlaceMultipleCards(placeCardAttempt, cachedGameView.candidateMoves)
      ? this.initiatePlaceMultipleCards(placeCardAttempt)
      : this.makeValidatedMove(move, cachedGameView.lanes);
  }

  onPlayerHandCardDrop(event: CdkDragDrop<string>) {
    const oneListToAnother = event.previousContainer !== event.container;
    const cardPositionChanged =
      event.previousIndex !== event.currentIndex || oneListToAnother;

    if (!cardPositionChanged) {
      return;
    }

    this.#audioCacheService.play(SLIDE_CARD_AUDIO_FILE_PATH);

    const isPlacingMultipleCards = this.#store.selectSnapshot(
      GameState.isPlacingMultipleCards
    );

    if (isPlacingMultipleCards && oneListToAnother) {
      const card = event.item.data as Card;
      this.dragCardBackToHand(card, event.currentIndex);
      return;
    }

    isPlacingMultipleCards
      ? this.rearrangePlaceMultipleHand(event.previousIndex, event.currentIndex)
      : this.rearrangeHand(event.previousIndex, event.currentIndex);
  }

  cancelPlaceMultipleCards() {
    const cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
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

    cachedGameView.hand.cards = placeMultipleCardsHand;
    this.cachedGameView$.next({ ...cachedGameView });
    this.#store.dispatch(new FinishPlacingMultipleCards(false));

    const isHost = cachedGameView.isHost;
    const cardsToAddBackToHand = placeMultipleCards.reverse();
    const placeCardAttempts: PlaceCardAttempt[] = cardsToAddBackToHand.map(
      (card, relativeRowIndex) => {
        const initialRowIndex = initialPlaceMultipleCardAttempt.targetRowIndex;
        const targetRowIndex = isHost
          ? initialRowIndex + relativeRowIndex
          : initialRowIndex - relativeRowIndex;

        return {
          card,
          targetLaneIndex: initialPlaceMultipleCardAttempt.targetLaneIndex,
          targetRowIndex,
        };
      }
    );

    this.fromPmcLaneEntities$.next(
      getfromPmcLaneEntities(
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
    const cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
      return;
    }

    const cardEntities = animatedEntites as AnimatedEntity<CardMovement>[];
    const cardsToAdd = cardEntities
      .map((entity) => entity.context.card as Card)
      .filter((card) => card);
    const combinedCards = cachedGameView.hand.cards.concat(cardsToAdd);
    cachedGameView.hand.cards = combinedCards;

    this.#store.dispatch(new UpdatePlayerGameView(cachedGameView));
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

    let cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
      return;
    }

    const reversedPlaceMultipleCards = [...placeMultipleCards].reverse();
    const move = convertPlaceMultipleCardsToMove(
      reversedPlaceMultipleCards,
      initialPlaceMultipleCardAttempt,
      cachedGameView.isHost
    );

    const invalidMoveMessage = getReasonIfMoveInvalid(
      move,
      cachedGameView.candidateMoves
    );
    if (invalidMoveMessage) {
      this.#matSnackBar.open(
        `Consecutive cards must have matching suit or kind.`,
        'Hide',
        {
          duration: 3000,
          verticalPosition: 'top',
        }
      );

      return;
    }

    if (cachedGameView) {
      // Until server responds, patch the game snapshot so move is seamless.
      // Only patch the player side moves so the animations can load the other ones.
      cachedGameView = this.patchPlayerSideGameViewWithMoves(
        cachedGameView,
        move
      );
      this.cachedGameView$.next({ ...cachedGameView });
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
    for (const placeCardAttempt of move.placeCardAttempts) {
      for (let laneIndex = 0; laneIndex < gameView.lanes.length; laneIndex++) {
        if (placeCardAttempt.targetLaneIndex === laneIndex) {
          const lane = gameView.lanes[laneIndex];
          for (let rowIndex = 0; rowIndex < lane.rows.length; rowIndex++) {
            const isOnPlayersSide =
              (gameView.isHost && placeCardAttempt.targetRowIndex < 3) ||
              (!gameView.isHost && placeCardAttempt.targetRowIndex > 3);
            if (
              isOnPlayersSide &&
              rowIndex === placeCardAttempt.targetRowIndex
            ) {
              const row = lane.rows[rowIndex];
              row.push(placeCardAttempt.card);
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
    this.#audioCacheService.play(SLIDE_CARD_AUDIO_FILE_PATH);
    this.#store.dispatch(new SetPlaceMultipleCards(cards));
  }

  placedMultipleCardsHand(cards: Card[]) {
    this.#audioCacheService.play(SLIDE_CARD_AUDIO_FILE_PATH);
    this.#store.dispatch(new SetPlaceMultipleCardsHand(cards));
  }

  addCardToPlaceMultipleCardsLane(animatedEntities: AnimatedEntity<unknown>[]) {
    const cardMovementEntities =
      animatedEntities as AnimatedEntity<CardMovement>[];

    const cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
      return;
    }

    const cardsToAdd = cardMovementEntities
      .map((entity) => entity.context.card as Card)
      .filter((card) => card);

    const cardsFromHand = this.#store.selectSnapshot(
      GameState.isPlacingMultipleCards
    )
      ? this.#store.selectSnapshot(GameState.placeMultipleCardsHand) ?? []
      : [...cachedGameView.hand.cards];

    cardsToAdd.forEach((card) => removeCardFromArray(card, cardsFromHand));
    this.cachedGameView$.next(cachedGameView);

    const initialCards =
      this.#store.selectSnapshot(GameState.placeMultipleCards) ?? [];
    const updatedPlaceMultipleCards = cardsToAdd.concat(initialCards);

    this.#store.dispatch(new SetPlaceMultipleCards(updatedPlaceMultipleCards));
  }

  passMove() {
    this.cancelPlaceMultipleCards();
    this.#store.dispatch(new PassMove());

    this.#matSnackBar.open('Move passed.', 'Hide', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

  offerDraw() {
    this.#store.dispatch(new OfferDraw());

    this.#matSnackBar.open('Offered draw.', 'Hide', {
      duration: 3000,
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
    this.selectLastMoveNotation();
  }

  onCardDragEnded() {
    this.selectedCard$.next(null);
  }

  onCardClicked(card: Card) {
    if (!this.#store.selectSnapshot(GameState.gameIsActive)) {
      return;
    }

    const selectedCard = this.selectedCard$.getValue();
    const matchingKind = card.kind === selectedCard?.kind;
    const matchingSuit = card.suit === selectedCard?.suit;

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
    const cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
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

    if (placeMultipleCards[0]?.kind !== selectedCard.kind) {
      return;
    }

    let TargetRowIndex = cachedGameView.isHost
      ? initialPlaceCardAttempt.targetRowIndex + placeMultipleCards.length
      : initialPlaceCardAttempt.targetRowIndex - placeMultipleCards.length;

    const placeCardAttempt: PlaceCardAttempt = {
      card: selectedCard,
      targetLaneIndex: initialPlaceCardAttempt.targetLaneIndex,
      targetRowIndex: TargetRowIndex,
    };

    const cardsFromHand =
      this.#store.selectSnapshot(GameState.placeMultipleCardsHand) ?? [];

    const entities = gettoPmcLaneEntities(
      [placeCardAttempt],
      cardsFromHand,
      cachedGameView.isHost,
      this.cardMovementTemplate,
      this.cardSize
    );

    this.toPmcLaneEntities$.next(entities);
    this.selectedCard$.next(null);
  }

  selectMoveNotation(moveNotationIndex: number) {
    this.selectedNotationIndex$.next(moveNotationIndex);
  }

  selectGameViewTab(gameViewTab: GameViewTab) {
    this.pastGameView$.next(null);
    this.selectedTab$.next(gameViewTab);

    if (
      gameViewTab === GameViewTab.BoardWithStatsPanel &&
      !this.#store.selectSnapshot(GameState.playerGameView)
    ) {
      this.#matSnackBar.open('Play a game to see cards on the board.', 'Hide', {
        verticalPosition: 'bottom',
        duration: 3000,
      });
    } else {
      this.#matSnackBar.dismiss();
    }
  }

  setMovesPanelHeight(height: number) {
    this.movesPanelHeight = height;
  }

  sendChatMessage(message: string) {
    this.#store.dispatch(new SendChatMessage(message));
  }

  selectPanelView(statisticsPanelView: StatisticsPanelView) {
    this.selectedPanelView$.next(statisticsPanelView);
  }

  mute() {
    this.#audioCacheService.mute();
  }

  unmute() {
    this.#audioCacheService.unmute();
  }

  private storeLocalGameData(playerGameView: PlayerGameView) {
    const inProgressGameData: InProgressGameData = {
      durationOption: playerGameView.durationOption,
      gameCode: playerGameView.gameCode,
      gameStartedTimestampUTC: playerGameView.gameCreatedTimestampUTC,
    };

    localStorage.setItem(
      'in-progress-game',
      JSON.stringify(inProgressGameData)
    );
  }

  private destroyLocalGameData() {
    localStorage.removeItem('in-progress-game');
  }

  private getLocalGameData() {
    const stringifiedGameData = localStorage.getItem('in-progress-game');
    if (!stringifiedGameData || typeof stringifiedGameData !== 'string') {
      return null;
    }
    return JSON.parse(stringifiedGameData) as InProgressGameData;
  }

  private updateLatestMoveDetails(updatedDetails: Partial<MoveMadeDetails>) {
    const existingDetails =
      this.latestMoveMadeDetails$.getValue() ?? DEFAULT_LATEST_MOVE_DETAILS;
    this.latestMoveMadeDetails$.next({
      ...existingDetails,
      ...updatedDetails,
    });
  }

  private checkToJoinInProgressGame() {
    const inProgressGameData = this.getLocalGameData();
    this.destroyLocalGameData();

    inProgressGameData
      ? this.joinInProgressGameFromLocalData(inProgressGameData)
      : this.joinInProgressGameFromUrl();
  }

  private joinInProgressGameFromLocalData(
    inProgressGameData: InProgressGameData
  ) {
    const gameStarted = new Date(inProgressGameData.gameStartedTimestampUTC);
    const playerTurnMinutes =
      DURATION_OPTIONS_TO_MINUTES[inProgressGameData.durationOption];
    const totalPossibleDuration = playerTurnMinutes * 2;
    const gameEndedBy = addMinutes(gameStarted, totalPossibleDuration);
    if (isAfter(gameStarted, gameEndedBy)) {
      return;
    }

    this.joinGameUponConnectingToServer(inProgressGameData.gameCode);
  }

  private joinInProgressGameFromUrl() {
    const urlPieces = this.#router.url.split('/');
    const potentialGameCode = urlPieces[urlPieces.length - 1];
    if (/[A-Z]/.test(potentialGameCode) && potentialGameCode.length === 4) {
      this.joinGameUponConnectingToServer(potentialGameCode);
    }
  }

  private joinGameUponConnectingToServer(gameCode: string) {
    const hasDispatchedAction$ = new Subject();
    this.isConnectedToServer$
      .pipe(
        filter((isConnected) => isConnected),
        takeUntil(hasDispatchedAction$)
      )
      .subscribe(() => {
        this.#store.dispatch(
          new JoinGame({
            gameCode,
          })
        );
        hasDispatchedAction$.next();
      });
  }

  private rearrangeHand(previousIndex: number, targetIndex: number) {
    const cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
      return;
    }
    moveItemInArray(cachedGameView.hand.cards, previousIndex, targetIndex);
    this.cachedGameView$.next(cachedGameView);
    this.#store.dispatch(new UpdatePlayerGameView(cachedGameView));
    this.#store.dispatch(new RearrangeHand(cachedGameView.hand.cards));
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

    const cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
      return;
    }

    cachedGameView.hand.cards = handAfterSwitch;
    this.cachedGameView$.next(cachedGameView);
    this.#store.dispatch(new UpdatePlayerGameView(cachedGameView));
    new RearrangeHand(handAfterSwitch);
  }

  private initiatePlaceMultipleCards(placeCardAttempt: PlaceCardAttempt) {
    const cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
      return;
    }

    const initialPlaceMultipleCardsHand = [...cachedGameView.hand.cards];

    const cardWasDragged = this.latestMoveMadeDetails$.getValue()?.wasDragged;
    if (cardWasDragged) {
      removeCardFromArray(placeCardAttempt.card, initialPlaceMultipleCardsHand);
    }

    this.#store.dispatch(
      new StartPlacingMultipleCards(
        initialPlaceMultipleCardsHand,
        placeCardAttempt
      )
    );

    if (!cardWasDragged) {
      this.toPmcLaneEntities$.next(
        gettoPmcLaneEntities(
          [placeCardAttempt],
          initialPlaceMultipleCardsHand,
          cachedGameView.isHost,
          this.cardMovementTemplate,
          this.cardSize
        )
      );
      return;
    }

    this.#store.dispatch(new SetPlaceMultipleCards([placeCardAttempt.card]));
  }

  private makeValidatedMove(move: Move, lanes: Lane[]) {
    const cachedGameView = this.cachedGameView$.getValue();
    if (!cachedGameView) {
      return;
    }

    for (const placeCardAttempt of move.placeCardAttempts) {
      if (this.latestMoveMadeDetails$.getValue()?.wasDragged) {
        moveCardToLane(placeCardAttempt, lanes);
      }

      removeCardFromArray(placeCardAttempt.card, cachedGameView.hand.cards);
    }

    this.cachedGameView$.next({ ...cachedGameView });
    this.#store.dispatch(new UpdatePlayerGameView(cachedGameView));
    this.#store.dispatch(new MakeMove(move));
  }

  private showOpponentPassedMoveToast() {
    this.#matSnackBar.open(
      `Opponent passed their move. It's your turn.`,
      'Hide',
      {
        duration: 3000,
        verticalPosition: 'top',
      }
    );
  }

  private showGameOverModal(gameOverData: GameOverData) {
    if (!gameOverData.isOver) {
      return;
    }

    const modalRef = this.#matDialog.open(ButtonModalComponent, {
      width: '250px',
      maxHeight: '100svh',
      data: { message: gameOverData.message },
    });

    const subscription = modalRef.afterClosed().subscribe(() => {
      this.#store.dispatch(new ResetPendingGameView());
      subscription.unsubscribe();
    });
  }

  private removeCardFromRelevantPositions(
    laneIndex: number,
    cardEntity: AnimatedEntity<CardMovement>,
    gameView: PlayerGameView
  ) {
    const lane = gameView.lanes[laneIndex];

    for (let rowIndex = 0; rowIndex < lane.rows.length; rowIndex++) {
      const { cardPosition: CardPosition } = cardEntity.context.from;
      const sameLane = CardPosition?.laneIndex === laneIndex;
      const sameRow = CardPosition?.rowIndex === rowIndex;

      if (sameLane && sameRow) {
        lane.rows[rowIndex] = [];
      }
    }
    return gameView;
  }

  private removeCardFromOpponentHand(
    cardEntity: AnimatedEntity<CardMovement>,
    gameView: PlayerGameView
  ) {
    const opponentHandCardIndex = this.cachedGameView$.getValue()?.isHost
      ? cardEntity.context.from?.guestHandCardIndex
      : cardEntity.context.from?.hostHandCardIndex;
    if (opponentHandCardIndex !== null && opponentHandCardIndex !== undefined) {
      gameView.numCardsInOpponentsHand--;
    }
    return gameView;
  }

  private selectLastMoveNotation() {
    const moveNotationIndexes = Object.keys(
      this.notationIdxToPastGameViews$.getValue()
    ).map((idx) => parseInt(idx));

    if (moveNotationIndexes.length === 0) {
      this.selectedNotationIndex$.next(null);
      return;
    }

    const lastMoveNotationIndex = Math.max(...moveNotationIndexes);
    this.selectedNotationIndex$.next(lastMoveNotationIndex);
  }
}
