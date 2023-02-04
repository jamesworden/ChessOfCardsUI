import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CardModel } from 'projects/client/src/app/models/card.model';
import { getCardImageFileName as getCardImageFileNameFn } from '../../../../util/get-asset-file-names';
import { Observable } from 'rxjs';
import { GameState } from 'projects/client/src/app/state/game.state';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.css'],
})
export class PlayerHandComponent {
  @Input() isPlacingMultipleCards = false;
  @Input() isHost: boolean;
  @Input() cards: CardModel[];
  @Input() cardSize: number;
  @Input() disabled: boolean;
  @Output() cardDropped = new EventEmitter<CdkDragDrop<string>>();

  @Select(GameState.placeMultipleCardsHand)
  placeMultipleCardsHand$!: Observable<CardModel[] | null>;

  getCardImageFileName = getCardImageFileNameFn;

  constructor() {}

  onCardDrop(event: CdkDragDrop<string>) {
    this.cardDropped.emit(event);
  }
}
