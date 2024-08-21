import { CandidateMove, Move } from '@shared/models';

export function getCandidateMove(move: Move, candidateMoves?: CandidateMove[]) {
  return candidateMoves?.find(
    (candidateMove) =>
      move.placeCardAttempts.length ===
        candidateMove.move.placeCardAttempts.length &&
      candidateMove.move.placeCardAttempts.every((candidateAttempt) =>
        move.placeCardAttempts.some(
          (attempt) =>
            attempt.card.kind === candidateAttempt.card.kind &&
            attempt.card.suit === candidateAttempt.card.suit &&
            attempt.targetLaneIndex === candidateAttempt.targetLaneIndex &&
            attempt.targetRowIndex === candidateAttempt.targetRowIndex
        )
      )
  );
}
