import { CardStore } from './card-store.model';
import { Card } from './card.model';

export type CardMovement = {
  From?: CardStore;
  To?: CardStore;
  Card: Card;
};
