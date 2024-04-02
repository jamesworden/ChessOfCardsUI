import { Injectable } from '@angular/core';
import { SubscriptionManager } from '../../../util/subscription-manager';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { Breakpoint } from '../../../models/breakpoint.model';
import { DEFAULT_CARD_SIZE } from '../constants';

const cardRatio = {
  x: 6,
  y: 12,
};

const sidebarWidth = 48;

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
        width -= sidebarWidth;
        const maxCardWidth = width / cardRatio.x;
        const maxCardHeight = height / cardRatio.y;
        const cardSize = Math.min(maxCardWidth, maxCardHeight);

        this._cardSize$.next(cardSize);
      })
    );
    this.sm.add(
      this._windowDimensions$.subscribe(([width]) => {
        if (width < 700) {
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
