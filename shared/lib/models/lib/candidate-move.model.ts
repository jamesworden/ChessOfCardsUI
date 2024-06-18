import { Move } from './move.model';

export interface CandidateMove {
  move: Move;
  isValid: boolean;
  invalidReason?: string;
}
