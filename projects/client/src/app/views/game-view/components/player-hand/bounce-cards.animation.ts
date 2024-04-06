import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const bounceCardAnimation = trigger('bounceCards', [
  transition(
    'not-bouncing => bouncing',
    [
      query('game-card', [
        style({ transform: 'none' }),
        stagger(150, [
          animate(
            '100ms ease',
            style({ transform: 'translateY({{ heightPx }}px)' })
          ),
          animate('100ms ease', style({ transform: 'none' })),
        ]),
      ]),
    ],
    {
      params: {
        heightPx: 0,
      },
    }
  ),
]);
