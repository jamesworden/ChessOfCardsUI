import { PlayerOrNone } from './player-or-none.model';

export type ChatMessage = {
  message: string;
  sentAtUTC: Date;
  sentBy: PlayerOrNone;
};
