import { DurationOption } from './duration-option.model';
import { Hand } from './hand.model';
import { Lane } from './lane.model';
import { MoveMade } from './move-made.model';

export type PlayerGameView = {
  Hand: Hand;
  Lanes: Lane[];
  NumCardsInOpponentsDeck: number;
  NumCardsInOpponentsHand: number;
  NumCardsInPlayersDeck: number;
  IsHost: boolean;
  IsHostPlayersTurn: boolean;
  RedJokerLaneIndex?: number;
  BlackJokerLaneIndex?: number;
  GameCreatedTimestampUTC: string;
  MovesMade: MoveMade[];
  DurationOption: DurationOption;
  GameEndedTimestampUTC?: string;
  GameCode: string;
};
