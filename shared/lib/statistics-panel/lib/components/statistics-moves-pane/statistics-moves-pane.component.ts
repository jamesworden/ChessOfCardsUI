import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { MoveNotation } from '@shared/logic';
import { PlayerOrNone } from '@shared/models';
import { BehaviorSubject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'statistics-moves-pane',
  templateUrl: './statistics-moves-pane.component.html',
  styleUrl: './statistics-moves-pane.component.scss',
})
export class StatisticsMovesPaneComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);

  @Input({ required: true }) isHost: boolean;
  @Input() moveNotations: MoveNotation[] = [];
  @Input() set selectedMoveNotationIndex(
    selectedMoveNotationIndex: number | null
  ) {
    this.selectedMoveNotationIndex$.next(selectedMoveNotationIndex);
  }

  @Output() moveNotationSelected = new EventEmitter<number>();

  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef;

  readonly PlayerOrNone = PlayerOrNone;

  readonly selectedMoveNotationIndex$ = new BehaviorSubject<number | null>(
    null
  );

  ngOnInit() {
    this.selectedMoveNotationIndex$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        if (this.scrollContainer) {
          this.scrollContainer.nativeElement.scrollTop =
            this.scrollContainer.nativeElement.scrollHeight;
        }
      });
  }

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
