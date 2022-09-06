import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardModel } from '../../../models/card.model';
import { KindModel } from '../../../models/kind.model';
import { MoveModel } from '../../../models/move.model';
import { PlayerOrNoneModel } from '../../../models/player-or-none-model';
import { SuitModel } from '../../../models/suit.model';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})
export class PositionComponent implements OnInit {
  @Input() laneIndex: number;
  @Input() rowIndex: number;
  @Output() attemptMove: EventEmitter<MoveModel> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  drop(event: CdkDragDrop<string, { suit: string; kind: string }>) {
    const Suit = event.item.data.suit as SuitModel;
    const Kind = event.item.data.kind as KindModel;
    const PlayedBy = PlayerOrNoneModel.None;

    const Card: CardModel = {
      Suit,
      Kind,
      PlayedBy,
    };

    const placeCardAttempt = {
      Card,
      TargetLaneIndex: this.laneIndex,
      TargetRowIndex: this.rowIndex,
    };

    const move: MoveModel = {
      PlaceCardAttempts: [placeCardAttempt],
    };

    this.attemptMove.emit(move);
  }
}
