import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { GameState } from '../../../state/game.state';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerGameStateModel } from '../../../models/player-game-state-model';
import { CardModel } from '../../../models/card.model';
import { PlaceCardAttemptModel } from '../../../models/place-card-attempt.model';

// TODO:
// 1) Calculate which row indexes are visible (Host and Guest views).
// 2) Card that user placed should be stored in memory in this component and the badge should reflect that it's number 1.
// 3) Angular material - drag drop list - vertical - above the lane with the full opacity cards that were already played

@Component({
  selector: 'app-place-multiple-cards-lane',
  templateUrl: './place-multiple-cards-lane.component.html',
  styleUrls: ['./place-multiple-cards-lane.component.css'],
})
export class PlaceMultipleCardsLaneComponent {
  @Select(GameState.gameData)
  playerGameState$!: Observable<PlayerGameStateModel>;

  @Select(GameState.initialMultiplePlaceCardAttempt)
  initialMultiplePlaceCardAttempt$!: Observable<PlaceCardAttemptModel | null>;

  orderedExistingCards$ = combineLatest([
    this.playerGameState$,
    this.initialMultiplePlaceCardAttempt$,
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

  constructor() {}

  getCardImageFileName(card: CardModel) {
    const { Suit, Kind } = card;
    return `card_${Suit.toLowerCase()}_${Kind.toLowerCase()}.png`;
  }
}
