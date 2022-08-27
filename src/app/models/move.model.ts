import { CardModel } from './card.model';

export type MoveModel = {
  Card: CardModel;
  TargetLaneIndex: number;
  TargetRowIndex: number;
};
