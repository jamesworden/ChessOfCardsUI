import { Component, OnDestroy, OnInit, inject, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GameState } from '../../../../state/game.state';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerGameView } from '../../../../models/player-game-view.model';
import { Card } from '../../../../models/card.model';
import { PlaceCardAttempt } from '../../../../models/place-card-attempt.model';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Kind } from '../../../../models/kind.model';
import { cardExistsInArray } from '../../logic/card-exists-in-array';
import { getIndexOfCardInArray } from '../../logic/get-index-of-card-in-array';
import {
  SetPlaceMultipleCards,
  SetPlaceMultipleCardsHand,
} from '../../../../actions/game.actions';
import { addCardToArray } from '../../logic/add-card-to-array';
import { removeCardFromArray } from '../../logic/remove-card-from-array';
import { ResponsiveSizeService } from '../../services/responsive-size.service';
import { Z_INDEXES } from '../../z-indexes';
import { SubscriptionManager } from 'projects/client/src/app/util/subscription-manager';
import { getDefaultBackgroundClasses } from '../../logic/get-background-class';

interface PseudoPosition {
  backgroundClass: string;
  textClass: string;
  rowIndex: number;
}

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
export class PlaceMultipleCardsLaneComponent implements OnDestroy, OnInit {
  private readonly sm = new SubscriptionManager();
  readonly #store = inject(Store);
  readonly #responsiveSizeService = inject(ResponsiveSizeService);

  @Select(GameState.playerGameView)
  playerGameView$!: Observable<PlayerGameView | null>;

  @Select(GameState.initialPlaceMultipleCardAttempt)
  initialPlaceMultipleCardAttempt$!: Observable<PlaceCardAttempt | null>;

  @Select(GameState.placeMultipleCards)
  placeMultipleCards$!: Observable<Card[] | null>;

  @Input({ required: true }) isHost: boolean;

  cardSize$ = this.#responsiveSizeService.cardSize$;

  MIN_CARD_HEIGHT_FACTOR = MIN_CARD_HEIGHT_FACTOR;
  Z_INDEXES = Z_INDEXES;
  pseudoPositions: PseudoPosition[];

  previouslyCapturedCards$ = combineLatest([
    this.playerGameView$,
    this.initialPlaceMultipleCardAttempt$,
  ]).pipe(
    map(([playerGameView, initialPlaceMultipleCardAttempt]) =>
      this.getPreviouslyCapturedCards(
        initialPlaceMultipleCardAttempt,
        playerGameView
      )
    )
  );

  ngOnInit() {
    this.initPseudoPositions();
  }

  ngOnDestroy() {
    this.sm.unsubscribe();
  }

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

  private initPseudoPositions() {
    const pseudoPositions: PseudoPosition[] = [];

    for (
      let rowIndex = this.isHost ? 0 : 6;
      this.isHost ? rowIndex <= 6 : rowIndex >= 0;
      this.isHost ? rowIndex++ : rowIndex--
    ) {
      const initialPlaceCardAttempt = this.#store.selectSnapshot(
        GameState.initialPlaceMultipleCardAttempt
      )!;
      const { TargetLaneIndex } = initialPlaceCardAttempt;

      const { backgroundClass, textClass } = getDefaultBackgroundClasses(
        TargetLaneIndex,
        rowIndex
      );

      pseudoPositions.push({
        backgroundClass,
        textClass,
        rowIndex,
      });
    }

    this.pseudoPositions = pseudoPositions;
  }

  private getPreviouslyCapturedCards(
    initialMultiplePlaceCardAttempt: PlaceCardAttempt | null,
    playerGameView: PlayerGameView | null
  ) {
    if (!initialMultiplePlaceCardAttempt || !playerGameView) {
      return [];
    }

    const { TargetLaneIndex, TargetRowIndex } = initialMultiplePlaceCardAttempt;
    const lane = playerGameView.Lanes[TargetLaneIndex];
    const cards: Card[] = [];

    if (playerGameView.IsHost) {
      for (let i = 0; i < TargetRowIndex; i++) {
        const row = lane.Rows[i];
        const topCard = row[row.length - 1];
        cards.push(topCard);
      }
    } else {
      for (let i = 6; i > TargetRowIndex; i--) {
        const row = lane.Rows[i];
        const topCard = row[row.length - 1];
        cards.push(topCard);
      }
    }

    return cards;
  }
}
