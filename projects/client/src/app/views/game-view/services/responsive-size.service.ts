import { Injectable } from '@angular/core';
import { SubscriptionManager } from '../../../util/subscription-manager';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { Breakpoint } from '../../../models/breakpoint.model';
import { DEFAULT_CARD_SIZE } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveSizeService {
  private sm = new SubscriptionManager();

  private _windowDimensions$: BehaviorSubject<[number, number]> =
    new BehaviorSubject([window.innerWidth, window.innerHeight]);
  public windowDimensions$ = this._windowDimensions$.asObservable();

  private _cardSize$ = new BehaviorSubject(DEFAULT_CARD_SIZE);
  public cardSize$ = this._cardSize$.asObservable();

  private _breakpoint$ = new BehaviorSubject<Breakpoint>(Breakpoint.Mobile);
  public breakpoint$ = this._breakpoint$.asObservable();

  constructor() {
    this.sm.add(
      fromEvent(window, 'resize').subscribe(() => {
        this._windowDimensions$.next([window.innerWidth, window.innerHeight]);
      })
    );
    this.sm.add(
      this._windowDimensions$.subscribe(([width, height]) => {
        width -= 48; // Width of sidebar
        // 6 Width to 11 Height ratio.
        const maxCardWidth = width / 6;
        const maxCardHeight = height / 11;
        const cardSize = Math.min(maxCardWidth, maxCardHeight);

        this._cardSize$.next(cardSize);
      })
    );
    this.sm.add(
      this._windowDimensions$.subscribe(([width]) => {
        if (width < 500) {
          this._breakpoint$.next(Breakpoint.Mobile);
        } else if (width < 1000) {
          this._breakpoint$.next(Breakpoint.Tablet);
        } else {
          this._breakpoint$.next(Breakpoint.Desktop);
        }
      })
    );
  }
}
