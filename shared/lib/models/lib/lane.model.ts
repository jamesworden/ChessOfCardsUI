import { Card } from './card.model';
import { PlayerOrNone } from './player-or-none.model';

export type Lane = {
  Rows: Card[][];
  LaneAdvantage: PlayerOrNone;
  LastCardPlayed?: Card;
  WonBy: PlayerOrNone;
};
