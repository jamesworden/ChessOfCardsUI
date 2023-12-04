import { TemplateRef } from '@angular/core';
import { AnimatedMovement } from './animated-movement.model';
import { AnimationType } from './animation-type.model';

export type AnimatedEntity<Context> = {
  template: TemplateRef<Context>;
  context: Context;
  movement: AnimatedMovement;
  /** Corresponds to a class of animations. */
  animationType: AnimationType;
  /** Corresponds to a specific animation within the class of animations that this entity belongs to. */
  animationValue: string;
};
