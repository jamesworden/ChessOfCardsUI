import { Hand } from './hand';
import { Lane } from './lane';

export type PlayerGameState = {
  Hand: Hand;
  Lanes: Lane[];
  NumCardsInOpponentsDeck: number;
  NumCardsInOpponentsHand: number;
  NumCardsInPlayersDeck: number;
};
