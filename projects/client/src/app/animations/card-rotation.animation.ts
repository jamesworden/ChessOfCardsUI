import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const cardRotationAnimation = trigger('cardRotation', [
  state(
    'void, not-rotating',
    style({ transform: 'rotate({{ fromRotate }})' }),
    {
      params: {
        fromRotate: '0deg',
      },
    }
  ),
  state('rotating', style({ transform: 'rotate({{ toRotate }})' }), {
    params: {
      toRotate: '0deg',
    },
  }),
  transition(
    'not-rotating => rotating, void => rotating',
    animate('{{ durationMs }}ms ease-out'),
    {
      params: {
        durationMs: 500,
      },
    }
  ),
]);
