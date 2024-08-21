import { CandidateMove, Move } from '@shared/models';
import { getCandidateMove } from './get-candidate-move';

export function getReasonIfMoveInvalid(
  move: Move,
  candidateMoves?: CandidateMove[]
) {
  const candidateMove = getCandidateMove(move, candidateMoves);

  return !candidateMove || !candidateMove?.isValid
    ? candidateMove?.invalidReason ??
        'Error: The server has not anticipated that this move was possible.'
    : null;
}
