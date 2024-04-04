import { DestroyRef, Injectable, OnInit, inject } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { Breakpoint } from '../../../models/breakpoint.model';
import { DEFAULT_CARD_SIZE } from '../constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const cardRatio = {
  x: 6,
  y: 12,
};

const sidebarWidth = 48;

@Injectable({
  providedIn: 'root',
})
export class ResponsiveSizeService implements OnInit {
  readonly #destroyRef = inject(DestroyRef);

  private readonly _windowDimensions$: BehaviorSubject<[number, number]> =
    new BehaviorSubject([window.innerWidth, window.innerHeight]);
  public readonly windowDimensions$ = this._windowDimensions$.asObservable();

  private readonly _cardSize$ = new BehaviorSubject(DEFAULT_CARD_SIZE);
  public readonly cardSize$ = this._cardSize$.asObservable();

  private readonly _breakpoint$ = new BehaviorSubject<Breakpoint>(
    Breakpoint.Mobile
  );
  public readonly breakpoint$ = this._breakpoint$.asObservable();

  private readonly _windowResize$ = fromEvent(window, 'resize');

  ngOnInit() {
    this._windowResize$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this._windowDimensions$.next([window.innerWidth, window.innerHeight]);
      });
    this._windowDimensions$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(([width, height]) => {
        width -= sidebarWidth;
        const maxCardWidth = width / cardRatio.x;
        const maxCardHeight = height / cardRatio.y;
        const cardSize = Math.min(maxCardWidth, maxCardHeight);

        this._cardSize$.next(cardSize);
      });
    this._windowDimensions$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(([width]) => {
        if (width < 700) {
          this._breakpoint$.next(Breakpoint.Mobile);
        } else if (width < 1000) {
          this._breakpoint$.next(Breakpoint.Tablet);
        } else {
          this._breakpoint$.next(Breakpoint.Desktop);
        }
      });
  }
}
