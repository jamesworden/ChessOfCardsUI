import {
  trigger,
  transition,
  style,
  animate,
  query,
  animateChild,
} from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(
    ':enter',
    [
      style({ opacity: 0 }),
      animate('{{ duration }}ms', style({ opacity: '{{ endOpacity }}' })),
      query('@*', animateChild(), { optional: true }),
    ],
    {
      params: {
        endOpacity: '1',
        duration: 100,
      },
    }
  ),
  transition(
    ':leave',
    [
      query('@*', animateChild(), { optional: true }),
      animate('{{ duration }}ms', style({ opacity: 0 })),
    ],
    {
      params: {
        duration: 100,
      },
    }
  ),
]);
