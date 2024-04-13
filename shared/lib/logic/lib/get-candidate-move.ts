import { CandidateMove, Move } from '@shared/models';

export function getCandidateMove(move: Move, candidateMoves?: CandidateMove[]) {
  return candidateMoves?.find(
    (candidateMove) =>
      move.PlaceCardAttempts.length ===
        candidateMove.Move.PlaceCardAttempts.length &&
      candidateMove.Move.PlaceCardAttempts.every((candidateAttempt) =>
        move.PlaceCardAttempts.some(
          (attempt) =>
            attempt.Card.Kind === candidateAttempt.Card.Kind &&
            attempt.Card.Suit === candidateAttempt.Card.Suit &&
            attempt.TargetLaneIndex === candidateAttempt.TargetLaneIndex &&
            attempt.TargetRowIndex === candidateAttempt.TargetRowIndex
        )
      )
  );
}
