import { MoveModel } from './move.model';
import { PlayerOrNoneModel } from './player-or-none-model';

export type MoveMadeModel = {
  PlayedBy: PlayerOrNoneModel;
  Move: MoveModel;
  TimestampUTC: string;
};
