import { CandidateMove, Move } from '@shared/models';

export function getCandidateMove(move: Move, candidateMoves?: CandidateMove[]) {
  return candidateMoves?.find((candidateMove) => {
    if (move.PlaceCardAttempts.length === 0) {
      return null;
    }

    const matchingNumAttempts =
      candidateMove.Move.PlaceCardAttempts.length ===
      move.PlaceCardAttempts.length;

    if (!matchingNumAttempts) {
      return null;
    }

    for (const candidateAttempt of candidateMove.Move.PlaceCardAttempts) {
      for (const attempt of move.PlaceCardAttempts) {
        if (attempt.Card.Kind !== candidateAttempt.Card.Kind) {
          continue;
        }
        if (attempt.Card.Suit !== candidateAttempt.Card.Suit) {
          continue;
        }
        if (attempt.TargetLaneIndex !== candidateAttempt.TargetLaneIndex) {
          continue;
        }
        if (attempt.TargetRowIndex !== candidateAttempt.TargetRowIndex) {
          continue;
        }
        return true;
      }
    }

    return false;
  });
}
