import { Kind } from './kind.model';
import { PlayerOrNone } from './player-or-none.model';
import { Suit } from './suit.model';

export type Card = {
  kind: Kind;
  suit: Suit;
  playedBy: PlayerOrNone;
  customStyles?: {
    [key: string]: string;
  };
};
