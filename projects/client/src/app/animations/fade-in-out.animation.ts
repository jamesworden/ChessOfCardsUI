import {
  style,
  animate,
  transition,
  trigger,
  state,
} from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOut', [
  state('*', style({ position: 'absolute' })),
  transition(':enter', [
    style({ opacity: 0 }),
    animate(100, style({ opacity: 1 })),
  ]),
  transition(':leave', [animate(100, style({ opacity: 0 }))]),
]);
