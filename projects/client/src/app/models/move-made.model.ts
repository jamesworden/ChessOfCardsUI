import { Move } from './move.model';
import { PlayerOrNone } from './player-or-none.model';

export type MoveMade = {
  PlayedBy: PlayerOrNone;
  Move: Move;
  TimestampUTC: string;
};
