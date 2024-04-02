import { CardPosition } from './card-position.model';

export type CardStore = {
  HostHandCardIndex: number | null;
  GuestHandCardIndex: number | null;
  CardPosition: CardPosition | null;
  Destroyed: boolean;
  HostDeck: boolean;
  GuestDeck: boolean;
};
