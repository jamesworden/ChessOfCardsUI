import { KindModel } from './kind.model';
import { PlayedByModel } from './played-by.model';
import { SuitModel } from './suit.model';

export type CardModel = {
  Kind: KindModel;
  Suit: SuitModel;
  PlayedBy: PlayedByModel;
};
