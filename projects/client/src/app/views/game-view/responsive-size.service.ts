import { Injectable } from '@angular/core';
import { SubscriptionManager } from '../../util/subscription-manager';
import { BehaviorSubject, fromEvent } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveSizeService {
  private sm = new SubscriptionManager();

  public windowDimensions$: BehaviorSubject<[number, number]> =
    new BehaviorSubject([window.innerWidth, window.innerHeight]);
  public cardSize$: BehaviorSubject<number> = new BehaviorSubject(64);

  constructor() {
    this.sm.add(
      fromEvent(window, 'resize').subscribe(() => {
        this.windowDimensions$.next([window.innerWidth, window.innerHeight]);
      })
    );
    this.sm.add(
      this.windowDimensions$.subscribe(([width, height]) => {
        const excludingBoardHeightBuffer = 200;
        const effectiveHeight = height - excludingBoardHeightBuffer;
        const maxCardWidth = width / 6; // 5 cards width + 1 card for gutter buffer
        const maxCardHeight = effectiveHeight / 7;
        const cardSize = Math.min(maxCardWidth, maxCardHeight);

        this.cardSize$.next(cardSize);
      })
    );
  }
}
