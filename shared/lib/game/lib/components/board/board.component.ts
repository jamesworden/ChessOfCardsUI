import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnInit,
} from '@angular/core';
import { ResponsiveSizeService } from '@shared/game';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Card,
  PlaceCardAttempt,
  PlayerGameView,
  CardPosition,
} from '@shared/models';
import { Z_INDEXES } from '@shared/constants';
import { fadeInOutAnimation } from '@shared/animations';

@Component({
  selector: 'game-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  animations: [fadeInOutAnimation],
})
export class BoardComponent implements OnInit {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  readonly Z_INDEXES = Z_INDEXES;
  readonly defaultCardSize = 64;

  @Input({ required: true }) set playerGameView(
    playerGameView: PlayerGameView
  ) {
    // Hacky change detection to update lanes
    playerGameView.Lanes = [...playerGameView.Lanes];
    const x = JSON.stringify(playerGameView);
    const y = JSON.parse(x) as PlayerGameView;
    this.playerGameView$.next(y);
  }
  @Input() initialPlaceMultipleCardAttempt: PlaceCardAttempt | null;
  @Input() isPlacingMultipleCards: boolean | null;
  @Input() transparentTiles = false;
  @Input({ required: true }) isPlayersTurn = false;
  @Input() selectedPosition: CardPosition | null = null;
  @Input() set selectedCard(selectedCard: Card | null) {
    this.selectedCard$.next(selectedCard);
  }
  @Input({ required: true }) set placeMultipleCards(
    placeMultipleCards: Card[] | null
  ) {
    this.placeMultipleCards$.next(placeMultipleCards);
  }
  @Input({ required: true }) set placeMultipleCardsHand(
    placeMultipleCardsHand: Card[] | null
  ) {
    this.placeMultipleCardsHand$.next(placeMultipleCardsHand);
  }

  @Output() placeCardAttempted: EventEmitter<PlaceCardAttempt> =
    new EventEmitter();
  @Output() setPlaceMultipleCards = new EventEmitter<Card[]>();
  @Output() setPlaceMultipleCardsHand = new EventEmitter<Card[]>();
  @Output() positionClicked = new EventEmitter<CardPosition>();
  @Output() placeMultipleCardsListClicked = new EventEmitter<void>();

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  readonly playerGameView$ = new BehaviorSubject<PlayerGameView | null>(null);
  readonly placeMultipleCards$ = new BehaviorSubject<Card[] | null>(null);
  readonly placeMultipleCardsHand$ = new BehaviorSubject<Card[] | null>(null);
  readonly selectedCard$ = new BehaviorSubject<Card | null>(null);

  readonly positionsWithValidMoves$: Observable<CardPosition[]> = combineLatest(
    [this.playerGameView$, this.selectedCard$]
  ).pipe(
    map(
      ([playerGameView, selectedCard]) =>
        playerGameView?.CandidateMoves?.filter(
          (candidateMove) =>
            candidateMove.Move.PlaceCardAttempts.length === 1 &&
            candidateMove.IsValid &&
            candidateMove.Move.PlaceCardAttempts[0].Card.Kind ===
              selectedCard?.Kind &&
            candidateMove.Move.PlaceCardAttempts[0].Card.Suit ===
              selectedCard?.Suit
        ).map((candidateMove) => ({
          RowIndex: candidateMove.Move.PlaceCardAttempts[0].TargetRowIndex,
          LaneIndex: candidateMove.Move.PlaceCardAttempts[0].TargetLaneIndex,
        })) ?? []
    )
  );

  readonly laneIndexesToValidMoveRowIndexes$ =
    this.positionsWithValidMoves$.pipe(
      map((positionsWithValidMoves) => {
        const laneIndexesToValidMoveRowIndexes = new Map<number, Set<number>>();

        for (const { LaneIndex, RowIndex } of positionsWithValidMoves) {
          const existingPositions =
            laneIndexesToValidMoveRowIndexes.get(LaneIndex) ??
            new Set<number>();
          existingPositions.add(RowIndex);
          laneIndexesToValidMoveRowIndexes.set(LaneIndex, existingPositions);
        }

        return laneIndexesToValidMoveRowIndexes;
      })
    );

  ngOnInit() {
    // [LAN-460]: Recalculate card size for posterity.
    // Sometimes the card size changes while switching tabs.
    this.#responsiveSizeService.recalculateCardSize();
  }

  onPlaceCardAttempted(placeCardAttempt: PlaceCardAttempt) {
    this.placeCardAttempted.emit(placeCardAttempt);
  }

  placedMultipleCards(cards: Card[]) {
    this.setPlaceMultipleCards.emit(cards);
  }

  placedMultipleCardsHand(cards: Card[]) {
    this.setPlaceMultipleCardsHand.emit(cards);
  }

  onPositionClicked(laneIndex: number, rowIndex: number) {
    this.positionClicked.emit({
      LaneIndex: laneIndex,
      RowIndex: rowIndex,
    });
  }

  onPlaceMultipleCardsListClicked() {
    this.placeMultipleCardsListClicked.emit();
  }
}
