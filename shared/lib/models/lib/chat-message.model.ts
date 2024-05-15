import { PlayerOrNone } from './player-or-none.model';

export type ChatMessage = {
  Message: string;
  SentAtUTC: Date;
  SentBy: PlayerOrNone;
};
