import { Kind } from './kind.model';
import { PlayerOrNone } from './player-or-none.model';
import { Suit } from './suit.model';

export type Card = {
  Kind: Kind;
  Suit: Suit;
  PlayedBy: PlayerOrNone;
};
