import { HandModel } from './hand.model';
import { LaneModel } from './lane.model';
import { MoveMadeModel } from './move-made.model';

export type PlayerGameStateModel = {
  Hand: HandModel;
  Lanes: LaneModel[];
  NumCardsInOpponentsDeck: number;
  NumCardsInOpponentsHand: number;
  NumCardsInPlayersDeck: number;
  IsHost: boolean;
  IsHostPlayersTurn: boolean;
  RedJokerLaneIndex?: number;
  BlackJokerLaneIndex?: number;
  GameCreatedTimestampUTC: string;
  MovesMade: MoveMadeModel[];
};
