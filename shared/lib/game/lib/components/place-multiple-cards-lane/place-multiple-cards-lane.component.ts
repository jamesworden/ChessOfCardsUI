import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResponsiveSizeService } from '@shared/game';
import { getPseudoPositions } from './get-pseudo-positions';
import { getPreviouslyCapturedCards } from './get-previously-captured-cards';
import { Card, Kind, PlaceCardAttempt, PlayerGameView } from '@shared/models';
import {
  addCardToArray,
  cardExistsInArray,
  getIndexOfCardInArray,
  removeCardFromArray,
} from '@shared/logic';
import { Z_INDEXES } from '@shared/constants';

/*
 * 4 times the height of the card as that's the most number of place multiple cards
 * a user can place; And one additional factor for extra space.
 */
const MIN_CARD_HEIGHT_FACTOR = 5;

@Component({
  selector: 'game-place-multiple-cards-lane',
  templateUrl: './place-multiple-cards-lane.component.html',
  styleUrls: ['./place-multiple-cards-lane.component.scss'],
})
export class PlaceMultipleCardsLaneComponent {
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  readonly MIN_CARD_HEIGHT_FACTOR = MIN_CARD_HEIGHT_FACTOR;
  readonly Z_INDEXES = Z_INDEXES;

  @Input({ required: true }) isHost: boolean;
  @Input() isMakingMove: Card | null = null;
  @Input({ required: true }) set playerGameView(
    playerGameView: PlayerGameView | null
  ) {
    this.playerGameView$.next(playerGameView);
  }
  @Input({ required: true }) set initialPlaceMultipleCardAttempt(
    initialPlaceMultipleCardAttempt: PlaceCardAttempt | null
  ) {
    this.initialPlaceMultipleCardAttempt$.next(initialPlaceMultipleCardAttempt);
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

  @Output() setPlaceMultipleCards = new EventEmitter<Card[]>();
  @Output() setPlaceMultipleCardsHand = new EventEmitter<Card[]>();
  @Output() listClicked: EventEmitter<void> = new EventEmitter();

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  readonly isHost$ = new BehaviorSubject(false);
  readonly playerGameView$ = new BehaviorSubject<PlayerGameView | null>(null);
  readonly initialPlaceMultipleCardAttempt$ =
    new BehaviorSubject<PlaceCardAttempt | null>(null);
  readonly placeMultipleCards$ = new BehaviorSubject<Card[] | null>(null);
  readonly placeMultipleCardsHand$ = new BehaviorSubject<Card[] | null>(null);

  readonly previouslyCapturedCards$ = combineLatest([
    this.playerGameView$,
    this.initialPlaceMultipleCardAttempt$,
  ]).pipe(
    map(([playerGameView, initialPlaceMultipleCardAttempt]) =>
      getPreviouslyCapturedCards(
        initialPlaceMultipleCardAttempt,
        playerGameView
      )
    )
  );

  readonly pseudoPositions$ = combineLatest([
    this.isHost$,
    this.initialPlaceMultipleCardAttempt$,
  ]).pipe(
    map(([isHost, initialPlaceCardAttempt]) =>
      initialPlaceCardAttempt
        ? getPseudoPositions(isHost, initialPlaceCardAttempt)
        : []
    )
  );

  /**
   * Angular is annoying: this.memberVariable returns undefined when passing the predicate
   * function in itself. We wrap the predicate in this one so we can access the card attempt.
   */
  getEnterPredicate(initialPlaceCardAttempt: PlaceCardAttempt | null) {
    return function (dragData: CdkDrag<Card>) {
      if (!initialPlaceCardAttempt) {
        return false;
      }

      const kindOfAttemptedCard = dragData.data.Kind as Kind;
      const { Kind: kindOfInitialCard } = initialPlaceCardAttempt.Card;

      return kindOfAttemptedCard == kindOfInitialCard;
    };
  }

  onCardPlaced(event: CdkDragDrop<string, Card>) {
    const { currentIndex: targetIndex, item } = event;
    const card = item.data;

    const placeMultipleCards = this.placeMultipleCards$.getValue();

    if (!placeMultipleCards) {
      return;
    }

    cardExistsInArray(card, placeMultipleCards)
      ? this.rearrangePlaceMultipleCards(placeMultipleCards, card, targetIndex)
      : this.addPlaceMultipleCardFromHand(
          placeMultipleCards,
          card,
          targetIndex
        );
  }

  private rearrangePlaceMultipleCards(
    placeMultipleCards: Card[],
    card: Card,
    targetIndex: number
  ) {
    const originalIndex = getIndexOfCardInArray(card, placeMultipleCards);

    if (originalIndex === null) {
      return;
    }

    moveItemInArray(placeMultipleCards, originalIndex, targetIndex);
    this.setPlaceMultipleCards.emit(placeMultipleCards);
    return;
  }

  private addPlaceMultipleCardFromHand(
    placeMultipleCards: Card[],
    card: Card,
    targetIndex: number
  ) {
    addCardToArray(card, placeMultipleCards, targetIndex);

    let placeMultipleCardsHand = this.placeMultipleCardsHand$.getValue();

    if (!placeMultipleCardsHand) {
      return;
    }

    removeCardFromArray(card, placeMultipleCardsHand);

    this.setPlaceMultipleCards.emit(placeMultipleCards);
    this.setPlaceMultipleCardsHand.emit(placeMultipleCardsHand);
  }

  onListClicked() {
    this.listClicked.emit();
  }
}
