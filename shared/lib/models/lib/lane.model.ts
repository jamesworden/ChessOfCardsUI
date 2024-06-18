import { Card } from './card.model';
import { PlayerOrNone } from './player-or-none.model';

export type Lane = {
  rows: Card[][];
  laneAdvantage: PlayerOrNone;
  lastCardPlayed?: Card;
  wonBy: PlayerOrNone;
};
