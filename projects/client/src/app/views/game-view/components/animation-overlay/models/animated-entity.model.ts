import { TemplateRef } from '@angular/core';
import { AnimatedMovement } from './animated-movement.model';
import { AnimationType } from './animation-type.model';

export type AnimatedEntityStyles = {
  before: AnimatedEntityStyle;
  after: AnimatedEntityStyle;
};

export type AnimatedEntityStyle = {
  [key: string]: string;
};

export type AnimatedEntity<Context> = {
  template: TemplateRef<Context>;
  context: Context;
  movement: AnimatedMovement;
  /** Corresponds to a class of animations. */
  animationType: AnimationType;
  styles?: AnimatedEntityStyles;
};
