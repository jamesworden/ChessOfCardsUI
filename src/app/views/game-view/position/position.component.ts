import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardModel } from 'src/app/models/card.model';
import { KindModel } from 'src/app/models/kind.model';
import { MoveModel } from 'src/app/models/move.model';
import { PlayerOrNoneModel } from 'src/app/models/player-or-none-model';
import { SuitModel } from 'src/app/models/suit.model';

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
