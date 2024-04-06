import { Card } from './card.model';

export type PlaceCardAttempt = {
  Card: Card;
  TargetLaneIndex: number;
  TargetRowIndex: number;
};
