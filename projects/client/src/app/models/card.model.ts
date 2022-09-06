import { KindModel } from './kind.model';
import { PlayerOrNoneModel } from './player-or-none-model';
import { SuitModel } from './suit.model';

export type CardModel = {
  Kind: KindModel;
  Suit: SuitModel;
  PlayedBy: PlayerOrNoneModel;
};
