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

  public windowDimensions$: BehaviorSubject<[number, number]> =
    new BehaviorSubject([window.innerWidth, window.innerHeight]);
  public cardSize$ = new BehaviorSubject(DEFAULT_CARD_SIZE);
  public breakpoint$ = new BehaviorSubject<Breakpoint>(Breakpoint.Mobile);

  constructor() {
    this.sm.add(
      fromEvent(window, 'resize').subscribe(() => {
        this.windowDimensions$.next([window.innerWidth, window.innerHeight]);
      })
    );
    this.sm.add(
      this.windowDimensions$.subscribe(([width, height]) => {
        width -= 48; // Width of sidebar
        // 6 Width to 11 Height ratio.
        const maxCardWidth = width / 6;
        const maxCardHeight = height / 11;
        const cardSize = Math.min(maxCardWidth, maxCardHeight);

        this.cardSize$.next(cardSize);
      })
    );
    this.sm.add(
      this.windowDimensions$.subscribe(([width]) => {
        if (width < 450) {
          this.breakpoint$.next(Breakpoint.Mobile);
        } else if (width < 1000) {
          this.breakpoint$.next(Breakpoint.Tablet);
        } else {
          this.breakpoint$.next(Breakpoint.Desktop);
        }
      })
    );
  }
}
