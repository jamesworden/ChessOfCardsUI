import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { MoveNotation } from '@shared/logic';
import { PlayerOrNone } from '@shared/models';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Select } from '@ngxs/store';
import { GameState } from '@shared/game';
import { pairwise, filter } from 'rxjs/operators';

@Component({
  selector: 'statistics-moves-pane',
  templateUrl: './statistics-moves-pane.component.html',
  styleUrl: './statistics-moves-pane.component.scss',
})
export class StatisticsMovesPaneComponent {
  readonly #destroyRef = inject(DestroyRef);

  @Input() set moveNotations(moveNotations: MoveNotation[]) {
    this.moveNotations$.next(moveNotations);
  }
  @Input() set selectedNotationIndex(selectedNotationIndex: number | null) {
    this.selectedNotationIndex$.next(selectedNotationIndex);
  }

  @Output() moveNotationSelected = new EventEmitter<number>();

  @Select(GameState.gameIsActive)
  gameIsActive$: Observable<boolean>;

  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef;

  readonly PlayerOrNone = PlayerOrNone;

  readonly moveNotations$ = new BehaviorSubject<MoveNotation[]>([]);
  readonly selectedNotationIndex$ = new BehaviorSubject<number | null>(null);

  hasInitiallyScrolledToBottom = false;

  ngOnInit() {
    this.moveNotations$
      .pipe(
        pairwise(),
        filter(([prev, curr]) => prev && curr && prev.length !== curr.length),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe(([_, moveNotations]) => {
        // Timeout gives time for the last move notation vertical space to load before scrolling
        setTimeout(() => {
          if (moveNotations && moveNotations.length > 0) {
            if (!this.hasInitiallyScrolledToBottom) {
              this.scrollToBottom('instant');
              this.hasInitiallyScrolledToBottom = true;
            } else {
              this.scrollToBottom('smooth');
            }
          }
        });
      });
  }

  selectMoveNotation(moveSelectedIndex: number) {
    this.moveNotationSelected.emit(moveSelectedIndex);
  }

  selectFirst() {
    this.moveNotationSelected.emit(0);
  }

  selectPrevious() {
    const current = this.selectedNotationIndex$.getValue();
    if (!current) {
      return;
    }
    this.moveNotationSelected.emit(current - 1);
  }

  selectNext() {
    const current = this.selectedNotationIndex$.getValue();
    if (
      current === null ||
      current === this.moveNotations$.getValue().length - 1
    ) {
      return;
    }
    this.moveNotationSelected.emit(current + 1);
  }

  selectLast() {
    this.moveNotationSelected.emit(this.moveNotations$.getValue().length - 1);
  }

  scrollToBottom(scrollBehavior: ScrollBehavior) {
    const container = this.scrollContainer?.nativeElement;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: scrollBehavior,
      });
    }
  }

  scrollMoveNotationIntoView(moveNotationIndex: number) {
    const scrollContainer = this.scrollContainer.nativeElement as HTMLElement;
    if (!scrollContainer) {
      return;
    }

    const rows = scrollContainer.getElementsByClassName('move-notation-row');
    const row = rows[moveNotationIndex];
    if (!row) {
      return;
    }

    row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
