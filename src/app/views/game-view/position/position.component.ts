import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardModel } from 'src/app/models/card.model';
import { MoveModel } from 'src/app/models/move.model';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})
export class PositionComponent implements OnInit {
  @Input() laneIndex: number;
  @Input() rowIndex: number;
  @Output() makeMove: EventEmitter<MoveModel> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  drop(event: CdkDragDrop<string, { suit: string; kind: string }>) {
    const Suit = event.item.data.suit as string;
    const Kind = event.item.data.kind as string;
    const card: CardModel = { Suit, Kind };

    const move: MoveModel = {
      card,
      targetLaneIndex: this.laneIndex,
      targetRowIndex: this.rowIndex,
    };

    this.makeMove.emit(move);
  }

  isMoveValid(event: CdkDrag<{ suit: string; kind: string }>) {
    return true;
  }
}
