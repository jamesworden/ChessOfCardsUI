import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const cardMovementAnimation = trigger('cardMovement', [
  state(
    'todo',
    // Off screen hack
    style({
      top: '-200px',
      left: '-200px',
    })
  ),
  state(
    'completed',
    style({
      top: '{{ toY }}px',
      left: '{{ toX }}px',
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
