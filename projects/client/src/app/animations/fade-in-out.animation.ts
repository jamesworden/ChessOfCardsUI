import {
  trigger,
  transition,
  style,
  animate,
  query,
  animateChild,
} from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(100, style({ opacity: 1 })),
    query('@*', animateChild(), { optional: true }),
  ]),
  transition(':leave', [
    query('@*', animateChild(), { optional: true }),
    animate(100, style({ opacity: 0 })),
  ]),
]);
