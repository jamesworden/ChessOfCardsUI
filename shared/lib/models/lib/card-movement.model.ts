import { CardStore } from './card-store.model';
import { Card } from './card.model';

export type CardMovement = {
  from: CardStore;
  to: CardStore;
  card?: Card;
  notation?: string;
};
