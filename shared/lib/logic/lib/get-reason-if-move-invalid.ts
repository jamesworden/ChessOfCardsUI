import { CandidateMove, Move } from '@shared/models';
import { getCandidateMove } from './get-candidate-move';

export function getReasonIfMoveInvalid(
  candidateMoves: CandidateMove[][],
  move: Move
) {
  const candidateMove = getCandidateMove(candidateMoves, move);

  return !candidateMove || !candidateMove?.IsValid
    ? candidateMove?.InvalidReason ??
        'Error: The server has not anticipated that this move was possible.'
    : null;
}
