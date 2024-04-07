import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const movementAnimation = trigger('movement', [
  state(
    'todo',
    style({
      display: 'none',
    })
  ),
  state(
    'completed',
    style({
      top: '{{ toY }}px',
      left: '{{ toX }}px',
      display: 'visible',
    }),
    {
      params: {
        toX: 0,
        toY: 0,
      },
    }
  ),
  transition(
    '* => in-progress',
    [
      style({
        display: 'visible',
      }),
      animate(
        '{{ durationMs }}ms ease',
        keyframes([
          style({ top: '{{ fromY }}px', left: '{{ fromX }}px' }),
          style({ top: '{{ toY }}px', left: '{{ toX }}px' }),
        ])
      ),
      style({
        opacity: 1,
      }),
    ],
    {
      params: {
        toX: 0,
        toY: 0,
        fromX: 0,
        fromY: 0,
        durationMs: 0,
      },
    }
  ),
]);
