import { animate, state, style, transition, trigger } from '@angular/animations';

export const fadeOutAnimation = trigger('fadeOut', [
  state(
    'todo',
    style({
      top: '{{y}}px',
      left: '{{x}}px',
      opacity: 1,
    }),
    {
      params: {
        x: 0,
        y: 0,
      },
    }
  ),
  state(
    'in-progress',
    style({
      top: '{{y}}px',
      left: '{{x}}px',
      opacity: 0,
    }),
    {
      params: {
        x: 0,
        y: 0,
      },
    }
  ),
  state(
    'completed',
    style({
      top: '{{y}}px',
      left: '{{x}}px',
      opacity: 0,
    }),
    {
      params: {
        x: 0,
        y: 0,
      },
    }
  ),
  transition('* => in-progress', animate('{{durationMs}}ms ease-in-out')),
])