import { PlayerOrNone } from './player-or-none.model';

export enum GameOverReason {
  DrawByAgreement = 'DrawByAgreement',
  Disconnected = 'Disconnected',
  Won = 'Won',
  Resigned = 'Resigned',
  RanOutOfTime = 'RanOutOfTime',
  DrawByRepetition = 'DrawByRepitition',
}
