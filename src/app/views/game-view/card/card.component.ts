import { DragRef, Point } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() cardImageFileName: string;

  constructor() {}

  onDragReleased() {
    // TODO: Check if target pos is empty space or card and if they can play that move or not
    // and then call a service to play that move?
  }

  constrainPosition(point: Point, dragRef: DragRef): Point {
    // TODO: constrain to board area

    return {
      x: 0,
      y: 0,
    };
  }
}
