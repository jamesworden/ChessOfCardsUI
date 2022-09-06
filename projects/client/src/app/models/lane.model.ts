import { CardModel } from './card.model';
import { PlayerOrNoneModel } from './player-or-none-model';

export type LaneModel = {
  Rows: CardModel[][];
  LaneAdvantage: PlayerOrNoneModel;
  LastCardPlayed?: CardModel;
  WonBy: PlayerOrNoneModel;
};
