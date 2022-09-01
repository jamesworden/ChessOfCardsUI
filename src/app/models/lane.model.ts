import { CardModel } from './card.model';
import { LaneAdvantageModel } from './lane-advantage.model';

export type LaneModel = {
  Rows: CardModel[][];
  LaneAdvantage: LaneAdvantageModel;
  LastCardPlayed: CardModel;
};
