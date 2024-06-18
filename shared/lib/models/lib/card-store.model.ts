import { CardPosition } from './card-position.model';

export type CardStore = {
  hostHandCardIndex: number | null;
  guestHandCardIndex: number | null;
  cardPosition: CardPosition | null;
  destroyed: boolean;
  hostDeck: boolean;
  guestDeck: boolean;
};
