import { CardModel } from './card.model';

export type PlaceCardAttemptModel = {
  Card: CardModel;
  TargetLaneIndex: number;
  TargetRowIndex: number;
};
