import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
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
export class ResponsiveSizeService {
  readonly #destroyRef = inject(DestroyRef);

  private readonly _windowDimensions$: BehaviorSubject<[number, number]> =
    new BehaviorSubject([window.innerWidth, window.innerHeight]);
  public readonly windowDimensions$ = this._windowDimensions$.asObservable();

  private readonly _cardSize$ = new BehaviorSubject(DEFAULT_CARD_SIZE);
  public readonly cardSize$ = this._cardSize$.asObservable();

  private readonly _windowResize$ = fromEvent(window, 'resize');

  constructor() {
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
  }
}
