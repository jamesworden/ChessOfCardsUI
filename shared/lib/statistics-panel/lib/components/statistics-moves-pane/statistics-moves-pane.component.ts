import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MoveNotation } from '@shared/logic';
import { PlayerOrNone } from '@shared/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'statistics-moves-pane',
  templateUrl: './statistics-moves-pane.component.html',
  styleUrl: './statistics-moves-pane.component.scss',
})
export class StatisticsMovesPaneComponent {
  @Input({ required: true }) isHost: boolean;
  @Input() moveNotations: MoveNotation[] = [];
  @Input() set selectedMoveNotationIndex(
    selectedMoveNotationIndex: number | null
  ) {
    this.selectedMoveNotationIndex$.next(selectedMoveNotationIndex);
  }

  @Output() moveNotationSelected = new EventEmitter<number>();

  readonly PlayerOrNone = PlayerOrNone;

  readonly selectedMoveNotationIndex$ = new BehaviorSubject<number | null>(
    null
  );

  selectMoveNotation(moveSelectedIndex: number) {
    this.moveNotationSelected.emit(moveSelectedIndex);
  }

  selectFirst() {
    this.moveNotationSelected.emit(0);
  }

  selectPrevious() {
    const current = this.selectedMoveNotationIndex$.getValue();
    if (!current) {
      return;
    }
    this.moveNotationSelected.emit(current - 1);
  }

  selectNext() {
    const current = this.selectedMoveNotationIndex$.getValue();
    if (current === null || current === this.moveNotations.length - 1) {
      return;
    }
    this.moveNotationSelected.emit(current + 1);
  }

  selectLast() {
    this.moveNotationSelected.emit(this.moveNotations.length - 1);
  }
}
