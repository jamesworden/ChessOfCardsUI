import { Move } from './move.model';

export interface CandidateMove {
  Move: Move;
  IsValid: boolean;
  InvalidReason?: string;
}
