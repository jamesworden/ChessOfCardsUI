import { CardModel } from './card.model';

export type MoveModel = {
  card: CardModel;
  targetLaneIndex: number;
  targetRowIndex: number;
};
