import { Component, inject, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GameState } from '../../../../state/game.state';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  SetPlaceMultipleCards,
  SetPlaceMultipleCardsHand,
} from '../../../../actions/game.actions';
import { ResponsiveSizeService } from '@shared/game';
import { Z_INDEXES } from '../../z-indexes';
import { getPseudoPositions } from './get-pseudo-positions';
import { getPreviouslyCapturedCards } from './get-previously-captured-cards';
import { Card, Kind, PlaceCardAttempt, PlayerGameView } from '@shared/models';
import {
  addCardToArray,
  cardExistsInArray,
  getIndexOfCardInArray,
  removeCardFromArray,
} from '@shared/logic';

/*
 * 4 times the height of the card as that's the most number of place multiple cards
 * a user can place; And one additional factor for extra space.
 */
const MIN_CARD_HEIGHT_FACTOR = 5;

@Component({
  selector: 'app-place-multiple-cards-lane',
  templateUrl: './place-multiple-cards-lane.component.html',
  styleUrls: ['./place-multiple-cards-lane.component.scss'],
})
export class PlaceMultipleCardsLaneComponent {
  readonly #store = inject(Store);
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  readonly MIN_CARD_HEIGHT_FACTOR = MIN_CARD_HEIGHT_FACTOR;
  readonly Z_INDEXES = Z_INDEXES;

  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView | null>;

  @Select(GameState.initialPlaceMultipleCardAttempt)
  initialPlaceMultipleCardAttempt$!: Observable<PlaceCardAttempt | null>;

  @Select(GameState.placeMultipleCards)
  placeMultipleCards$!: Observable<Card[] | null>;

  @Input({ required: true }) isHost: boolean;

  readonly cardSize$ = this.#responsiveSizeService.cardSize$;

  readonly isHost$ = new BehaviorSubject(false);

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

    const placeMultipleCards = this.#store.selectSnapshot(
      GameState.placeMultipleCards
    );

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
    this.#store.dispatch(new SetPlaceMultipleCards(placeMultipleCards));
    return;
  }

  private addPlaceMultipleCardFromHand(
    placeMultipleCards: Card[],
    card: Card,
    targetIndex: number
  ) {
    addCardToArray(card, placeMultipleCards, targetIndex);

    let placeMultipleCardsHand = this.#store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (!placeMultipleCardsHand) {
      return;
    }

    removeCardFromArray(card, placeMultipleCardsHand);

    this.#store.dispatch(new SetPlaceMultipleCards(placeMultipleCards));
    this.#store.dispatch(new SetPlaceMultipleCardsHand(placeMultipleCardsHand));
  }
}
