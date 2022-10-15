import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GameState } from '../../../state/game.state';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerGameStateModel } from '../../../models/player-game-state-model';
import { CardModel } from '../../../models/card.model';
import { PlaceCardAttemptModel } from '../../../models/place-card-attempt.model';
import { CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { KindModel } from '../../../models/kind.model';
import { cardExistsInArray } from '../logic/card-exists-in-array';
import { getIndexOfCardInArray } from '../logic/get-index-of-card-in-array';
import {
  SetPlaceMultipleCards,
  SetPlaceMultipleCardsHand,
} from '../../../actions/game.actions';
import { addCardToArray } from '../logic/add-card-to-array';
import { removeCardFromArray } from '../logic/remove-card-from-array';

@Component({
  selector: 'app-place-multiple-cards-lane',
  templateUrl: './place-multiple-cards-lane.component.html',
  styleUrls: ['./place-multiple-cards-lane.component.css'],
})
export class PlaceMultipleCardsLaneComponent {
  @Select(GameState.gameData)
  playerGameState$!: Observable<PlayerGameStateModel>;

  @Select(GameState.initialPlaceMultipleCardAttempt)
  initialPlaceMultipleCardAttempt$!: Observable<PlaceCardAttemptModel | null>;

  @Select(GameState.placeMultipleCards)
  placeMultipleCards$!: Observable<CardModel[] | null>;

  previouslyCapturedCards$ = combineLatest([
    this.playerGameState$,
    this.initialPlaceMultipleCardAttempt$,
  ]).pipe(
    map(([playerGameState, initialMultiplePlaceCardAttempt]) => {
      if (!initialMultiplePlaceCardAttempt) {
        return [];
      }

      const { TargetLaneIndex, TargetRowIndex } =
        initialMultiplePlaceCardAttempt;
      const lane = playerGameState.Lanes[TargetLaneIndex];
      const cards: CardModel[] = [];

      if (playerGameState.IsHost) {
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
    })
  );

  constructor(private store: Store) {}

  getCardImageFileName(card: CardModel) {
    const { Suit, Kind } = card;
    return `card_${Suit.toLowerCase()}_${Kind.toLowerCase()}.png`;
  }

  /**
   * Angular is annoying: this.memberVariable returns undefined when passing the predicate
   * function in itself. We wrap the predicate in this one so we can access the card attempt.
   */
  getEnterPredicate(initialPlaceCardAttempt: PlaceCardAttemptModel | null) {
    return function (dragData: CdkDrag<CardModel>) {
      if (!initialPlaceCardAttempt) {
        return false;
      }

      const kindOfAttemptedCard = dragData.data.Kind as KindModel;
      const { Kind: kindOfInitialCard } = initialPlaceCardAttempt.Card;

      return kindOfAttemptedCard == kindOfInitialCard;
    };
  }

  drop(event: CdkDragDrop<string, CardModel>) {
    const { currentIndex: targetIndex, item } = event;
    const card = item.data;

    const placeMultipleCards = this.store.selectSnapshot(
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
    placeMultipleCards: CardModel[],
    card: CardModel,
    targetIndex: number
  ) {
    const originalIndex = getIndexOfCardInArray(card, placeMultipleCards);

    if (originalIndex === null) {
      return;
    }

    moveItemInArray(placeMultipleCards, originalIndex, targetIndex);
    this.store.dispatch(new SetPlaceMultipleCards(placeMultipleCards));
    return;
  }

  private addPlaceMultipleCardFromHand(
    placeMultipleCards: CardModel[],
    card: CardModel,
    targetIndex: number
  ) {
    addCardToArray(card, placeMultipleCards, targetIndex);

    let placeMultipleCardsHand = this.store.selectSnapshot(
      GameState.placeMultipleCardsHand
    );

    if (!placeMultipleCardsHand) {
      return;
    }

    placeMultipleCardsHand = removeCardFromArray(card, placeMultipleCardsHand);

    this.store.dispatch(new SetPlaceMultipleCards(placeMultipleCards));
    this.store.dispatch(new SetPlaceMultipleCardsHand(placeMultipleCardsHand));
  }
}
