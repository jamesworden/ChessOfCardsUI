import { Card } from './card.model';

export type PlaceCardAttempt = {
  card: Card;
  targetLaneIndex: number;
  targetRowIndex: number;
};
