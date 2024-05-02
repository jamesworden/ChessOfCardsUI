import { Component, Input } from '@angular/core';
import { MoveNotation } from '@shared/logic';

@Component({
  selector: 'statistics-moves-pane',
  templateUrl: './statistics-moves-pane.component.html',
  styleUrl: './statistics-moves-pane.component.scss',
})
export class StatisticsMovesPaneComponent {
  @Input() moveNotations: MoveNotation[] = [];
}
