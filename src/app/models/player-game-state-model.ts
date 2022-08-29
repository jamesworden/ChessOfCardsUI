import { HandModel } from './hand.model';
import { LaneModel } from './lane.model';

export type PlayerGameStateModel = {
  Hand: HandModel;
  Lanes: LaneModel[];
  NumCardsInOpponentsDeck: number;
  NumCardsInOpponentsHand: number;
  NumCardsInPlayersDeck: number;
  IsHost: boolean;
  IsHostPlayersTurn: boolean;
};
