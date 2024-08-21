import { CardMovement } from './card-movement.model';
import { Move } from './move.model';
import { PlayerOrNone } from './player-or-none.model';

export type MoveMade = {
  playedBy: PlayerOrNone;
  move: Move;
  timestampUTC: string;
  cardMovements: CardMovement[][];
  passedMove: boolean;
};
