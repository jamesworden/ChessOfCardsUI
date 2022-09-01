import { PlayedByModel } from './played-by.model';

export type CardModel = {
  Kind: string;
  Suit: string;
  PlayedBy: PlayedByModel;
};
